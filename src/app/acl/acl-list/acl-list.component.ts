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

import { Component, Input, OnInit } from '@angular/core';
import { Acl } from '../acl.model';
import { AclService } from '../acl.service';

/**
 *
 *
 * @export
 * @class AclListComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-acl-list',
  templateUrl: './acl-list.component.html',
  styleUrls: ['./acl-list.component.scss'],
})
export class AclListComponent implements OnInit {
  /**
   * Acl type
   *
   * @type {string}
   * @memberof AclListComponent
   */
  @Input() type: string;

  /**
   * Available acls
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
   * First element of acls array
   *
   * @type {Acl}
   * @memberof AclListComponent
   */
  public acl: Acl = {} as Acl;

  /**
   * @constructor  AclListComponent.
   * @param {AclService} aclService
   * @memberof AclListComponent
   */
  constructor(private aclService: AclService) {}

  /**
   * Angular lifecycle method - On Init
   *
   * @return {void}
   * @memberof AclListComponent
   */
  ngOnInit(): void {
    this.acl = this.acls[0];
  }

  /**
   * Gets acl at a certain index
   *
   * @param {number} index
   * @return {void}
   * @memberof AclListComponent
   */
  public getAcl(index: number): void {
    this.acl = this.acls[index];
  }

  /**
   * Get acl id
   *
   * @param {string[]} entities
   * @return {string}
   * @memberof AclListComponent
   */
  public getId(entities: string[]): string {
    return this.aclService.getId(entities);
  }

  /**
   * Get target org
   *
   * @param {string[]} entities
   * @param {string} owner
   * @return {string}
   * @memberof AclListComponent
   */
  public getTargetOrg(entities: string[], owner: string): string {
    return this.aclService.getTargetOrg(entities, owner);
  }
}
