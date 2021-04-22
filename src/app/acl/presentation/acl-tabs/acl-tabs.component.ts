/*
 * Copyright 2021 The PartChain Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { AclFacade } from '../../abstraction/acl.facade';
import { Acl, HistoryAcl } from '../../model/acl.model';

/**
 *
 *
 * @export
 * @class AclTabsComponent
 * @implements {OnChanges}
 */
@Component({
  selector: 'app-acl-tabs',
  templateUrl: './acl-tabs.component.html',
  styleUrls: ['./acl-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AclTabsComponent implements OnChanges {
  /**
   * List of acls
   *
   * @type {Acl[]}
   * @memberof AclTabsComponent
   */
  @Input() acls: Acl[];

  /**
   * Update access event emitter
   *
   * @type {EventEmitter<{
   *     btnLabel: string;
   *     entity: string;
   *   }>}
   * @memberof AclTabsComponent
   */
  @Output() updateAccessEmitter: EventEmitter<{
    btnLabel: string;
    entity: string;
  }> = new EventEmitter<{ btnLabel: string; entity: string }>();

  /**
   * Pending acls
   *
   * @type {Acl[]}
   * @memberof AclTabsComponent
   */
  public pending: Acl[];

  /**
   * Active acls
   *
   * @type {Acl[]}
   * @memberof AclTabsComponent
   */
  public active: Acl[];

  /**
   * Inactive acls
   *
   * @type {Acl[]}
   * @memberof AclTabsComponent
   */
  public inactive: Acl[];

  /**
   * Acls history state
   *
   * @type {Observable<HistoryAcl>}
   * @memberof AclTabsComponent
   */
  public history$: Observable<HistoryAcl>;

  /**
   * Active tab
   *
   * @type {string}
   * @memberof AclTabsComponent
   */
  public activeTab = 'pending';

  /**
   * @constructor AclTabsComponent
   * @param {AclFacade} aclFacade
   * @param {MatDialog} dialog
   * @memberof AclTabsComponent
   */
  constructor(private aclFacade: AclFacade, private dialog: MatDialog) {}

  /**
   * Angular lifecycle method - Ng On Changes
   *
   * @param {SimpleChanges} changes
   * @return {void}
   * @memberof AclTabsComponent
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.acls) {
      const acls: Acl[] = changes.acls.currentValue;
      this.pending = acls.filter(acl => acl.status === 'PENDING');
      this.active = acls.filter(acl => acl.status === 'ACTIVE');
      this.inactive = acls.filter(acl => acl.status === 'INACTIVE');
    }
  }

  /**
   * Active tab event
   *
   * @param {string} event
   * @return {void}
   * @memberof AclTabsComponent
   */
  public getActiveTab(event: string): void {
    this.activeTab = event;
  }

  /**
   *
   *
   * @param {string[]} id
   * @return {void}
   * @memberof AclTabsComponent
   */
  public getHistory(id: string[]): void {
    this.aclFacade.setAclHistory(id);
    this.history$ = this.aclFacade.aclHistory$;
  }

  /**
   * Reset history to it's initial value
   *
   * @param {boolean} isReset
   * @return {void}
   * @memberof AclTabsComponent
   */
  public resetHistory(isReset: boolean): void {
    this.aclFacade.resetHistory(isReset);
  }

  /**
   * Request access event
   *
   * @param {{ btnLabel: string; entity: string }} request
   * @return {void}
   * @memberof AclTabsComponent
   */
  public requestAccess(request: { btnLabel: string; entity: string }): void {
    if (request) {
      this.updateAccessEmitter.emit({
        btnLabel: request.btnLabel,
        entity: request.entity,
      });
    }
  }

  /**
   * Remove access event
   *
   * @param {string} targetOrg
   * @return {void}
   * @memberof AclTabsComponent
   */
  public removeAccess(targetOrg: string): void {
    const message = `Are you sure you want to remove ${targetOrg} access?`;
    const dialogData = new ConfirmDialogModel('Remove Access', message, 'error', true);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      panelClass: 'custom-dialog-container',
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.aclFacade.removeAclAccess(targetOrg, dialogRef.componentInstance.comment.nativeElement.value);
      }
    });
  }

  /**
   * Deny access event
   *
   * @param {string} targetOrg
   * @return {void}
   * @memberof AclTabsComponent
   */
  public denyAccess(targetOrg: string): void {
    const message = `You are about to deny data exchange with ${targetOrg}`;
    const dialogData = new ConfirmDialogModel('Deny Access', message, 'error', true);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      panelClass: 'custom-dialog-container',
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.aclFacade.denyAclAccess(targetOrg, dialogRef.componentInstance.comment.nativeElement.value);
      }
    });
  }

  /**
   * Accept access event
   *
   * @param {string} targetOrg
   * @return {void}
   * @memberof AclTabsComponent
   */
  public acceptAccess(targetOrg: string): void {
    const message = `You are about to accept data exchange with ${targetOrg}`;
    const dialogData = new ConfirmDialogModel('Accept Access', message, 'success', true);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      panelClass: 'custom-dialog-container',
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.aclFacade.acceptAclAccess(targetOrg, dialogRef.componentInstance.comment.nativeElement.value);
      }
    });
  }
}
