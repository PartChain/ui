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
import { BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TilesResponseModel } from '../core/api/api-response.model';
import { ApiService } from '../core/api/api.service';
import { ApiServiceProperties } from '../core/api/api.service.properties';
import { isEmpty } from 'lodash-es';
import { DateTime } from 'luxon';

/**
 * Injectable shared service
 *
 * @export
 * @class SharedService
 */
@Injectable({
  providedIn: 'root',
})
export class SharedService {
  /**
   * Transaction subject
   *
   * @type {BehaviorSubject<number>}
   * @memberof SharedService
   */
  public transactionSubject$ = new BehaviorSubject<number>(0);

  /**
   * Acl subject
   *
   * @type {BehaviorSubject<number>}
   * @memberof SharedService
   */
  public aclSubject$ = new BehaviorSubject<number>(0);

  /**
   * @constructor SharedService.
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
   * Transaction count getter
   *
   * @return {Observable<TilesModel>}
   * @memberof SharedService
   */
  public getTiles = () =>
    this.apiService.get<TilesResponseModel>(ApiServiceProperties.laapi, 'kpi/tiles').pipe(
      map((tiles: TilesResponseModel) => tiles.data),
      catchError(this.apiService.handleError),
    );

  /**
   * Push transactions to the subject
   *
   * @param {number} transactions
   * @return {void}
   * @memberof SharedService
   */
  public pushTransactions(transactions: number): void {
    this.transactionSubject$.next(transactions);
  }

  /**
   * Clear transactions on the subject
   *
   * @return {void}
   * @memberof SharedService
   */
  public clearTransactions(): void {
    this.transactionSubject$.next(0);
  }

  /**
   * Push pending acls to the subject
   *
   * @param {number} acls
   * @return {void}
   * @memberof SharedService
   */
  public pushAcls(acls: number): void {
    this.aclSubject$.next(acls);
  }

  /**
   * Clear acls on the subject
   *
   * @return {void}
   * @memberof SharedService
   */
  public clearAcls(): void {
    this.aclSubject$.next(0);
  }

  /**
   * Helper method to check empty objects
   *
   * @param {*} object
   * @return {boolean}
   * @memberof SharedService
   */
  public isEmpty(object: any): boolean {
    return isEmpty(object);
  }
}
