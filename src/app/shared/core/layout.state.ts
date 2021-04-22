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
import { sum } from 'lodash-es';
import { combineLatest, Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
import { State } from '../model/state';

/**
 *
 *
 * @export
 * @class LayoutState
 */
@Injectable({
  providedIn: 'root',
})
export class LayoutState {
  /**
   * Acl badge state
   *
   * @private
   * @readonly
   * @type {State<number>}
   * @memberof LayoutState
   */
  private readonly aclBadge$: State<number> = new State<number>(0);

  /**
   * Transactions badge state
   *
   * @private
   * @readonly
   * @type {State<number>}
   * @memberof LayoutState
   */
  private readonly transactionsBadge$: State<number> = new State<number>(0);

  /**
   * Acl badge state getter
   *
   * @readonly
   * @type {Observable<number>}
   * @memberof LayoutState
   */
  get getAclBadge$(): Observable<number> {
    return this.aclBadge$.observable;
  }

  /**
   * Transactions badge state getter
   *
   * @readonly
   * @type {Observable<number>}
   * @memberof LayoutState
   */
  get getTransactionsBadge$(): Observable<number> {
    return this.transactionsBadge$.observable;
  }

  /**
   * Combined badge state getter
   *
   * @readonly
   * @type {Observable<number>}
   * @memberof LayoutState
   */
  get getBadge$(): Observable<number> {
    const combinedBadge$: Observable<[number, number]> = combineLatest([
      this.aclBadge$.observable,
      this.transactionsBadge$.observable,
    ]);
    return combinedBadge$.pipe(
      scan((acc, badge) => {
        return sum(badge) === 0 ? 0 : acc + sum(badge);
      }, 0),
    );
  }

  /**
   * Acls state setter
   *
   * @param {number} aclCounter
   * @return {void}
   * @memberof LayoutState
   */
  public setAclBadge(aclCounter: number): void {
    this.aclBadge$.update(aclCounter);
  }

  /**
   * Transactions badge state setter
   *
   * @param {number} transactionsCounter
   * @return {void}
   * @memberof LayoutState
   */
  public setTransactionsBadge(transactionsCounter: number): void {
    this.resetTransactionsBadge();
    this.transactionsBadge$.update(transactionsCounter);
  }

  /**
   * Add transactions to state
   *
   * @param {number} transactionsCounter
   * @return {void}
   * @memberof LayoutState
   */
  public addTransactionsBadge(transactionsCounter: number): void {
    const currentBadgeNumber: number = this.transactionsBadge$.snapshot;
    this.transactionsBadge$.update(currentBadgeNumber + transactionsCounter);
  }

  /**
   * Reset transactions badge state
   *
   * @return {void}
   * @memberof LayoutState
   */
  public resetTransactionsBadge(): void {
    this.transactionsBadge$.reset();
  }

  /**
   * Reset acls badge state
   *
   * @return {void}
   * @memberof LayoutState
   */
  public resetAclBadge(): void {
    this.aclBadge$.reset();
  }
}
