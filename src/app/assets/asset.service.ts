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
import { saveAs } from 'file-saver';
import { ApiService } from '../core/api/api.service';
import { AssetModel } from './asset.model';
import { ApiServiceProperties } from '../core/api/api.service.properties';
import { Router } from '@angular/router';
import { AssetListResponseModel, ExportResponseModel } from '../core/api/api-response.model';
import { NotificationService } from '../shared/notifications/notification.service';
import { NotificationText } from '../shared/notifications/notification-message/notification-text';
import { TransactionModel } from '../transactions/transaction.model';
import { CommittedAssets } from './assets-list/committed-assets';
import { SharedService } from '../shared/shared.service';
import { BehaviorSubject } from 'rxjs';
import { share, timeout, catchError } from 'rxjs/operators';

/** @type {*} */
const TIMEOUT = 5 * 60 * 1000;

/**
 * @class AssetService
 */
@Injectable({
  providedIn: 'root',
})
export class AssetService {
  /**
   * Subject to get the selected asset within the table
   *
   * @type {BehaviorSubject<string>}
   * @memberof AssetService
   */
  public selectedAssetUUID$ = new BehaviorSubject<string>(undefined);

  /**
   * Nr° of transactions pieces to update
   *
   * @private
   * @type {number}
   * @memberof AssetService
   */
  private pieces = 0;

  /**
   * @constructorAssetService.
   * @param {ApiService} apiService
   * @param {NotificationService} notificationService
   * @param {SharedService} sharedService
   * @memberof AssetService
   */
  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private sharedService: SharedService,
  ) {}

  /**
   * Data export
   *
   * @private
   * @static
   * @param {number[]} buffer
   * @param {string} fileName
   * @param {string} reportType
   * @memberof AssetService
   */
  private static saveFile(buffer: number[], fileName: string, reportType: string): void {
    const report = {
      listDataExcel: {
        TYPE: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
        EXTENSION: '.xlsx',
      },
      customsReportExcel: {
        TYPE: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
        EXTENSION: '.xlsx',
      },
      listDataPlainCSV: {
        TYPE: 'application/zip',
        EXTENSION: '.zip',
      },
      customsReportCSV: {
        TYPE: 'application/zip',
        EXTENSION: '.zip',
      },
    };
    const parts = new Uint8Array(buffer);
    const data: Blob = new Blob([parts], { type: report[reportType].TYPE });
    const file = new File([data], fileName + '_export_' + new Date().getTime() + report[reportType].EXTENSION);
    saveAs(file);
  }

  /**
   * Creates each transaction object to submit
   *
   * @private
   * @static
   * @param {AssetModel} asset
   * @param {string} status
   * @return {CommittedAssets}
   * @memberof AssetService
   */
  private static createTransactionObject(asset: AssetModel, status: string): CommittedAssets {
    const committedAssets = {} as CommittedAssets;
    committedAssets.propertyName = 'qualityStatus';
    committedAssets.propertyOldValue = asset.qualityStatus;
    committedAssets.serialNumberCustomer = asset.serialNumberCustomer;
    committedAssets.propertyNewValue = status;
    return committedAssets;
  }

  /**
   * Get assets request
   *
   * @param {*} filter
   * @param {number} pagination
   * @param {string[]} fields
   * @return {Observable<AssetListResponseModel>}
   * @memberof AssetService
   */
  public getAssets = (filter: any, pagination: number, fields: string[]) =>
    this.apiService
      .post<AssetListResponseModel>(ApiServiceProperties.laapi + 'off-hlf-db/get-asset-list', {
        filter,
        pagination,
        fields,
      })
      .pipe(catchError(this.apiService.handleError), share(), timeout(TIMEOUT));

  /**
   * Export data request
   *
   * @param {*} filter
   * @param {string} reportType
   * @param {string} [assetsType]
   * @return {Subscription}
   * @memberof AssetService
   */
  public exportData = (filter: any, reportType: string, assetsType?: string) =>
    this.apiService
      .post<any>(ApiServiceProperties.laapi + 'off-hlf-db/get-customs-report', { filter, reportType })
      .subscribe(
        (data: any) => {
          const response = Object.values(data).filter(value => typeof value === 'object')[0];
          const values = Object.values(response).filter(value => typeof value === 'object')[0];
          const exportData = values as ExportResponseModel;
          AssetService.saveFile(exportData.data, assetsType, reportType);
        },
        error => {
          this.notificationService.error(this.notificationService.errorServiceResponse(error));
        },
      );

  /**
   * Prepare chunks of transactions to commit
   *
   * @param {AssetModel[]} selected
   * @param {string} status
   * @param {boolean} [notification]
   * @return {Promise<void>}
   * @memberof AssetService
   */
  public async setTransactionsToCommit(selected: AssetModel[], status: string, notification?: boolean): Promise<void> {
    const limit = 900;
    const size = Math.ceil(selected.length / limit);
    if (selected.length > limit) {
      this.notificationService.info('Performing changes. This might take a while.');
    }
    const chunkedArray = selected.reduce((acc, asset: AssetModel, length: number) => {
      const chunkIndex = Math.floor(length / limit);
      if (!acc[chunkIndex]) {
        acc[chunkIndex] = [];
      }
      const committedAssets = AssetService.createTransactionObject(asset, status);
      acc[chunkIndex].push(committedAssets);
      return acc;
    }, []);
    Object.values(chunkedArray).forEach(arrayOfAssets =>
      this.commitMultipleTransactions(arrayOfAssets, size, notification),
    );
  }

  /**
   * Get filtered assets from the last thirty days
   *
   * @param {Router} router
   * @return {*}  {{
   *     productionDateFrom: { value: string };
   *     productionDateTo: { value: string };
   *     type: { value: string };
   *   }}
   * @memberof AssetService
   */
  public getFilter(
    router: Router,
  ): {
    productionDateFrom: { value: string };
    productionDateTo: { value: string };
    type: { value: string };
  } {
    const route = router.url
      .split('/')
      .slice(-1)
      .toString();
    const mappedQuery = {
      components: 'other',
      assets: 'own',
    };
    return {
      productionDateFrom: { value: this.sharedService.getPastDays(31) },
      productionDateTo: { value: this.sharedService.setTodayDate() },
      type: { value: mappedQuery[route] },
    };
  }

  /**
   * Commit multiple transactions request
   *
   * @private
   * @param {TransactionModel[]} transactions
   * @param {number} [size]
   * @param {boolean} [notification]
   * @return {Subscription}
   * @memberof AssetService
   */
  private commitMultipleTransactions = (transactions: TransactionModel[], size?: number, notification?: boolean) =>
    this.apiService
      .post<TransactionModel[]>(ApiServiceProperties.aems + 'transaction/CreateMultiple', transactions)
      .subscribe(
        (tx: any) => {
          if (tx.status === 200) {
            this.pieces++;
            if (this.pieces === size) {
              if (notification) {
                this.notificationService.success(NotificationText.StatusChanged);
              }
              this.pieces = 0;
            }
            this.sharedService.pushTransactions(tx.data.sucessList.length);
          }
        },
        error => {
          this.notificationService.error(this.notificationService.errorServiceResponse(error));
        },
      );
}
