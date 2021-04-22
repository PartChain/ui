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
import { map } from 'rxjs/operators';
import { ApiService } from '../../core/api/api.service';
import { ApiServiceProperties } from '../../core/api/api.service.properties';
import { AclList, ACLResponse } from '../model/acl.model';

/**
 *
 *
 * @export
 * @class AclService
 */
@Injectable()
export class AclService {
  /**
   * @constructor AclService (DI)
   * @param {ApiService} apiService
   * @memberof AclService
   */
  constructor(private apiService: ApiService) {}

  /**
   * Accept request
   *
   * @param {string} targetOrg
   * @param {string} comment
   * @return {Observable<ACLResponse>}
   * @memberof AclService
   */
  public acceptRequest(targetOrg: string, comment: string): Observable<ACLResponse> {
    return this.apiService.post<ACLResponse>(`${ApiServiceProperties.aems}access-mgmt/accept-access-request`, {
      targetOrg: targetOrg,
      comment: comment,
    });
  }

  /**
   * Deny request
   *
   * @param {string} targetOrg
   * @param {string} comment
   * @return {Observable<ACLResponse>}
   * @memberof AclService
   */
  public denyRequest(targetOrg: string, comment: string): Observable<ACLResponse> {
    return this.apiService.post<ACLResponse>(`${ApiServiceProperties.aems}access-mgmt/deny-access-request`, {
      targetOrg: targetOrg,
      comment: comment,
    });
  }

  /**
   * Get acl request
   *
   * @return {Observable<AclList>}
   * @memberof AclService
   */
  public getACL(): Observable<AclList> {
    return this.apiService
      .get<ACLResponse>(`${ApiServiceProperties.aems}access-mgmt/get-access-control-list`)
      .pipe(map(supplier => supplier.data));
  }

  /**
   * Get access recommendations request
   *
   * @return {Observable<string[]>}
   * @memberof AclService
   */
  public getAccessRecommendations(): Observable<string[]> {
    return this.apiService
      .get<{ status: number; resultLength?: number; data: string[] }>(
        `${ApiServiceProperties.aems}access-mgmt/get-access-request-recommendations`,
      )
      .pipe(map(response => response.data));
  }

  /**
   * Remove access request
   *
   * @param {string} targetOrg
   * @param {string} comment
   * @return {Observable<ACLResponse>}
   * @memberof AclService
   */
  public removeAccess(targetOrg: string, comment: string): Observable<ACLResponse> {
    return this.apiService.post<ACLResponse>(`${ApiServiceProperties.aems}access-mgmt/remove-access`, {
      targetOrg: targetOrg,
      comment: comment,
    });
  }

  /**
   * Request access
   *
   * @param {string} targetOrg
   * @param {string} comment
   * @return {Observable<ACLResponse>}
   * @memberof AclService
   */
  public requestAccess(targetOrg: string, comment: string): Observable<ACLResponse> {
    return this.apiService.post<ACLResponse>(`${ApiServiceProperties.aems}access-mgmt/request-access`, {
      targetOrg: targetOrg,
      comment: comment,
    });
  }
}
