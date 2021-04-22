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

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { View } from 'src/app/shared/model/view.model';
import { AclFacade } from '../abstraction/acl.facade';
import { Acl } from '../model/acl.model';
import { RequestModalComponent } from './request-modal/request-modal.component';

/**
 *
 *
 * @export
 * @class AclComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-acl',
  templateUrl: './acl.component.html',
  styleUrls: ['./acl.component.scss'],
})
export class AclComponent implements OnInit {
  /**
   * List of acls
   *
   * @type {Observable<View<Acl[]>>}
   * @memberof AclComponent
   */
  public acls$: Observable<View<Acl[]>>;

  /**
   * @constructor AclComponent
   * @param {MatDialog} dialog
   * @param {AclFacade} aclFacade
   * @memberof AclComponent
   */
  constructor(private dialog: MatDialog, private aclFacade: AclFacade) {
    this.acls$ = this.aclFacade.acls$;
  }

  /**
   * Angular lifecycle method - Ng On Init
   *
   * @return {void}
   * @memberof AclComponent
   */
  ngOnInit(): void {
    this.aclFacade.setAcls();
  }

  /**
   * Request access modal
   *
   * @param {string} label
   * @param {string} [entity]
   * @return {void}
   * @memberof AclComponent
   */
  public openModal(label: string, entity?: string): void {
    const dialogRef = this.dialog.open(RequestModalComponent, {
      height: '520px',
      width: '600px',
      data: {
        btnLabel: label,
        entity,
      },
      panelClass: 'custom-dialog-container',
    });
    dialogRef.afterClosed().subscribe((data: { entity: string; comment: string }) => {
      if (data) {
        this.aclFacade.requestAccess(data.entity, data.comment);
      }
    });
  }

  /**
   * Update access event
   *
   * @param {{ btnLabel: string; entity: string }} request
   * @return {void}
   * @memberof AclComponent
   */
  public updateAccess(request: { btnLabel: string; entity: string }): void {
    this.openModal(request.btnLabel, request.entity);
  }
}
