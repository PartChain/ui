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
import { KeycloakService } from 'keycloak-angular';
import { Token } from '../model/token.model';

/**
 *
 *
 * @export
 * @class AuthService
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * @constructor AuthService (DI)
   * @param {KeycloakService} keycloakService
   * @memberof AuthService
   */
  constructor(private keycloakService: KeycloakService) {}

  /**
   * Get token from header string
   *
   * @return {string}
   * @memberof AuthService
   */
  public getBearerToken(): string {
    return 'Bearer ' + this.keycloakService.getKeycloakInstance().token;
  }

  /**
   * Get user data
   *
   * @return {*}  {{
   *     username: string;
   *     firstname: string;
   *     surname: string;
   *     email: string;
   *     mspid: string;
   *     realm_access: {
   *       roles: [];
   *     };
   *   }}
   * @memberof AuthService
   */
  public getUserData(): {
    username: string;
    firstname: string;
    surname: string;
    email: string;
    mspid: string;
    realm_access: {
      roles: [];
    };
  } {
    const tokenParsed = this.keycloakService.getKeycloakInstance().tokenParsed as Token;
    return {
      username: tokenParsed.preferred_username ? tokenParsed.preferred_username : '',
      firstname: tokenParsed.given_name ? tokenParsed.given_name : '',
      surname: tokenParsed.family_name ? tokenParsed.family_name : '',
      email: tokenParsed.email ? tokenParsed.email : '',
      mspid: tokenParsed.mspid ? tokenParsed.mspid : '',
      realm_access: tokenParsed.realm_access ? tokenParsed.realm_access : { roles: [] },
    };
  }

  /**
   * Keycloak logout
   *
   * @return {void}
   * @memberof AuthService
   */
  public logOut(): void {
    this.keycloakService.logout().then();
  }
}
