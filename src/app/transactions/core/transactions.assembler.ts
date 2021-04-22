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

import { groupBy } from 'lodash-es';
import { FlatNodeTransaction } from '../model/flat-node-transaction.model';
import { GroupedTransaction } from '../model/grouped-transaction.model';
import { Transaction } from '../model/transaction.model';
import { Observable, of as observableOf } from 'rxjs';

/**
 *
 *
 * @export
 * @class TransactionsAssembler
 */
export class TransactionsAssembler {
  /**
   * Grouping transactions by old and new property values
   *
   * @static
   * @param {Transaction[]} transactions
   * @return {Array<GroupedTransaction>}
   * @memberof TransactionsAssembler
   */
  public static assembleTransactions(transactions: Transaction[]): Array<GroupedTransaction> {
    transactions.forEach(
      transactionsProps =>
        (transactionsProps.groupingKey = `${transactionsProps.propertyOldValue}${transactionsProps.propertyNewValue}`),
    );
    return this.groupTransactions(groupBy(transactions, 'groupingKey'));
  }

  /**
   * Tree node level
   *
   * @static
   * @param {FlatNodeTransaction} node
   * @return {number}
   * @memberof TransactionsAssembler
   */
  public static getLevel(node: FlatNodeTransaction): number {
    return node.level;
  }

  /**
   * Return whether the node is expanded or not
   *
   * @static
   * @param {FlatNodeTransaction} node
   * @return {boolean}
   * @memberof TransactionsAssembler
   */
  public static isExpandable(node: FlatNodeTransaction): boolean {
    return node.expandable;
  }

  /**
   * Get the node children
   *
   * @static
   * @param {GroupedTransaction} node
   * @return {Observable<[]>}
   * @memberof TransactionsAssembler
   */
  public static getChildren(node: GroupedTransaction): Observable<[]> {
    return observableOf(node.transactions) as Observable<[]>;
  }

  /**
   * Creates a list of grouped transactions
   *
   * @private
   * @static
   * @param {Record<string, Transaction[]>} transactions
   * @return {Array<GroupedTransaction>}
   * @memberof TransactionsAssembler
   */
  private static groupTransactions(transactions: Record<string, Transaction[]>): Array<GroupedTransaction> {
    const transactionsList: Array<GroupedTransaction> = [];
    for (const value in transactions) {
      const transaction: GroupedTransaction = this.createGroupedTransaction(transactions[value]);
      transactionsList.push(transaction);
    }
    return transactionsList;
  }

  /**
   * Creates the user transaction
   *
   * @private
   * @static
   * @param {Transaction[]} transactions
   * @return {GroupedTransaction}
   * @memberof TransactionsAssembler
   */
  private static createGroupedTransaction(transactions: Transaction[]): GroupedTransaction {
    const transactionsObjectPerUser = {} as GroupedTransaction;
    transactionsObjectPerUser.totalOfTransactions = transactions.length.toString();
    transactions.forEach(transaction => {
      transactionsObjectPerUser.userId = transaction.userId;
      transactionsObjectPerUser.propertyNewValue = transaction.propertyNewValue;
      transactionsObjectPerUser.timestampCreated = transaction.timestampCreated;
      transactionsObjectPerUser.propertyOldValue = transaction.propertyOldValue;
      transactionsObjectPerUser.serialNumberCustomer = transaction.serialNumberCustomer;
    });

    transactionsObjectPerUser.transactions = transactions;
    return transactionsObjectPerUser;
  }
}
