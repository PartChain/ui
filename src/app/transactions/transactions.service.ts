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
import { ApiService } from '../core/api/api.service';
import { ApiServiceProperties } from '../core/api/api.service.properties';
import { GroupedTransactionModel } from './grouped-transaction.model';
import { FlatNodeTransactionModel } from './flat-node-transaction.model';
import { TransactionResponseModel } from '../core/api/api-response.model';
import { map, catchError } from 'rxjs/operators';
import { of as observableOf, Observable } from 'rxjs';

/**
 * Transaction injectable service
 *
 * @export
 * @class TransactionsService
 */
@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  /**
   * @constructor TransactionsService.
   * @param {ApiService} apiService
   * @memberof TransactionsService
   */
  constructor(private apiService: ApiService) {}

  /**
   * Pending transaction list request
   *
   * @return {Observable<TransactionModel[]>}
   * @memberof TransactionsService
   */
  public getTransactionsList = () =>
    this.apiService
      .post<TransactionResponseModel>(ApiServiceProperties.aems + 'transaction/browse', {
        filter: { status: 'PENDING' },
      })
      .pipe(
        map((transactions: TransactionResponseModel) => transactions.data),
        catchError(this.apiService.handleError),
      );

  /**
   * Stored transaction list request
   *
   * @return {Observable<TransactionModel[]>}
   * @memberof TransactionsService
   */
  public getTransactions = () =>
    this.apiService
      .post<TransactionResponseModel>(ApiServiceProperties.aems + 'transaction/browse', {
        filter: { property_name: 'qualityStatus', status: 'STORED' },
      })
      .pipe(
        map((transactions: TransactionResponseModel) => transactions.data),
        catchError(this.apiService.handleError),
      );

  /**
   * Commit transactions request
   *
   * @param {number[]} transactionIds
   * @return {Observable<number[]>}
   * @memberof TransactionsService
   */
  public commitTransactions = (transactionIds: number[]) =>
    this.apiService
      .post<number[]>(ApiServiceProperties.aems + 'transaction/commit', {
        transactions: transactionIds,
      })
      .pipe(catchError(this.apiService.handleError));

  /**
   * Delete transactions request
   *
   * @param {number[]} transactionIds
   * @return {Observable<number[]>}
   * @memberof TransactionsService
   */
  public deleteTransactions = (transactionIds: number[]) =>
    this.apiService
      .post<number[]>(ApiServiceProperties.aems + 'transaction/delete', {
        transactions: transactionIds,
      })
      .pipe(catchError(this.apiService.handleError));

  /**
   * Transform the data to something the tree can read.
   *
   * @param {GroupedTransactionModel} node
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
   * @memberof TransactionsService
   */
  public transformer(
    node: GroupedTransactionModel,
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
   * Get the level of the node
   *
   * @param {FlatNodeTransactionModel} node
   * @return {number}
   * @memberof TransactionsService
   */
  public getLevel(node: FlatNodeTransactionModel): number {
    return node.level;
  }

  /**
   * Return whether the node is expanded or not
   *
   * @param {FlatNodeTransactionModel} node
   * @return {*}  {boolean}
   * @memberof TransactionsService
   */
  public isExpandable(node: FlatNodeTransactionModel): boolean {
    return node.expandable;
  }

  /**
   * Get the children for the node
   *
   * @param {GroupedTransactionModel} node
   * @return {Observable<[]>}
   * @memberof TransactionsService
   */
  public getChildren(node: GroupedTransactionModel): Observable<[]> {
    return observableOf(node.transactions);
  }
}
