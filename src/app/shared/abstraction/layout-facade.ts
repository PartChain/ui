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
import { Acl } from 'src/app/acl/model/acl.model';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserService } from 'src/app/core/user/user.service';
import { LayoutState } from '../core/layout.state';
import { SharedService } from '../core/shared.service';
import { Tiles } from '../model/tiles.model';

/**
 *
 *
 * @export
 * @class LayoutFacade
 */
@Injectable({
  providedIn: 'root',
})
export class LayoutFacade {
  /**
   * @constructor LayoutFacade (DI)
   * @param {LayoutState} layoutState
   * @param {UserService} userService
   * @param {AuthService} authService
   * @param {SharedService} sharedService
   * @memberof LayoutFacade
   */
  constructor(
    private layoutState: LayoutState,
    private userService: UserService,
    private authService: AuthService,
    private sharedService: SharedService,
  ) {}

  /**
   * Acl badge state getter
   *
   * @readonly
   * @type {Observable<number>}
   * @memberof LayoutFacade
   */
  get aclBadge$(): Observable<number> {
    return this.layoutState.getAclBadge$;
  }

  /**
   * Transactions badge state getter
   *
   * @readonly
   * @type {Observable<number>}
   * @memberof LayoutFacade
   */
  get transactionsBadge$(): Observable<number> {
    return this.layoutState.getTransactionsBadge$;
  }

  /**
   * Badge total state getter
   *
   * @readonly
   * @type {Observable<number>}
   * @memberof LayoutFacade
   */
  get badge$(): Observable<number> {
    return this.layoutState.getBadge$;
  }

  /**
   * User information getter
   *
   * @readonly
   * @type {{ name: string; email: string; role: string }}
   * @memberof LayoutFacade
   */
  get getUserInformation(): { name: string; email: string; role: string } {
    return {
      name: `${this.userService.getFirstname()} ${this.userService.getSurname()}`,
      email: `${this.userService.getEmail()}`,
      role: `${this.userService.getRoles().join(', ')}`,
    };
  }

  /**
   * Icon name getter
   *
   * @readonly
   * @type {string}
   * @memberof LayoutFacade
   */
  get iconName(): string {
    return this.userService.getFirstname()[0];
  }

  /**
   * Logout request
   *
   * @return {void}
   * @memberof LayoutFacade
   */
  public logOut(): void {
    this.authService.logOut();
  }

  /**
   * Is empty helper method
   *
   * @param {unknown} object
   * @return {boolean}
   * @memberof LayoutFacade
   */
  public isEmpty(object: unknown): boolean {
    return this.sharedService.isEmpty(object);
  }

  /**
   * Acl badge state setter
   *
   * @param {number} aclCounter
   * @return {void}
   * @memberof LayoutFacade
   */
  public setAclBadge(aclCounter: number): void {
    this.layoutState.setAclBadge(aclCounter);
  }

  /**
   * Add transactions to badge state
   *
   * @param {number} transactionsCounter
   * @return {void}
   * @memberof LayoutFacade
   */
  public addTransactionsBadge(transactionsCounter: number): void {
    this.layoutState.addTransactionsBadge(transactionsCounter);
  }

  /**
   * Transactions badge state setter
   *
   * @param {number} transactionsCounter
   * @return {void}
   * @memberof LayoutFacade
   */
  public setTransactionsBadge(transactionsCounter: number): void {
    this.layoutState.setTransactionsBadge(transactionsCounter);
  }

  /**
   * Transactions counter request
   *
   * @return {void}
   * @memberof LayoutFacade
   */
  public setTransactionsCounter(): void {
    this.layoutState.resetTransactionsBadge();
    this.sharedService.getTiles().subscribe((tiles: Tiles) => {
      this.setTransactionsBadge(tiles.transactionsCount);
    });
  }

  /**
   * Acls counter request
   *
   * @return {void}
   * @memberof LayoutFacade
   */
  public setAclsCounter(): void {
    this.layoutState.resetAclBadge();
    this.sharedService.getACL().subscribe((acls: Acl[]) => {
      this.setAclBadge(acls.length);
    });
  }

  /**
   * Transactions badge state reset
   *
   * @return {void}
   * @memberof LayoutFacade
   */
  public resetTransactionsBadge(): void {
    this.layoutState.resetTransactionsBadge();
  }

  /**
   * Acls badge state reset
   *
   * @return {void}
   * @memberof LayoutFacade
   */
  public resetAclBadge(): void {
    this.layoutState.resetAclBadge();
  }
}
