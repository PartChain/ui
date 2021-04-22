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

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Acl } from '../../../model/acl.model';

/**
 *
 *
 * @export
 * @class AclDetailComponent
 */
@Component({
  selector: 'app-acl-detail',
  templateUrl: './acl-detail.component.html',
  styleUrls: ['./acl-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AclDetailComponent {
  /**
   * Active tab
   *
   * @type {string}
   * @memberof AclDetailComponent
   */
  @Input() activeTab: string;

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
   * Type of detail (acl list or acl history)
   *
   * @type {string}
   * @memberof AclDetailComponent
   */
  @Input() typeOfDetail: string;

  /**
   * History event emitter
   *
   * @type {EventEmitter<string[]>}
   * @memberof AclDetailComponent
   */
  @Output() getHistory: EventEmitter<string[]> = new EventEmitter<string[]>();

  /**
   * Remove access event emitter
   *
   * @type {EventEmitter<string>}
   * @memberof AclDetailComponent
   */
  @Output() removeAccessEmitter: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Deny access event emitter
   *
   * @type {EventEmitter<string>}
   * @memberof AclDetailComponent
   */
  @Output() denyAccessEmitter: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Accept access event emitter
   *
   * @type {EventEmitter<string>}
   * @memberof AclDetailComponent
   */
  @Output() acceptAccessEmitter: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Update access event emitter
   *
   * @type {EventEmitter<{
   *     btnLabel: string;
   *     entity: string;
   *   }>}
   * @memberof AclDetailComponent
   */
  @Output() updateAccessEmitter: EventEmitter<{
    btnLabel: string;
    entity: string;
  }> = new EventEmitter<{ btnLabel: string; entity: string }>();

  /**
   * Get history event
   *
   * @param {string[]} id
   * @return {void}
   * @memberof AclDetailComponent
   */
  public emitGetHistory(id: string[]): void {
    this.getHistory.emit(id);
  }

  /**
   * Remove access event
   *
   * @return {void}
   * @memberof AclDetailComponent
   */
  public removeAccess(): void {
    this.removeAccessEmitter.emit(this.acl.targetOrg);
  }

  /**
   * Deny access event
   *
   * @return {void}
   * @memberof AclDetailComponent
   */
  public denyAccess(): void {
    this.denyAccessEmitter.emit(this.acl.targetOrg);
  }

  /**
   * Accept access event
   *
   * @return {void}
   * @memberof AclDetailComponent
   */
  public acceptAccess(): void {
    this.acceptAccessEmitter.emit(this.acl.targetOrg);
  }

  /**
   * Request access event
   *
   * @param {string} label
   * @return {void}
   * @memberof AclDetailComponent
   */
  public requestAccess(label: string): void {
    this.updateAccessEmitter.emit({
      btnLabel: label,
      entity: this.acl.targetOrg,
    });
  }
}
