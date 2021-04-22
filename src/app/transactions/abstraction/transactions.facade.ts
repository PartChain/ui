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
import { Observable, of } from 'rxjs';
import { NotificationText } from '../../shared/components/notifications/notification-message/notification-text';
import { NotificationService } from '../../shared/components/notifications/notification.service';
import { GroupedTransaction } from '../model/grouped-transaction.model';
import { Transaction } from '../model/transaction.model';
import { TransactionsService } from '../core/transactions.service';
import { TransactionsState } from '../core/transactions.state';
import { View } from 'src/app/shared/model/view.model';
import { delay } from 'rxjs/operators';
import { FlatNodeTransaction } from '../model/flat-node-transaction.model';
import { LayoutFacade } from 'src/app/shared/abstraction/layout-facade';

/**
 *
 *
 * @export
 * @class TransactionsFacade
 */
@Injectable()
export class TransactionsFacade {
  /**
   * @constructor TransactionsFacade (DI)
   * @param {TransactionsService} transactionService
   * @param {TransactionsState} transactionsState
   * @param {NotificationService} notificationService
   * @param {LayoutFacade} layoutFacade
   * @memberof TransactionsFacade
   */
  constructor(
    private transactionService: TransactionsService,
    private transactionsState: TransactionsState,
    private notificationService: NotificationService,
    private layoutFacade: LayoutFacade,
  ) {}

  /**
   * Transaction state getter
   *
   * @readonly
   * @type {Observable<View<GroupedTransaction[]>>}
   * @memberof TransactionsFacade
   */
  get transactions$(): Observable<View<GroupedTransaction[]>> {
    return this.transactionsState.getTransactions$.pipe(delay(0));
  }

  /**
   * Transaction tree state getter
   *
   * @readonly
   * @type {Observable<View<GroupedTransaction[]>>}
   * @memberof TransactionsFacade
   */
  get transactionsTree$(): Observable<View<GroupedTransaction[]>> {
    return this.transactionsState.getTransactionsTree$.pipe(delay(0));
  }

  /**
   * Tree node level getter
   *
   * @readonly
   * @type {(node: FlatNodeTransaction) => number}
   * @memberof TransactionsFacade
   */
  get level(): (node: FlatNodeTransaction) => number {
    return this.transactionsState.getLevel;
  }

  /**
   * Tree node transformer getter
   *
   * @param {GroupedTransaction} node
   * @param {number} level
   * @return {*}  {{
   *     userId: string;
   *     propertyOldValue: string;
   *     propertyNewValue: string;
   *     totalOfTransactions: string;
   *     icon: string;
   *     timestampCreated: string;
   *     serialNumberCustomer: string;
   *     level: number;
   *     expandable: boolean;
   *   }}
   * @memberof TransactionsFacade
   */
  public transformer(
    node: GroupedTransaction,
    level: number,
  ): {
    userId: string;
    propertyOldValue: string;
    propertyNewValue: string;
    totalOfTransactions: string;
    icon: string;
    timestampCreated: string;
    serialNumberCustomer: string;
    level: number;
    expandable: boolean;
  } {
    return {
      userId: node.userId,
      propertyOldValue: node.propertyOldValue,
      propertyNewValue: node.propertyNewValue,
      totalOfTransactions: node.totalOfTransactions,
      icon: node.icon,
      timestampCreated: node.timestampCreated,
      serialNumberCustomer: node.serialNumberCustomer,
      level,
      expandable: !!node.transactions,
    };
  }

  /**
   * Tree node is expandable getter
   *
   * @readonly
   * @type {(node: FlatNodeTransaction) => boolean}
   * @memberof TransactionsFacade
   */
  get isExpandable(): (node: FlatNodeTransaction) => boolean {
    return this.transactionsState.isExpandable;
  }

  /**
   * Tree node children getter
   *
   * @readonly
   * @type {(node: GroupedTransaction) => Observable<[]>}
   * @memberof TransactionsFacade
   */
  get children(): (node: GroupedTransaction) => Observable<[]> {
    return this.transactionsState.getChildren;
  }

  /**
   * Pending transactions setter
   *
   * @return {void}
   * @memberof TransactionsFacade
   */
  public setPendingTransactions(): void {
    this.transactionsState.setPendingTransactions({ loader: true });
    this.transactionService.getPendingTransactions().subscribe(
      (transactions: Transaction[]) => {
        this.transactionsState.setPendingTransactions({ data: transactions });
      },
      error => of(this.transactionsState.setPendingTransactions({ error })),
    );
  }

  /**
   * Transactions setter
   *
   * @param {{ property_name: string; status: string }} filter
   * @return {void}
   * @memberof TransactionsFacade
   */
  public setTransactions(filter: { property_name: string; status: string }): void {
    this.transactionsState.setTransactions({ loader: true });
    this.transactionService.getTransactions(filter).subscribe(
      (transactions: Transaction[]) => {
        this.transactionsState.setTransactions({ data: transactions });
      },
      error => of(this.transactionsState.setTransactions({ error })),
    );
  }

  /**
   * Commit transactions request
   * Optimistic update
   * 1. update UI state
   * 2. call API
   *
   * @param {string} [timestamp]
   * @return {void}
   * @memberof TransactionsFacade
   */
  public commitTransactions(timestamp?: string): void {
    const transactionIds = this.transactionsState.getTransactionsToCommit(timestamp);
    this.removeTransactions(timestamp);
    this.transactionService.commitTransactions(transactionIds).subscribe(
      () => {
        this.notificationService.success(NotificationText.SuccessFullyCommitted, 3000);
      },
      error => {
        if (error) {
          // TODO: TEST THIS ROLLBACK
          this.setPendingTransactions();
        }
      },
    );
  }

  /**
   * Delete transactions request
   * Optimistic update
   * 1. update UI state
   * 2. call API
   *
   * @param {string} [timestamp]
   * @return {void}
   * @memberof TransactionsFacade
   */
  public deleteTransactions(timestamp?: string): void {
    const transactionIds = this.transactionsState.getTransactionsToCommit(timestamp);
    this.removeTransactions(timestamp);
    this.transactionService.deleteTransactions(transactionIds).subscribe(
      () => {
        this.notificationService.success(NotificationText.SuccessFullyDeleted, 3000);
      },
      error => {
        if (error) {
          // TODO: TEST THIS ROLLBACK
          this.setPendingTransactions();
        }
      },
    );
  }

  /**
   * Remove all or each transaction depending on the user event
   *
   * @private
   * @param {string} timestamp
   * @return {void}
   * @memberof TransactionsFacade
   */
  private removeTransactions(timestamp: string): void {
    if (timestamp) {
      const transaction: number[] = this.transactionsState
        .filterTransaction(timestamp)
        .map(transaction => +transaction.totalOfTransactions);
      transaction.length > 0
        ? this.layoutFacade.setTransactionsBadge(transaction.reduce((acc, tx) => acc + tx))
        : this.layoutFacade.resetTransactionsBadge();
      this.transactionsState.removeTransaction(timestamp);
    } else {
      this.transactionsState.setPendingTransactions({ data: [] });
      this.layoutFacade.resetTransactionsBadge();
    }
  }
}
