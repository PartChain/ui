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

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { orderBy } from 'lodash-es';
import { Acl } from '../../acl.model';
import { AclService } from '../../acl.service';

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
})
export class AclHistoryComponent implements OnChanges {
  /**
   * Acl owner
   *
   * @type {string}
   * @memberof AclHistoryComponent
   */
  @Input() owner: string;

  /**
   * Acl history
   *
   * @type {[]}
   * @memberof AclHistoryComponent
   */
  @Input() history: [];

  /**
   * Acl history list
   *
   * @type {[]}
   * @memberof AclHistoryComponent
   */
  public historyList = [];

  /**
   * Selected acl
   *
   * @type {Acl}
   * @memberof AclHistoryComponent
   */
  public acl: Acl;

  /**
   * @constructor AclHistoryComponent.
   * @param {AclService} aclService
   * @memberof AclHistoryComponent
   */
  constructor(private aclService: AclService) {}

  /**
   * Angular lifecycle method - On Changes
   *
   * @param {SimpleChanges} changes
   * @return {void}
   * @memberof AclHistoryComponent
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.historyList = Object.values(changes.history.currentValue.history);
    this.historyList = orderBy(this.historyList, acl => acl.timestamp, ['desc']);
    this.acl = this.historyList[0];
  }

  /**
   * Get acl at a certain index
   *
   * @param {number} index
   * @return {void}
   * @memberof AclHistoryComponent
   */
  public getAcl(index: number): void {
    this.acl = this.historyList[index];
  }

  /**
   * Get acl id
   *
   * @param {string[]} entities
   * @return {string}
   * @memberof AclHistoryComponent
   */
  public getId(entities: string[]): string {
    return this.aclService.getId(entities);
  }
}
