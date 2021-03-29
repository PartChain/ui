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
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { realm } from './../api/api.service.properties';

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
   * Can Activate
   *
   * @param {ActivatedRouteSnapshot} next
   * @param {RouterStateSnapshot} state
   * @return {*}  {(Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree)}
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
   * Can Activate Child
   *
   * @param {ActivatedRouteSnapshot} next
   * @param {RouterStateSnapshot} state
   * @return {*}  {(Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree)}
   * @memberof RoleGuard
   */
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }

  /**
   * Can Deactivate
   *
   * @param {unknown} component
   * @param {ActivatedRouteSnapshot} currentRoute
   * @param {RouterStateSnapshot} currentState
   * @param {RouterStateSnapshot} [nextState]
   * @return {*}  {(Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree)}
   * @memberof RoleGuard
   */
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  /**
   * Can load
   *
   * @param {Route} route
   * @param {UrlSegment[]} segments
   * @return {*}  {(Observable<boolean> | Promise<boolean> | boolean)}
   * @memberof RoleGuard
   */
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  /**
   * Validate user role
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {*} url
   * @return {boolean}
   * @memberof RoleGuard
   */
  validateUserRole(route: ActivatedRouteSnapshot, url: any): boolean {
    const roles: string[] = this.userService.getRoles();
    const hasSomeRole: boolean = route.data.role.some((role: string) => roles.includes(role));
    if (route.data.role && !hasSomeRole) {
      this.router.navigate([realm[1]]);
      return false;
    }
    return true;
  }
}
