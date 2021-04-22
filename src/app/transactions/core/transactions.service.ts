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
import { ApiService } from '../../core/api/api.service';
import { ApiServiceProperties } from '../../core/api/api.service.properties';
import { map } from 'rxjs/operators';
import { Transaction, TransactionResponse } from '../model/transaction.model';
import { Observable } from 'rxjs';

/**
 *
 *
 * @export
 * @class TransactionsService
 */
@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  /**
   * @constructor TransactionsService (DI)
   * @param {ApiService} apiService
   * @memberof TransactionsService
   */
  constructor(private apiService: ApiService) {}

  /**
   * Transaction request
   *
   * @param {{ property_name: string; status: string }} filter
   * @return {Observable<Transaction[]>}
   * @memberof TransactionsService
   */
  public getTransactions(filter: { property_name: string; status: string }): Observable<Transaction[]> {
    return this.apiService
      .post<TransactionResponse>(`${ApiServiceProperties.aems}transaction/browse`, {
        filter,
      })
      .pipe(map((transactions: TransactionResponse) => transactions.data));
  }

  /**
   * Pending transactions request
   *
   * @return {Observable<Transaction[]>}
   * @memberof TransactionsService
   */
  public getPendingTransactions(): Observable<Transaction[]> {
    return this.apiService
      .post<TransactionResponse>(`${ApiServiceProperties.aems}transaction/browse`, {
        filter: { status: 'PENDING' },
      })
      .pipe(map((transactions: TransactionResponse) => transactions.data));
  }

  /**
   * Commit transactions request
   *
   * @param {number[]} transactionIds
   * @return {Observable<number[]>}
   * @memberof TransactionsService
   */
  public commitTransactions(transactionIds: number[]): Observable<number[]> {
    return this.apiService.post<number[]>(`${ApiServiceProperties.aems}transaction/commit`, {
      transactions: transactionIds,
    });
  }

  /**
   * Delete transactions request
   *
   * @param {number[]} transactionIds
   * @return {Observable<number[]>}
   * @memberof TransactionsService
   */
  public deleteTransactions(transactionIds: number[]): Observable<number[]> {
    return this.apiService.post<number[]>(`${ApiServiceProperties.aems}transaction/delete`, {
      transactions: transactionIds,
    });
  }
}
