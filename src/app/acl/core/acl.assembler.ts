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

import { orderBy, union } from 'lodash-es';
import { Acl, HistoryAcl } from '../model/acl.model';

/**
 *
 *
 * @export
 * @class AclAssembler
 */
export class AclAssembler {
  /**
   * Attaching new properties on each acl for convenience
   *
   * @static
   * @param {Acl[]} acls
   * @param {string} owner
   * @return {Acl[]}
   * @memberof AclAssembler
   */
  public static assembleAcls(acls: Acl[], owner: string): Acl[] {
    const transformedAcls: Acl[] = [];
    acls.forEach(acl => {
      acl.targetOrg = acl.entities.find(entity => entity !== owner);
      acl.entities = [acl.entities.toString().replace(',', '')];
      acl.owner = owner;
      acl.status = acl.status.charAt(0).toUpperCase() + acl.status.slice(1);
    });
    transformedAcls.push(...acls);
    return transformedAcls;
  }

  /**
   * Finding a list of history acls with a specific id, descendent order
   *
   * @static
   * @param {Acl[]} acls
   * @param {string[]} id
   * @return {HistoryAcl}
   * @memberof AclAssembler
   */
  public static assembleHistoryAcls(acls: Acl[], id: string[]): HistoryAcl {
    const aclById: Acl = acls.find(acl => acl.entities.join() === id.join());
    const { targetOrg, history } = aclById;
    const descOrderHistory: Acl[] = orderBy(history, acl => acl.timestamp, ['desc']);
    return {
      targetOrg,
      history: descOrderHistory,
    };
  }

  /**
   * To request access we first need to check if there are any inactive acls and then
   * we merge the list of entities from those acls with the recommended ones from the api
   * We shared the targetOrg to exclude the current logged user
   *
   * @static
   * @param {string[]} recommendedEntities
   * @param {Acl[]} inactiveAcls
   * @return {{ targetOrg: string; entities: string[] }}
   * @memberof AclAssembler
   */
  public static mergeEntities(recommendedEntities: string[], inactiveAcls: Acl[]): string[] {
    const currentInactiveList: RegExpMatchArray[] = inactiveAcls.map(acl => acl.entities.join().match(/[A-Z][a-z]+/g));
    return union(recommendedEntities, ...currentInactiveList);
  }
}
