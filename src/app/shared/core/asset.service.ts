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
import { ApiServiceProperties } from '../../core/api/api.service.properties';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../core/api/api.service';
import { map } from 'rxjs/operators';
import { Transaction, TransactionResponse } from 'src/app/transactions/model/transaction.model';
import { Observable } from 'rxjs';
import { Asset, AssetResponse } from '../model/asset.model';

/**
 *
 *
 * @export
 * @class AssetService
 */
@Injectable({
  providedIn: 'root',
})
export class AssetService {
  /**
   * @constructor AssetService (DI)
   * @param {ApiService} apiService
   * @memberof AssetService
   */
  constructor(private apiService: ApiService) {}

  /**
   * Get asset request
   *
   * @param {string} serialNumberCustomer
   * @return {Observable<Asset>}
   * @memberof AssetService
   */
  public getAsset(serialNumberCustomer: string): Observable<Asset> {
    return this.apiService
      .getBy<AssetResponse>(
        `${ApiServiceProperties.laapi}off-hlf-db/get-asset-detail?`,
        new HttpParams().set('serialNumberCustomer', encodeURIComponent(serialNumberCustomer)),
      )
      .pipe(map((asset: AssetResponse) => asset.data));
  }

  /**
   * Get parent request
   *
   * @param {string} serialNumberCustomer
   * @return {Observable<Asset>}
   * @memberof AssetService
   */
  public getParent(serialNumberCustomer: string): Observable<Asset> {
    return this.apiService
      .getBy<AssetResponse>(
        `${ApiServiceProperties.laapi}off-hlf-db/get-asset-parent?`,
        new HttpParams().set('serialNumberCustomer', encodeURIComponent(serialNumberCustomer)),
      )
      .pipe(map((asset: AssetResponse) => asset.data));
  }

  /**
   * Change quality status request
   *
   * @param {string} serialNumber
   * @param {string} changePropertyName
   * @param {string} changePropertyOldValue
   * @param {string} changePropertyNewValue
   * @return {Observable<Asset>}
   * @memberof AssetService
   */
  public changeAssetQualityStatus(
    serialNumber: string,
    changePropertyName: string,
    changePropertyOldValue: string,
    changePropertyNewValue: string,
  ): Observable<Asset> {
    return this.apiService.post<Asset>(ApiServiceProperties.aems + 'transaction/create', {
      serialNumberCustomer: serialNumber,
      propertyName: changePropertyName,
      propertyOldValue: changePropertyOldValue,
      propertyNewValue: changePropertyNewValue,
    });
  }

  /**
   * Get asset history request
   *
   * @param {string} serialNumberCustomer
   * @param {string} propertyName
   * @return {Observable<Transaction[]>}
   * @memberof AssetService
   */
  public getAssetHistory(serialNumberCustomer: string, propertyName: string): Observable<Transaction[]> {
    return this.apiService
      .getBy<TransactionResponse>(
        `${ApiServiceProperties.aems}transaction/get-asset-transaction-history?`,
        new HttpParams()
          .set('serialNumberCustomer', encodeURIComponent(serialNumberCustomer))
          .set('propertyName', propertyName),
      )
      .pipe(map((asset: TransactionResponse) => asset.data));
  }
}
