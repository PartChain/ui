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
import { Acl } from '../../model/acl.model';

/**
 *
 *
 * @export
 * @class AclListComponent
 * @implements {OnChanges}
 */
@Component({
  selector: 'app-acl-list',
  templateUrl: './acl-list.component.html',
  styleUrls: ['./acl-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AclListComponent implements OnChanges {
  /**
   * List of acls
   *
   * @type {Acl[]}
   * @memberof AclListComponent
   */
  @Input() acls: Acl[];

  /**
   * Acl owner
   *
   * @type {string}
   * @memberof AclListComponent
   */
  @Input() owner: string;

  /**
   * Active tab
   *
   * @type {string}
   * @memberof AclListComponent
   */
  @Input() activeTab: string;

  /**
   * History event emitter
   *
   * @type {EventEmitter<string[]>}
   * @memberof AclListComponent
   */
  @Output() getHistory: EventEmitter<string[]> = new EventEmitter<string[]>();

  /**
   * Remove access event emitter
   *
   * @type {EventEmitter<string>}
   * @memberof AclListComponent
   */
  @Output() removeAccessEmitter: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Deny access event emitter
   *
   * @type {EventEmitter<string>}
   * @memberof AclListComponent
   */
  @Output() denyAccessEmitter: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Accept access event emitter
   *
   * @type {EventEmitter<string>}
   * @memberof AclListComponent
   */
  @Output() acceptAccessEmitter: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Update access event emitter
   *
   * @type {EventEmitter<{
   *     btnLabel: string;
   *     entity: string;
   *   }>}
   * @memberof AclListComponent
   */
  @Output() updateAccessEmitter: EventEmitter<{
    btnLabel: string;
    entity: string;
  }> = new EventEmitter<{ btnLabel: string; entity: string }>();

  /**
   * Selected acl
   *
   * @type {Acl}
   * @memberof AclListComponent
   */
  public acl: Acl = {} as Acl;

  /**
   * Angular lifecycle method - Ng On Changes
   *
   * @param {SimpleChanges} changes
   * @return {void}
   * @memberof AclListComponent
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.acls.currentValue.length > 0) {
      this.acl = this.acls[0];
    }
  }

  /**
   * Get an acl at a certain position of the list
   *
   * @param {number} index
   * @return {void}
   * @memberof AclListComponent
   */
  public getAcl(index: number): void {
    this.acl = this.acls[index];
  }

  /**
   * Get history event
   *
   * @param {string[]} id
   * @return {void}
   * @memberof AclListComponent
   */
  public emitGetHistory(id: string[]): void {
    this.getHistory.emit(id);
  }

  /**
   * Remove access event
   *
   * @param {string} targetOrg
   * @return {void}
   * @memberof AclListComponent
   */
  public removeAccess(targetOrg: string): void {
    if (targetOrg) {
      this.removeAccessEmitter.emit(targetOrg);
    }
  }

  /**
   * Deny access event
   *
   * @param {string} targetOrg
   * @return {void}
   * @memberof AclListComponent
   */
  public denyAccess(targetOrg: string): void {
    if (targetOrg) {
      this.denyAccessEmitter.emit(targetOrg);
    }
  }

  /**
   * Accept access event
   *
   * @param {string} targetOrg
   * @return {void}
   * @memberof AclListComponent
   */
  public acceptAccess(targetOrg: string): void {
    if (targetOrg) {
      this.acceptAccessEmitter.emit(targetOrg);
    }
  }

  /**
   * Request access event
   *
   * @param {{ btnLabel: string; entity: string }} request
   * @return {void}
   * @memberof AclListComponent
   */
  public requestAccess(request: { btnLabel: string; entity: string }): void {
    if (request) {
      this.updateAccessEmitter.emit({
        btnLabel: request.btnLabel,
        entity: request.entity,
      });
    }
  }
}
