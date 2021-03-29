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

import { HostListener } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { AclService } from 'src/app/acl/acl.service';
import { AuthService } from 'src/app/core/user/auth/auth.service';
import { UserService } from 'src/app/core/user/user.service';
import { SharedService } from 'src/app/shared/shared.service';
import { TilesModel } from 'src/app/shared/tiles.model';
import { version } from '../../../../package.json';
import { realm } from 'src/app/core/api/api.service.properties';
import { ActivatedRoute, Router } from '@angular/router';

/**
 *
 *
 * @export
 * @class NavBarComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  /**
   * Is menu expanded
   *
   * @type {boolean}
   * @memberof NavBarComponent
   */
  public isExpanded = false;

  /**
   * Transactions badge counter
   *
   * @type {number}
   * @memberof NavBarComponent
   */
  public transactionsBadge = 0;

  /**
   * Acl badge counter
   *
   * @type {number}
   * @memberof NavBarComponent
   */
  public aclBadge = 0;

  /**
   * User initials
   *
   * @type {string}
   * @memberof NavBarComponent
   */
  public initials = '';

  /**
   * Package json version
   *
   * @type {string}
   * @memberof NavBarComponent
   */
  public version = '';

  /**
   * Icon badge
   *
   * @type {Observable<[number, number]>}
   * @memberof NavBarComponent
   */
  public iconBadge = combineLatest([this.sharedService.transactionSubject$, this.sharedService.aclSubject$]);

  /**
   * User information
   *
   * @type {*} { name: '', email: '', role: '' }
   * @memberof NavBarComponent
   */
  public user = { name: '', email: '', role: '' };

  /**
   * @constructor NavBarComponent.
   * @param {AuthService} authService
   * @param {SharedService} sharedService
   * @param {AclService} aclService
   * @param {UserService} userService
   * @param {Router} router
   * @param {ActivatedRoute} route
   * @memberof NavBarComponent
   */
  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private aclService: AclService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.iconName();
    this.version = version;
    this.updateTransactions();
    this.updateAcls();
  }

  /**
   * Angular lifecycle method - On Init
   *
   * @return {void}
   * @memberof NavBarComponent
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (this.sharedService.isEmpty(params)) {
        this.getTiles();
        this.aclService.getAcls();
      }
    });
    this.user = this.getUserInformation();
  }

  /**
   * Menu expanded event
   *
   * @param {*} event
   * @return {void}
   * @memberof NavBarComponent
   */
  public expand(event): void {
    if (event) {
      event.stopPropagation();
      this.isExpanded = !this.isExpanded;
    }
  }

  /**
   * Logout event
   *
   * @return {void}
   * @memberof NavBarComponent
   */
  public logOut(): void {
    this.authService.logOut();
  }

  /**
   * Sums the icon observable values
   *
   * @param {number[]} arr
   * @return {number}
   * @memberof NavBarComponent
   */
  public reducedArray(arr: number[]): number {
    return arr.length > 0 ? arr.reduce((acc, value) => acc + value) : 0;
  }

  /**
   * Go back to home page
   *
   * @return {void}
   * @memberof NavBarComponent
   */
  public navigateToHome(): void {
    this.router.navigate([`/${realm[1]}`]);
  }

  /**
   *
   * Window click event (clicking outside the menu, closes the menu)
   * @private
   * @return {void}
   * @memberof NavBarComponent
   */
  @HostListener('window:click', [])
  private onClick(): void {
    this.isExpanded = false;
  }

  /**
   * Retrieves user information
   *
   * @private
   * @return {*}  {{ name: string; email: string; role: string }}
   * @memberof NavBarComponent
   */
  private getUserInformation(): { name: string; email: string; role: string } {
    const userInformation = {
      name: `${this.userService.getFirstname()} ${this.userService.getSurname()}`,
      email: `${this.userService.getEmail()}`,
      role: `${this.userService.getRoles().join(', ')}`,
    };
    return userInformation;
  }

  /**
   * Get total of transactions
   *
   * @private
   * @return {void}
   * @memberof NavBarComponent
   */
  private getTiles(): void {
    this.sharedService.getTiles().subscribe((transaction: TilesModel) => {
      this.sharedService.pushTransactions(transaction.transactionsCount);
    });
  }

  /**
   * Gets the first letter of the user's first name
   *
   * @private
   * @return {void}
   * @memberof NavBarComponent
   */
  private iconName(): void {
    this.initials = this.userService.getFirstname()[0];
  }

  /**
   * Updates transaction badge
   *
   * @private
   * @return {void}
   * @memberof NavBarComponent
   */
  private updateTransactions(): void {
    this.sharedService.transactionSubject$.subscribe((transactions: number) => {
      transactions === 0 ? (this.transactionsBadge = 0) : (this.transactionsBadge += transactions);
    });
  }

  /**
   * Updates acl badge
   *
   * @private
   * @return {void}
   * @memberof NavBarComponent
   */
  private updateAcls(): void {
    this.sharedService.aclSubject$.subscribe((acls: number) => {
      this.aclBadge = acls;
    });
  }
}
