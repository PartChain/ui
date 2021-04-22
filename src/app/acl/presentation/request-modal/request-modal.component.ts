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

import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AclFacade } from '../../abstraction/acl.facade';
import { RequestModel } from '../../model/request.model';

/**
 *
 *
 * @export
 * @class RequestModalComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-request-modal',
  templateUrl: './request-modal.component.html',
  styleUrls: ['./request-modal.component.scss'],
})
export class RequestModalComponent implements OnInit {
  /**
   * Html comment element
   *
   * @type {ElementRef}
   * @memberof RequestModalComponent
   */
  @ViewChild('comment', { read: ElementRef }) comment: ElementRef;

  /**
   * Entity form control
   *
   * @type {FormControl}
   * @memberof RequestModalComponent
   */
  public entity: FormControl = new FormControl('', Validators.required);

  /**
   * Error flag
   *
   * @type {boolean}
   * @memberof RequestModalComponent
   */
  public hasError = false;

  /**
   * Entities list
   *
   * @type {Observable<string[]>}
   * @memberof RequestModalComponent
   */
  public entities$: Observable<string[]>;

  /**
   * @constructor RequestModalComponent
   * @param {MatDialogRef<RequestModalComponent>} dialogRef
   * @param {RequestModel} data
   * @param {AclFacade} aclFacade
   * @memberof RequestModalComponent
   */
  constructor(
    public dialogRef: MatDialogRef<RequestModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestModel,
    private aclFacade: AclFacade,
  ) {
    dialogRef.disableClose = true;
    this.entities$ = this.aclFacade.accessRecommendations$;
  }

  /**
   * Angular lifecycle method - Ng On Init
   *
   * @return {void}
   * @memberof RequestModalComponent
   */
  ngOnInit(): void {
    this.aclFacade.setRecommendedEntities();
  }

  /**
   * Dialog close event
   *
   * @return {void}
   * @memberof RequestModalComponent
   */
  public dialogClose(): void {
    this.dialogRef.close();
  }

  /**
   * Send request event
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
      this.dialogRef.close({ entity: entity[this.data.btnLabel], comment: this.comment.nativeElement.value });
    } else {
      this.hasError = true;
    }
  }
}
