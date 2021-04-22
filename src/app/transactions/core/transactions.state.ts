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

import { Observable } from 'rxjs';
import { State } from '../../shared/model/state';
import { GroupedTransaction } from '../model/grouped-transaction.model';
import { Transaction } from '../model/transaction.model';
import { TransactionsAssembler } from './transactions.assembler';
import { flatten } from 'lodash-es';
import { View } from 'src/app/shared/model/view.model';
import { FlatNodeTransaction } from '../model/flat-node-transaction.model';

/**
 *
 *
 * @export
 * @class TransactionsState
 */
export class TransactionsState {
  /**
   * Transactions state
   *
   * @private
   * @readonly
   * @type {State<View<GroupedTransaction[]>>}
   * @memberof TransactionsState
   */
  private readonly transactions$: State<View<GroupedTransaction[]>> = new State<View<GroupedTransaction[]>>({
    loader: true,
  });

  /**
   * Transactions tree state
   *
   * @private
   * @readonly
   * @type {State<View<GroupedTransaction[]>>}
   * @memberof TransactionsState
   */
  private readonly transactionTree$: State<View<GroupedTransaction[]>> = new State<View<GroupedTransaction[]>>({
    loader: true,
  });

  /**
   * Transactions state getter
   *
   * @readonly
   * @type {Observable<View<GroupedTransaction[]>>}
   * @memberof TransactionsState
   */
  get getTransactions$(): Observable<View<GroupedTransaction[]>> {
    return this.transactions$.observable;
  }

  /**
   * Transactions tree state getter
   *
   * @readonly
   * @type {Observable<View<GroupedTransaction[]>>}
   * @memberof TransactionsState
   */
  get getTransactionsTree$(): Observable<View<GroupedTransaction[]>> {
    return this.transactionTree$.observable;
  }

  /**
   * Transactions tree snapshot
   *
   * @readonly
   * @type {View<GroupedTransaction[]>}
   * @memberof TransactionsState
   */
  get getTransactionsTreeSnapshot(): View<GroupedTransaction[]> {
    return this.transactionTree$.snapshot;
  }

  /**
   * Tree node level getter
   *
   * @readonly
   * @type {(node: FlatNodeTransaction) => number}
   * @memberof TransactionsState
   */
  get getLevel(): (node: FlatNodeTransaction) => number {
    return TransactionsAssembler.getLevel;
  }

  /**
   * Is tree expandable getter
   *
   * @readonly
   * @type {(node: FlatNodeTransaction) => boolean}
   * @memberof TransactionsState
   */
  get isExpandable(): (node: FlatNodeTransaction) => boolean {
    return TransactionsAssembler.isExpandable;
  }

  /**
   * Tree node children getter
   *
   * @readonly
   * @type {(node: GroupedTransaction) => Observable<[]>}
   * @memberof TransactionsState
   */
  get getChildren(): (node: GroupedTransaction) => Observable<[]> {
    return TransactionsAssembler.getChildren;
  }

  /**
   * Transactions setter
   *
   * @param {View<Transaction[]>} transactions
   * @return {void}
   * @memberof TransactionsState
   */
  public setTransactions(transactions: View<Transaction[]>): void {
    const transactionsView: View<GroupedTransaction[]> = {
      data: transactions.data && TransactionsAssembler.assembleTransactions(transactions.data),
      loader: transactions.loader,
      error: transactions.error,
    };
    this.transactions$.update(transactionsView);
  }

  /**
   * Pending transactions getter
   *
   * @param {View<Transaction[]>} transactions
   * @return {void}
   * @memberof TransactionsState
   */
  public setPendingTransactions(transactions: View<Transaction[]>): void {
    const transactionsView: View<GroupedTransaction[]> = {
      data: transactions.data && TransactionsAssembler.assembleTransactions(transactions.data),
      loader: transactions.loader,
      error: transactions.error,
    };
    this.transactionTree$.update(transactionsView);
  }

  /**
   * Transactions to commit getter
   *
   * @param {string} [timestamp]
   * @return {number[]}
   * @memberof TransactionsState
   */
  public getTransactionsToCommit(timestamp?: string): number[] {
    const transactions: GroupedTransaction[] = this.transactionTree$.snapshot.data;
    return timestamp
      ? transactions
          .filter((transaction: GroupedTransaction) => transaction.timestampCreated === timestamp)[0]
          .transactions.map((transactionId: Transaction) => +transactionId.transactionId)
      : flatten(transactions.map((transaction: GroupedTransaction) => transaction.transactions)).map(
          (tx: Transaction) => +tx.transactionId,
        );
  }

  /**
   * Filter transactions by timestamp
   *
   * @param {string} timestamp
   * @return {GroupedTransaction[]}
   * @memberof TransactionsState
   */
  public filterTransaction(timestamp: string): GroupedTransaction[] {
    const transactions: GroupedTransaction[] = this.transactionTree$.snapshot.data;
    return transactions.filter((transaction: GroupedTransaction) => transaction.timestampCreated !== timestamp);
  }

  /**
   * Remove transaction
   *
   * @param {string} [timestamp]
   * @return {void}
   * @memberof TransactionsState
   */
  public removeTransaction(timestamp?: string): void {
    const removedTransaction: GroupedTransaction[] = this.filterTransaction(timestamp);
    this.transactionTree$.update({ data: removedTransaction });
  }
}
