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

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { State } from '../../shared/model/state';
import { AclAssembler } from './acl.assembler';
import { Acl, HistoryAcl } from '../model/acl.model';
import { View } from 'src/app/shared/model/view.model';

/**
 *
 *
 * @export
 * @class AclState
 */
@Injectable()
export class AclState {
  /**
   * Acls state
   *
   * @private
   * @readonly
   * @type {State<View<Acl[]>>}
   * @memberof AclState
   */
  private readonly acls$: State<View<Acl[]>> = new State<View<Acl[]>>({ loader: true });

  /**
   * inactive entities state
   *
   * @private
   * @readonly
   * @type {State<string[]>}
   * @memberof AclState
   */
  private readonly inactiveEntities$: State<string[]> = new State<string[]>([]);

  /**
   * Acl history state
   *
   * @private
   * @readonly
   * @type {State<HistoryAcl>}
   * @memberof AclState
   */
  private readonly aclHistory$: State<HistoryAcl> = new State<HistoryAcl>(null);

  /**
   * Owner state
   *
   * @private
   * @readonly
   * @type {State<string>}
   * @memberof AclState
   */
  private readonly owner$: State<string> = new State<string>('');

  /**
   * Recommended acl state
   *
   * @private
   * @readonly
   * @type {State<string[]>}
   * @memberof AclState
   */
  private readonly recommendedEntities: State<string[]> = new State<string[]>([]);

  /**
   * Acls getter
   *
   * @readonly
   * @type {Observable<View<Acl[]>>}
   * @memberof AclState
   */
  get getAcls$(): Observable<View<Acl[]>> {
    return this.acls$.observable;
  }

  /**
   * Owner getter
   *
   * @readonly
   * @type {Observable<string>}
   * @memberof AclState
   */
  get getOwner$(): Observable<string> {
    return this.owner$.observable;
  }

  /**
   * Acl history getter
   *
   * @readonly
   * @type {Observable<HistoryAcl>}
   * @memberof AclState
   */
  get getAclHistory$(): Observable<HistoryAcl> {
    return this.aclHistory$.observable;
  }

  /**
   * Inactive entities getter
   *
   * @readonly
   * @type {Observable<string[]>}
   * @memberof AclState
   */
  get getInactiveEntities$(): Observable<string[]> {
    return this.inactiveEntities$.observable;
  }

  /**
   * Access recommendations getter
   *
   * @readonly
   * @type {Observable<string[]>}
   * @memberof AclState
   */
  get getAccessRecommendations$(): Observable<string[]> {
    return this.recommendedEntities.observable;
  }

  /**
   * Update acls after changing the status
   *
   * @param {View<Acl[]>} acls
   * @param {string} [owner]
   * @return {void}
   * @memberof AclState
   */
  public updateAcls(acls: View<Acl[]>, owner?: string): void {
    this.setAcls(acls, owner);
  }

  /**
   * Recommended entities to request access
   *
   * @param {string[]} aclEntities
   * @return {void}
   * @memberof AclState
   */
  public addRecommendedEntities(aclEntities: string[]): void {
    const inactiveAcls: Acl[] = this.acls$.snapshot.data.filter(acl => acl.status === 'INACTIVE');
    const entities: string[] = AclAssembler.mergeEntities(aclEntities, inactiveAcls);
    this.recommendedEntities.update(entities.filter(acl => !acl.includes(this.owner$.snapshot)));
  }

  /**
   * Acls setter
   *
   * @param {View<Acl[]>} acls
   * @param {string} [owner]
   * @return {void}
   * @memberof AclState
   */
  public setAcls(acls: View<Acl[]>, owner?: string): void {
    const updatedOwner: string = owner ? owner : this.owner$.snapshot;
    const aclsView: View<Acl[]> = {
      data: acls.data && AclAssembler.assembleAcls(acls.data, updatedOwner),
      loader: acls.loader,
      error: acls.error,
    };
    this.acls$.update(aclsView);
  }

  /**
   * Acl history setter
   *
   * @param {string[]} id
   * @return {void}
   * @memberof AclState
   */
  public setHistory(id: string[]): void {
    const history: HistoryAcl = AclAssembler.assembleHistoryAcls(this.acls$.snapshot.data, id);
    this.aclHistory$.update(history);
  }

  /**
   * Inactive entities setter
   *
   * @param {string[]} entities
   * @return {void}
   * @memberof AclState
   */
  public setInactiveEntities(entities: string[]): void {
    this.inactiveEntities$.update(entities);
  }

  /**
   * Owner setter
   *
   * @param {string} owner
   * @return {void}
   * @memberof AclState
   */
  public setOwner(owner: string): void {
    this.owner$.update(owner);
  }

  /**
   * Helper method to manage the user navigation between the history list and the acl list
   *
   * @param {boolean} isReset
   * @return {void}
   * @memberof AclState
   */
  public resetHistory(isReset: boolean): void {
    if (isReset) {
      this.aclHistory$.reset();
      const aclSnapshot: View<Acl[]> = this.acls$.snapshot;
      this.acls$.update({ data: aclSnapshot.data });
    }
  }
}
