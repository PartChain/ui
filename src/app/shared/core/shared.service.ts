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
import { isEmpty } from 'lodash-es';
import { DateTime } from 'luxon';
import { Tiles } from '../model/tiles.model';
import { Acl, ACLResponse } from 'src/app/acl/model/acl.model';

/**
 *
 *
 * @export
 * @class SharedService
 */
@Injectable({
  providedIn: 'root',
})
export class SharedService {
  /**
   * @constructor SharedService {DI}
   * @param {ApiService} apiService
   * @memberof SharedService
   */
  constructor(private apiService: ApiService) {}

  /**
   * Set today's date
   *
   * @return {string}
   * @memberof SharedService
   */
  public setTodayDate(): string {
    return DateTime.local().toISODate();
  }

  /**
   * Get the last date from a period of days
   *
   * @param {number} amountOfDays
   * @return {string}
   * @memberof SharedService
   */
  public getPastDays(amountOfDays: number): string {
    return DateTime.local()
      .minus({ days: amountOfDays })
      .toISODate();
  }

  /**
   * Formatted date with time
   *
   * @param {(Date | string)} date
   * @return {string}
   * @memberof SharedService
   */
  public formatDate(date: Date | string): string {
    // Sun Jan 03 2021 08:00:00 GMT+0000 (Western European Standard Time)
    // TODO: Fix this with better date format
    return typeof date === 'string'
      ? DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)
      : date.toLocaleString();
  }

  /**
   * Timestamp to date
   *
   * @param {number} timestamp
   * @return {Date}
   * @memberof SharedService
   */
  public timestampToDate(timestamp: number): Date {
    return DateTime.fromMillis(timestamp);
  }

  /**
   * Helper method to uppercase the first letter
   *
   * @param {string} word
   * @return {string}
   * @memberof SharedService
   */
  public firstLetterToUpperCase(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  /**
   * Get tiles request
   *
   * @return {Observable<Tiles>}
   * @memberof SharedService
   */
  public getTiles(): Observable<Tiles> {
    return this.apiService
      .get<{
        data: Tiles;
        status: number;
      }>(`${ApiServiceProperties.laapi}kpi/tiles`)
      .pipe(map((tiles: { data: Tiles; status: number }) => tiles.data));
  }

  /**
   * Get pending acls request
   *
   * @return {Observable<Acl[]>}
   * @memberof SharedService
   */
  public getACL(): Observable<Acl[]> {
    return this.apiService
      .get<ACLResponse>(`${ApiServiceProperties.aems}access-mgmt/get-access-control-list`)
      .pipe(map(supplier => Object.values(supplier.data.ACL).filter(acl => acl.status === 'PENDING')));
  }

  /**
   * Helper method to check empty objects
   *
   * @template T
   * @param {T} object
   * @return {boolean}
   * @memberof SharedService
   */
  public isEmpty<T>(object: T): boolean {
    return isEmpty(object);
  }
}
