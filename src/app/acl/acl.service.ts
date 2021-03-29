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
import { map, catchError } from 'rxjs/operators';
import { Subject, EMPTY, BehaviorSubject } from 'rxjs';
import { ACLResponseModel, RecommendedAclsResponseModel } from '../core/api/api-response.model';
import { ApiService } from '../core/api/api.service';
import { ApiServiceProperties } from '../core/api/api.service.properties';
import { NotificationService } from '../shared/notifications/notification.service';
import { AclModel, Acl } from './acl.model';
import { SharedService } from '../shared/shared.service';

/**
 * Acl service injectable class
 *
 * @export
 * @class AclService
 */
@Injectable()
export class AclService {
  /**
   * Pending acls
   *
   * @type {BehaviorSubject<Acl[]>}
   * @memberof AclService
   */
  public pendingAcls = new BehaviorSubject<Acl[]>([]);

  /**
   * Active acls
   *
   * @type {BehaviorSubject<Acl[]>}
   * @memberof AclService
   */
  public activeAcls = new BehaviorSubject<Acl[]>([]);

  /**
   * Inactive acls
   *
   * @type {BehaviorSubject<Acl[]>}
   * @memberof AclService
   */
  public inactiveAcls = new BehaviorSubject<Acl[]>([]);

  /**
   * Acl owner
   *
   * @type {BehaviorSubject<string>}
   * @memberof AclService
   */
  public owner = new BehaviorSubject<string>('');

  /**
   * Acl history
   *
   * @type {BehaviorSubject<Acl>}
   * @memberof AclService
   */
  public historySubject = new BehaviorSubject<Acl>(undefined);

  /**
   * Update acl list
   *
   * @type {BehaviorSubject<boolean>}
   * @memberof AclService
   */
  public updateAcls = new BehaviorSubject<boolean>(false);

  /**
   * ACL inactive entities
   *
   * @type {BehaviorSubject<string[]>}
   * @memberof AclService
   */
  public inactiveEntities = new BehaviorSubject<string[]>([]);

  /**
   * Error message handler
   *
   * @type {Subject<string>}
   * @private
   * @memberof AclService
   */
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  /**
   * @constructor AclService.
   *
   * @param {ApiService} apiService
   * @param {NotificationService} notificationService
   * @param {SharedService} sharedService
   * @memberof AclService
   */
  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private sharedService: SharedService,
  ) {}

  /**
   * Accept request
   *
   * @param {string} targetOrg
   * @param {string} comment
   * @return {Observable<ACLResponseModel>}
   * @memberof AclService
   */
  public acceptRequest = (targetOrg: string, comment: string) =>
    this.apiService.post<ACLResponseModel>(ApiServiceProperties.aems + 'access-mgmt/accept-access-request', {
      targetOrg: targetOrg,
      comment: comment,
    });

  /**
   * Deny request
   *
   * @param {string} targetOrg
   * @param {string} comment
   * @return {Observable<ACLResponseModel>}
   * @memberof AclService
   */
  public denyRequest = (targetOrg: string, comment: string) =>
    this.apiService.post<ACLResponseModel>(ApiServiceProperties.aems + 'access-mgmt/deny-access-request', {
      targetOrg: targetOrg,
      comment: comment,
    });

  /**
   * Get acl
   *
   * @return {Observable<AclModel>}
   * @memberof AclService
   */
  public getACL = () =>
    this.apiService
      .getWithNoParams<ACLResponseModel>(ApiServiceProperties.aems + 'access-mgmt/get-access-control-list')
      .pipe(
        catchError(this.apiService.handleError),
        map(acl => acl.data),
      );

  /**
   * Extracting acls to different status.
   * This helps managing the tabs
   *
   * @return {void}
   * @memberof AclService
   */
  public getAcls(): void {
    this.getACL().subscribe(
      (acls: AclModel) => {
        this.owner.next(acls.owner);
        const aclsList: Acl[] = Object.values(acls.ACL);
        const pending = aclsList.filter(acl => acl.status === 'PENDING');
        this.pendingAcls.next(pending);
        this.activeAcls.next(aclsList.filter(acl => acl.status === 'ACTIVE'));
        this.inactiveAcls.next(aclsList.filter(acl => acl.status === 'INACTIVE'));
        this.sharedService.pushAcls(pending.length);
      },
      catchError(err => {
        this.errorMessageSubject.next(err);
        this.notificationService.error(err);
        return EMPTY;
      }),
    );
  }

  /**
   * Access recommendation
   *
   * @return {Observable<string[]>}
   * @memberof AclService
   */
  public getAccessRecommendations = () =>
    this.apiService
      .getWithNoParams<RecommendedAclsResponseModel>(
        ApiServiceProperties.aems + 'access-mgmt/get-access-request-recommendations',
      )
      .pipe(map(response => response.data));

  /**
   * Access Requests
   *
   * @return {Observable<AclModel>}
   * @memberof AclService
   */
  public getAccessRequests = () =>
    this.apiService.getWithNoParams<AclModel>(ApiServiceProperties.aems + 'access-mgmt/get-access-requests');

  /**
   * Remove access
   *
   * @param {string} targetOrg
   * @param {string} comment
   * @return {Observable<ACLResponseModel>}
   * @memberof AclService
   */
  public removeAccess = (targetOrg: string, comment: string) =>
    this.apiService.post<ACLResponseModel>(ApiServiceProperties.aems + 'access-mgmt/remove-access', {
      targetOrg: targetOrg,
      comment: comment,
    });

  /**
   * Request access
   *
   * @param {string} targetOrg
   * @param {string} comment
   * @return {Observable<ACLResponseModel>}
   * @memberof AclService
   */
  public requestAccess = (targetOrg: string, comment: string) =>
    this.apiService.post<ACLResponseModel>(ApiServiceProperties.aems + 'access-mgmt/request-access', {
      targetOrg: targetOrg,
      comment: comment,
    });

  /**
   * Convert entities array to a string to act as an id
   *
   * @param {string[]} entities
   * @return {string}
   * @memberof AclService
   */
  public getId(entities: string[]): string {
    return entities.toString().replace(',', '');
  }

  /**
   * Helper method to get the acl target org
   *
   * @param {string[]} entities
   * @param {string} owner
   * @return {string}
   * @memberof AclService
   */
  public getTargetOrg(entities: string[], owner: string): string {
    return entities.find(entity => entity !== owner);
  }
}
