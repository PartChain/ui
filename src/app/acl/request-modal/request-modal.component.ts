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

import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { flatten, uniq } from 'lodash-es';
import { catchError, map } from 'rxjs/operators';
import { Subject, EMPTY, zip } from 'rxjs';
import { ACLResponseModel } from 'src/app/core/api/api-response.model';
import { NotificationService } from 'src/app/shared/notifications/notification.service';
import { AclService } from '../acl.service';
import { RequestModel } from './request.model';
import { SharedService } from 'src/app/shared/shared.service';

/**
 *
 *
 * @export
 * @class RequestModalComponent
 */
@Component({
  selector: 'app-request-modal',
  templateUrl: './request-modal.component.html',
  styleUrls: ['./request-modal.component.scss'],
})
export class RequestModalComponent {
  /**
   * List of entities
   *
   * @type {FormControl}
   * @memberof RequestModalComponent
   */
  public entity = new FormControl('', Validators.required);

  /**
   * Request comment
   *
   * @type {ElementRef}
   * @memberof RequestModalComponent
   */
  @ViewChild('comment', { read: ElementRef }) comment: ElementRef;

  /**
   * Merged recommended and inactive entities to request access
   *
   * @type {Observable<string[]>}
   * @memberof RequestModalComponent
   */
  public entities$ = zip(
    this.aclService.getAccessRecommendations(),
    this.aclService.inactiveEntities.asObservable(),
  ).pipe(
    map(entities => uniq(flatten(entities))),
    catchError(err => {
      this.errorMessageSubject.next(err);
      this.notificationService.error(err);
      return EMPTY;
    }),
  );

  /**
   * Handles form validation errors
   *
   * @type {boolean}
   * @memberof RequestModalComponent
   */
  public hasError = false;

  /**
   * Error message handler
   *
   * @type {Subject<string>}
   * @private
   * @memberof RequestModalComponent
   */
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  /**
   * @constructor RequestModalComponent.
   * @param {MatDialogRef<RequestModalComponent>} dialogRef
   * @param {AclService} aclService
   * @param {RequestModel} data
   * @param {NotificationService} notificationService
   * @param {SharedService} sharedService
   * @memberof RequestModalComponent
   */
  constructor(
    public dialogRef: MatDialogRef<RequestModalComponent>,
    private aclService: AclService,
    @Inject(MAT_DIALOG_DATA) public data: RequestModel,
    private notificationService: NotificationService,
    private sharedService: SharedService,
  ) {
    dialogRef.disableClose = true;
  }

  /**
   * Close modal event
   *
   * @return {void}
   * @memberof RequestModalComponent
   */
  public dialogClose(): void {
    this.dialogRef.close();
  }

  /**
   * Request access
   *
   * @return {void}
   * @memberof RequestModalComponent
   */
  public sendRequest(): void {
    const entity = {
      update: this.data.entity,
      request: this.entity.value,
    };
    if (entity[this.data.btnLabel]) {
      this.aclService.requestAccess(entity[this.data.btnLabel], this.comment.nativeElement.value).subscribe(
        (response: ACLResponseModel) => {
          this.dialogClose();
          if (response.status === 200) {
            this.notificationService.success('Request sent');
          }
          this.aclService.updateAcls.next(true);
        },
        catchError(err => {
          this.errorMessageSubject.next(err);
          this.notificationService.error(err);
          return EMPTY;
        }),
      );
    } else {
      this.hasError = true;
    }
  }
}
