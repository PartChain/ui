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

import { Component, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { realm } from 'src/app/core/api/api.service.properties';
import { UserService } from 'src/app/core/user/user.service';

/**
 *
 *
 * @export
 * @class SidebarComponent
 */
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  /**
   * Is sidebar expanded
   *
   * @type {boolean}
   * @memberof SidebarComponent
   */
  @Input() expanded: boolean;

  /**
   * Logged realm
   *
   * @type {string}
   * @memberof SidebarComponent
   */
  public realm = '';

  /**
   * Active menu
   *
   * @type {string}
   * @memberof SidebarComponent
   */
  public activeMenu = '';

  /**
   * Type of label for own mspid
   *
   * @type {string}
   * @memberof SidebarComponent
   */
  public ownLabel = '';

  /**
   * Type of label for other mspid
   *
   * @type {string}
   * @memberof SidebarComponent
   */
  public otherLabel = '';

  /**
   * Menu links
   *
   * @private
   * @type {*} {
    dashboard: string,
    search: string,
    own: string,
    other: string,
    transactions: string,
    about: string,
    support: string,
  }
   * @memberof SidebarComponent
   */
  private menu = {
    dashboard: ``,
    search: ``,
    own: ``,
    other: ``,
    transactions: ``,
    about: ``,
  };

  /**
   * Sidebar width
   *
   * @readonly
   * @type {number}
   * @memberof SidebarComponent
   */
  get sidebarWidth(): number {
    return this.expanded ? 240 : 48;
  }

  /**
   * @constructor SidebarComponent.
   * @param {Router} router
   * @param {UserService} userService
   * @memberof SidebarComponent
   */
  constructor(private router: Router, private userService: UserService) {
    this.realm = realm[1];
    this.menu = {
      dashboard: `/${this.realm}`,
      search: `/${this.realm}/find`,
      own: `/${this.realm}/components/assets`,
      other: `/${this.realm}/components`,
      transactions: `/${this.realm}/cart`,
      about: `/${this.realm}/about`,
    };
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((r: NavigationEnd) => {
      this.activeMenu = Object.keys(this.menu).find(key => this.menu[key] === r.url);
    });
    this.getSidebarLabels();
  }

  /**
   * Menu navigation
   *
   * @param {string} item
   * @memberof SidebarComponent
   */
  public navigate(item: string): void {
    this.router.navigate([this.menu[item]]).then();
    this.activeMenu = item;
  }

  /**
   * Sidebar label
   *
   * @return {void}
   * @memberof SidebarComponent
   */
  public getSidebarLabels(): void {
    this.ownLabel = this.userService.getOrgPreferences().assetsTile;
    this.otherLabel = this.userService.getOrgPreferences().componentsTile;
  }
}
