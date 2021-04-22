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
import { Observable, of } from 'rxjs';
import { SharedService } from '../../shared/core/shared.service';
import { AclList, Acl, HistoryAcl, ACLResponse } from '../model/acl.model';
import { AclService } from '../core/acl.service';
import { AclState } from '../core/acl.state';
import { View } from 'src/app/shared/model/view.model';
import { delay } from 'rxjs/operators';
import { LayoutFacade } from 'src/app/shared/abstraction/layout-facade';

/**
 *
 *
 * @export
 * @class AclFacade
 */
@Injectable()
export class AclFacade {
  /**
   * @constructor AclFacade (DI)
   * @param {AclService} aclService
   * @param {AclState} aclState
   * @param {SharedService} sharedService
   * @param {LayoutFacade} layoutFacade
   * @memberof AclFacade
   */
  constructor(
    private aclService: AclService,
    private aclState: AclState,
    private sharedService: SharedService,
    private layoutFacade: LayoutFacade,
  ) {}

  /**
   * Acls getter
   *
   * @readonly
   * @type {Observable<View<Acl[]>>}
   * @memberof AclFacade
   */
  get acls$(): Observable<View<Acl[]>> {
    return this.aclState.getAcls$.pipe(delay(0));
  }

  /**
   * acl owner getter
   *
   * @readonly
   * @type {Observable<string>}
   * @memberof AclFacade
   */
  get owner$(): Observable<string> {
    return this.aclState.getOwner$;
  }

  /**
   * Acl history getter
   *
   * @readonly
   * @type {Observable<HistoryAcl>}
   * @memberof AclFacade
   */
  get aclHistory$(): Observable<HistoryAcl> {
    return this.aclState.getAclHistory$;
  }

  /**
   * Inactive entities getter
   *
   * @readonly
   * @type {Observable<string[]>}
   * @memberof AclFacade
   */
  get inactiveEntities$(): Observable<string[]> {
    return this.aclState.getInactiveEntities$;
  }

  /**
   * Access recommendations getter
   *
   * @readonly
   * @type {Observable<string[]>}
   * @memberof AclFacade
   */
  get accessRecommendations$(): Observable<string[]> {
    return this.aclState.getAccessRecommendations$;
  }

  /**
   * Acls setter
   *
   * @return {void}
   * @memberof AclFacade
   */
  public setAcls(): void {
    this.aclState.setAcls({ loader: true });
    this.aclService.getACL().subscribe(
      (acls: AclList) => {
        this.aclState.setOwner(acls.owner);
        this.aclState.setAcls({ data: Object.values(acls.ACL) });
      },
      error => of(this.aclState.setAcls({ error })),
    );
  }

  /**
   * Acl history setter
   *
   * @param {string[]} id
   * @return {void}
   * @memberof AclFacade
   */
  public setAclHistory(id: string[]): void {
    this.aclState.setHistory(id);
  }

  /**
   * Recommend entities setter
   *
   * @return {void}
   * @memberof AclFacade
   */
  public setRecommendedEntities(): void {
    this.aclService.getAccessRecommendations().subscribe((acls: string[]) => {
      this.aclState.addRecommendedEntities(acls);
    });
  }

  /**
   * Acl history state reset
   *
   * @param {boolean} isReset
   * @return {void}
   * @memberof AclFacade
   */
  public resetHistory(isReset: boolean): void {
    this.aclState.resetHistory(isReset);
  }

  /**
   * Requesting access to a entity (acl status to pending)
   *
   * @param {string} targetOrg
   * @param {string} comment
   * @return {void}
   * @memberof AclFacade
   */
  public requestAccess(targetOrg: string, comment: string): void {
    this.aclState.setAcls({ loader: true });
    this.aclService.requestAccess(targetOrg, comment).subscribe(
      (acl: ACLResponse) => {
        if (!this.sharedService.isEmpty(acl.data)) {
          this.aclState.updateAcls({ data: Object.values(acl.data.ACL) }, acl.data.owner);
          this.updateAclBadge(acl.data.ACL);
        }
      },
      error => of(this.aclState.setAcls({ error })),
    );
  }

  /**
   * Removing the access of an entity (acl status to inactive)
   *
   * @param {string} targetOrg
   * @param {string} comment
   * @return {void}
   * @memberof AclFacade
   */
  public removeAclAccess(targetOrg: string, comment: string): void {
    this.aclState.setAcls({ loader: true });
    this.aclService.removeAccess(targetOrg, comment).subscribe(
      (acl: ACLResponse) => {
        if (!this.sharedService.isEmpty(acl.data)) {
          this.aclState.updateAcls({ data: Object.values(acl.data.ACL) }, acl.data.owner);
          this.updateAclBadge(acl.data.ACL);
        }
      },
      error => of(this.aclState.setAcls({ error })),
    );
  }

  /**
   * Accepting access from an entity (acl status to active)
   *
   * @param {string} targetOrg
   * @param {string} comment
   * @return {void}
   * @memberof AclFacade
   */
  public acceptAclAccess(targetOrg: string, comment: string): void {
    this.aclState.setAcls({ loader: true });
    this.aclService.acceptRequest(targetOrg, comment).subscribe(
      (acl: ACLResponse) => {
        if (!this.sharedService.isEmpty(acl.data)) {
          this.aclState.updateAcls({ data: Object.values(acl.data.ACL) }, acl.data.owner);
          this.updateAclBadge(acl.data.ACL);
        }
      },
      error => of(this.aclState.setAcls({ error })),
    );
  }

  /**
   * Denying access to an entity ( acl status to inactive)
   *
   * @param {string} targetOrg
   * @param {string} comment
   * @return {void}
   * @memberof AclFacade
   */
  public denyAclAccess(targetOrg: string, comment: string): void {
    this.aclState.setAcls({ loader: true });
    this.aclService.denyRequest(targetOrg, comment).subscribe(
      (acl: ACLResponse) => {
        if (!this.sharedService.isEmpty(acl.data)) {
          this.aclState.updateAcls({ data: Object.values(acl.data.ACL) }, acl.data.owner);
          this.updateAclBadge(acl.data.ACL);
        }
      },
      error => of(this.aclState.setAcls({ error })),
    );
  }

  /**
   * Update acls badge with pending acls length
   *
   * @param {Acl} acls
   * @return {void}
   * @memberof AclFacade
   */
  public updateAclBadge(acls: Acl): void {
    this.layoutFacade.setAclBadge(Object.values(acls).filter(acl => acl.status === 'PENDING').length);
  }
}
