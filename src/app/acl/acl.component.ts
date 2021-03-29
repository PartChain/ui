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

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../core/user/user.service';
import { AclService } from './acl.service';
import { RequestModalComponent } from './request-modal/request-modal.component';

/**
 *
 *
 * @export
 * @class AclComponent
 */
@Component({
  selector: 'app-acl',
  templateUrl: './acl.component.html',
  styleUrls: ['./acl.component.scss'],
})
export class AclComponent {
  /**
   * Pending acls
   *
   * @type {Observable<Acl[]>}
   * @memberof AclComponent
   */
  public pending$ = this.aclService.pendingAcls.asObservable();

  /**
   * Active acls
   *
   * @type {Observable<Acl[]>}
   * @memberof AclComponent
   */
  public active$ = this.aclService.activeAcls.asObservable();

  /**
   * Inactive acls
   *
   * @type {Observable<Acl[]>}
   * @memberof AclComponent
   */
  public inactive$ = this.aclService.inactiveAcls.asObservable();

  /**
   * Acl owner
   *
   * @type {Observable<string>}
   * @memberof AclComponent
   */
  public owner$ = this.aclService.owner.asObservable();

  /**
   * Acl history
   *
   * @type {Observable<Acl>}
   * @memberof AclComponent
   */
  public historyObservable = this.aclService.historySubject.asObservable();

  /**
   * Active tab
   *
   * @type {string}
   * @memberof AclComponent
   */
  public activeTab = 'pending';

  /**
   * Acl owner
   *
   * @type {string}
   * @memberof AclComponent
   */
  public owner = '';

  /**
   * @constructor AclComponent.
   * @param {AclService} aclService
   * @param {MatDialog} dialog
   * @param {UserService} userService
   * @memberof AclComponent
   */
  constructor(private aclService: AclService, private dialog: MatDialog, private userService: UserService) {
    this.updateAcls();
    this.getOwner();
    this.getEntities();
  }

  /**
   * Gets the active tab
   *
   * @param {string} event
   * @return {void}
   * @memberof AclComponent
   */
  public getActiveTab(event: string): void {
    this.activeTab = event;
  }

  /**
   * Request access modal
   *
   * @param {string} label
   * @return {void}
   * @memberof AclComponent
   */
  public openModal(label: string): void {
    this.dialog.open(RequestModalComponent, {
      height: '520px',
      width: '600px',
      data: {
        btnLabel: label,
        entity: null,
      },
      panelClass: 'custom-dialog-container',
    });
  }

  /**
   * Returns to the acl list after clicking back from the acl history
   *
   * @return {void}
   * @memberof AclComponent
   */
  public goBack(): void {
    this.aclService.historySubject.next(undefined);
    this.activeTab = 'pending';
    this.updateAcls();
  }

  /**
   * Gets the acl target org
   *
   * @param {string[]} entities
   * @param {string} owner
   * @return {string}
   * @memberof AclComponent
   */
  public getTargetOrg(entities: string[], owner: string): string {
    return this.aclService.getTargetOrg(entities, owner);
  }

  /**
   * Subscribes the update acls observable to refresh the acls list
   *
   * @private
   * @return {void}
   * @memberof AclComponent
   */
  private updateAcls(): void {
    this.aclService.updateAcls.subscribe(value => {
      if (value) {
        this.aclService.getAcls();
      }
    });
  }

  /**
   * Subscribes to get the acl owner
   *
   * @private
   * @return {void}
   * @memberof AclComponent
   */
  private getOwner(): void {
    this.owner$.subscribe(value => (this.owner = value));
  }

  /**
   * Subscribes to get the entities from the inactive acls
   *
   * @private
   * @return {void}
   * @memberof AclComponent
   */
  private getEntities(): void {
    this.inactive$.subscribe(acls => {
      acls.forEach(value =>
        this.aclService.inactiveEntities.next(
          value.entities.filter(entity => !entity.includes(this.userService.getMspid())),
        ),
      );
    });
  }
}
