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
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanDeactivate,
  CanLoad,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { realm } from '../api/api.service.properties';
import { UserService } from './user.service';

/**
 *
 *
 * @export
 * @class RoleGuard
 * @implements {CanActivate}
 * @implements {CanActivateChild}
 * @implements {CanDeactivate<unknown>}
 * @implements {CanLoad}
 */
@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {
  constructor(private userService: UserService, private router: Router) {}

  /**
   * Can activate route
   *
   * @param {ActivatedRouteSnapshot} next
   * @param {RouterStateSnapshot} state
   * @return {(Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree)}
   * @memberof RoleGuard
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url: string = state.url;
    return this.validateUserRole(next, url);
  }

  /**
   * Can activate child
   *
   * @param {ActivatedRouteSnapshot} next
   * @param {RouterStateSnapshot} state
   * @return {(Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree)}
   * @memberof RoleGuard
   */
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }

  /**
   * Can deactivate
   *
   * @return {(Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree)}
   * @memberof RoleGuard
   */
  canDeactivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  /**
   * Can load
   *
   * @return {(Observable<boolean> | Promise<boolean> | boolean)}
   * @memberof RoleGuard
   */
  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  /**
   * Validate the user role
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {string} url
   * @return {boolean}
   * @memberof RoleGuard
   */
  validateUserRole(route: ActivatedRouteSnapshot, url: string): boolean {
    console.log(url);
    const roles: string[] = this.userService.getRoles();
    const hasSomeRole: boolean = route.data.role.some((role: string) => roles.includes(role));
    if (route.data.role && !hasSomeRole) {
      this.router.navigate([realm[1]]);
      return false;
    }
    return true;
  }
}
