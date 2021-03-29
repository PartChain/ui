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

import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { ACLResponseModel } from 'src/app/core/api/api-response.model';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { NotificationText } from 'src/app/shared/notifications/notification-message/notification-text';
import { NotificationService } from 'src/app/shared/notifications/notification.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Acl } from '../../acl.model';
import { AclService } from '../../acl.service';
import { RequestModalComponent } from '../../request-modal/request-modal.component';

/**
 *
 *
 * @export
 * @class AclDetailComponent
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-acl-detail',
  templateUrl: './acl-detail.component.html',
  styleUrls: ['./acl-detail.component.scss'],
})
export class AclDetailComponent implements OnDestroy {
  /**
   * Acl type
   *
   * @type {string}
   * @memberof AclDetailComponent
   */
  @Input() type: string;

  /**
   * Selected acl
   *
   * @type {Acl}
   * @memberof AclDetailComponent
   */
  @Input() acl: Acl;

  /**
   * Acl owner
   *
   * @type {string}
   * @memberof AclDetailComponent
   */
  @Input() owner: string;

  /**
   * Unsubscribe observable
   *
   * @private
   * @type {Subject<void>}
   * @memberof AclDetailComponent
   */
  private unsubscribe$: Subject<void> = new Subject<void>();

  /**
   * Error message handler
   *
   * @private
   * @type {Subject<string>}
   * @memberof AclDetailComponent
   */
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  /**
   * @constructor AclDetailComponent.
   * @param {SharedService} sharedService
   * @param {AclService} aclService
   * @param {MatDialog} dialog
   * @param {NotificationService} notificationService
   * @memberof AclDetailComponent
   */
  constructor(
    private sharedService: SharedService,
    private aclService: AclService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
  ) {}

  /**
   * Angular lifecycle method - On Destroy
   *
   * @return {void}
   * @memberof AclDetailComponent
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Helper method to uppercase the first letter
   *
   * @param {string} word
   * @return {string}
   * @memberof AclDetailComponent
   */
  public firstLetterToUpperCase(word: string): string {
    return this.sharedService.firstLetterToUpperCase(word);
  }

  /**
   * Get acl id
   *
   * @param {string[]} entities
   * @return {string}
   * @memberof AclDetailComponent
   */
  public getId(entities: string[]): string {
    return this.aclService.getId(entities);
  }

  /**
   * Get target org
   *
   * @param {string[]} entities
   * @param {string} changedBy
   * @return {string}
   * @memberof AclDetailComponent
   */
  public getTargetOrg(entities: string[], changedBy: string): string {
    return this.aclService.getTargetOrg(entities, changedBy);
  }

  /**
   * Request access modal
   *
   * @param {string} label
   * @return {void}
   * @memberof AclDetailComponent
   */
  public openModal(label: string): void {
    this.dialog.open(RequestModalComponent, {
      height: '520px',
      width: '600px',
      data: {
        btnLabel: label,
        entity: this.getTargetOrg(this.acl.entities, this.owner),
      },
      panelClass: 'custom-dialog-container',
    });
  }

  /**
   * Acl history event emitter
   *
   * @param {boolean} event
   * @return {void}
   * @memberof AclDetailComponent
   */
  public emitEvent(event: boolean): void {
    if (event) {
      this.aclService.historySubject.next(this.acl);
    }
  }

  /**
   * Remove access request
   *
   * @return {void}
   * @memberof AclDetailComponent
   */
  public removeAccess(): void {
    const message = `Are you sure you want to remove ${this.getTargetOrg(this.acl.entities, this.owner)} access?`;
    const dialogData = new ConfirmDialogModel('Remove Access', message, 'error', true);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      panelClass: 'custom-dialog-container',
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.aclService
          .removeAccess(
            this.getTargetOrg(this.acl.entities, this.owner),
            dialogRef.componentInstance.comment.nativeElement.value,
          )
          .subscribe((acl: ACLResponseModel) => {
            if (acl.status === 200) {
              this.notificationService.success(NotificationText.AccessRemoved);
              this.aclService.updateAcls.next(true);
            }
          }),
          takeUntil(this.unsubscribe$),
          catchError(err => {
            this.errorMessageSubject.next(err);
            this.notificationService.error(err);
            return EMPTY;
          });
      }
    });
  }

  /**
   * Deny access request
   *
   * @return {void}
   * @memberof AclDetailComponent
   */
  public denyAccess(): void {
    const message = `You are about the deny data exchange with ${this.getTargetOrg(this.acl.entities, this.owner)}.`;
    const dialogData = new ConfirmDialogModel('Deny Access', message, 'error', true);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      panelClass: 'custom-dialog-container',
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.aclService
          .denyRequest(
            this.getTargetOrg(this.acl.entities, this.owner),
            dialogRef.componentInstance.comment.nativeElement.value,
          )
          .subscribe((acl: ACLResponseModel) => {
            if (acl.status === 200) {
              this.notificationService.success(NotificationText.AccessDenied);
              this.aclService.updateAcls.next(true);
            }
          }),
          takeUntil(this.unsubscribe$),
          catchError(err => {
            this.errorMessageSubject.next(err);
            this.notificationService.error(err);
            return EMPTY;
          });
      }
    });
  }

  /**
   * Accept access request
   *
   * @return {void}
   * @memberof AclDetailComponent
   */
  public acceptAccess(): void {
    const message = `You are about the accept data exchange with ${this.getTargetOrg(this.acl.entities, this.owner)}.`;
    const dialogData = new ConfirmDialogModel('Accept Access', message, 'success', true);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      panelClass: 'custom-dialog-container',
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.aclService
          .acceptRequest(
            this.getTargetOrg(this.acl.entities, this.owner),
            dialogRef.componentInstance.comment.nativeElement.value,
          )
          .subscribe((acl: ACLResponseModel) => {
            if (acl.status === 200) {
              this.notificationService.success(NotificationText.AccessGranted);
            }
            this.aclService.updateAcls.next(true);
          }),
          takeUntil(this.unsubscribe$),
          catchError(err => {
            this.errorMessageSubject.next(err);
            this.notificationService.error(err);
            return EMPTY;
          });
      }
    });
  }
}
