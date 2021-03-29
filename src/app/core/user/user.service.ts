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
import { UserServiceProperties } from './user.service.properties';
import { AuthService } from './auth/auth.service';
import { UserModel } from './user.model';
import { realm } from '../api/api.service.properties';

/**
 *
 *
 * @export
 * @class UserService
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  /**
   * Username
   *
   * @private
   * @type {string}
   * @memberof UserService
   */
  private username: string;

  /**
   * User's first name
   *
   * @private
   * @type {string}
   * @memberof UserService
   */
  private firstname: string;

  /**
   * User's surname
   *
   * @private
   * @type {string}
   * @memberof UserService
   */
  private surname: string;

  /**
   * User's email
   *
   * @private
   * @type {string}
   * @memberof UserService
   */
  private email: string;

  /**
   * First visit state reference
   *
   * @private
   * @type {boolean}
   * @memberof UserService
   */
  private firstVisit: boolean;

  /**
   * MspId
   *
   * @private
   * @type {string}
   * @memberof UserService
   */
  private mspid: string;

  /**
   * User's roles
   *
   * @private
   * @type {string[]}
   * @memberof UserService
   */
  private roles: string[] = [];

  /**
   * Dashboard loaded state reference
   *
   * @private
   * @type {boolean}
   * @memberof UserService
   */
  private dashboardLoaded: boolean;

  /**
   * @constructor UserService.
   * @param {AuthService} authService
   * @memberof UserService
   */
  constructor(private authService: AuthService) {
    this.userDetailsSetter();
  }

  /**
   * Helper method to set user details
   *
   * @return {void}
   * @memberof UserService
   */
  public userDetailsSetter(): void {
    const userData = this.authService.getUserData();
    this.username = userData.username;
    this.firstname = userData.firstname;
    this.surname = userData.surname;
    this.email = userData.email;
    this.mspid = userData.mspid;
    this.firstVisit = !this.hasBeenHere();
    this.dashboardLoaded = false;
    this.getOrgPreferences();
    const defaultRoles = ['offline_access', 'uma_authorization', 'user', `${realm[1]}_user`, 'view_only'];
    const { roles } = userData.realm_access;
    this.roles = roles.filter(role => !defaultRoles.includes(role));
  }

  /**
   * First name getter
   *
   * @return {string}
   * @memberof UserService
   */
  public getFirstname(): string {
    return this.firstname;
  }

  /**
   * Surname getter
   *
   * @return {string}
   * @memberof UserService
   */
  public getSurname(): string {
    return this.surname;
  }

  /**
   * Email getter
   *
   * @return {string}
   * @memberof UserService
   */
  public getEmail(): string {
    return this.email;
  }

  /**
   * MspId getter
   *
   * @return {string}
   * @memberof UserService
   */
  public getMspid(): string {
    return this.mspid;
  }

  /**
   * Roles getter
   *
   * @return {string[]}
   * @memberof UserService
   */
  public getRoles(): string[] {
    return this.roles;
  }

  /**
   * First visit getter
   *
   * @return {boolean}
   * @memberof UserService
   */
  public getFirstVisit(): boolean {
    return this.firstVisit;
  }

  /**
   * Dashboard loader getter
   *
   * @return {boolean}
   * @memberof UserService
   */
  public getDashboardLoaded(): boolean {
    return this.dashboardLoaded;
  }

  /**
   * Dashboard loader setter
   *
   * @return {void}
   * @memberof UserService
   */
  public setDashboardLoaded(): void {
    this.dashboardLoaded = true;
  }

  /**
   * Org preferences getter
   *
   * @return {UserModel}
   * @memberof UserService
   */
  public getOrgPreferences(): UserModel {
    const mspId = this.getMspid();
    const user: UserModel = {} as UserModel;
    if (mspId !== 'Lion' && mspId !== '92a2bd') {
      user.assetsTile = 'My components';
      user.componentsTile = 'Other parts';
    } else {
      user.assetsTile = 'My vehicles';
      user.componentsTile = 'Components';
    }
    return user;
  }

  /**
   * Has been here state handler
   *
   * @private
   * @return {boolean}
   * @memberof UserService
   */
  private hasBeenHere(): boolean {
    const hasBeenHere = Boolean(localStorage.getItem(UserServiceProperties.localStorageKey + this.username));

    if (hasBeenHere === true) {
      return true;
    } else {
      localStorage.setItem(UserServiceProperties.localStorageKey + this.username, 'true');
      return false;
    }
  }
}
