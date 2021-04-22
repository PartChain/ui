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
 * @class AclHistoryComponent
 * @implements {OnChanges}
 */
@Component({
  selector: 'app-acl-history',
  templateUrl: './acl-history.component.html',
  styleUrls: ['./acl-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AclHistoryComponent implements OnChanges {
  /**
   * Alc history list
   *
   * @type {Acl[]}
   * @memberof AclHistoryComponent
   */
  @Input() history: Acl[];

  /**
   * Acl target org
   *
   * @type {string}
   * @memberof AclHistoryComponent
   */
  @Input() targetOrg: string;

  /**
   * Reset history event emitter (Helps to manage which template to show - acl list or alc history)
   *
   * @type {EventEmitter<true>}
   * @memberof AclHistoryComponent
   */
  @Output() resetHistory: EventEmitter<true> = new EventEmitter<true>();

  /**
   * Selected acl
   *
   * @type {Acl}
   * @memberof AclHistoryComponent
   */
  public acl: Acl;

  /**
   * Angular lifecycle method - Ng On Changes
   *
   * @param {SimpleChanges} changes
   * @return {void}
   * @memberof AclHistoryComponent
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.history.currentValue) {
      this.acl = changes.history.currentValue[0];
    }
  }

  /**
   * Get an acl at a certain position of the list
   *
   * @param {number} index
   * @return {void}
   * @memberof AclHistoryComponent
   */
  public getAcl(index: number): void {
    this.acl = this.history[index];
  }

  /**
   * Reset history event
   *
   * @return {void}
   * @memberof AclHistoryComponent
   */
  public reset(): void {
    this.resetHistory.emit(true);
  }
}
