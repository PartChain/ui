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
import { AssetModel } from '../asset.model';
import { ApiServiceProperties } from '../../core/api/api.service.properties';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../core/api/api.service';
import { AssetResponseModel, TransactionResponseModel } from '../../core/api/api-response.model';
import { NotificationText } from '../../shared/notifications/notification-message/notification-text';
import { NotificationService } from '../../shared/notifications/notification.service';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';

/**
 * Injectable asset detail service
 *
 * @export
 * @class AssetDetailService
 */
@Injectable({
  providedIn: 'root',
})
export class AssetDetailService {
  /**
   * @constructor AssetDetailService.
   * @param {ApiService} apiService
   * @param {NotificationService} notificationService
   * @param {SharedService} sharedService
   * @memberof AssetDetailService
   */
  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private sharedService: SharedService,
  ) {}

  /**
   * Get asset request
   *
   * @param {string} serialNumberCustomer
   * @return {Observable<AssetModel>}
   * @memberof AssetDetailService
   */
  public getAsset = (serialNumberCustomer: string) =>
    this.apiService
      .get<AssetResponseModel>(
        ApiServiceProperties.laapi + 'off-hlf-db/get-asset-detail?',
        new HttpParams().set('serialNumberCustomer', encodeURIComponent(serialNumberCustomer)),
      )
      .pipe(
        map((asset: AssetResponseModel) => asset.data),
        catchError(this.apiService.handleError),
      );

  /**
   * Change asset request
   *
   * @param {string} serialNumber
   * @param {string} changePropertyName
   * @param {string} changePropertyOldValue
   * @param {string} changePropertyNewValue
   * @return {Subscription}
   * @memberof AssetDetailService
   */
  public changeAssetQualityStatus = (
    serialNumber: string,
    changePropertyName: string,
    changePropertyOldValue: string,
    changePropertyNewValue: string,
  ) =>
    this.apiService
      .post<AssetModel>(ApiServiceProperties.aems + 'transaction/create', {
        serialNumberCustomer: serialNumber,
        propertyName: changePropertyName,
        propertyOldValue: changePropertyOldValue,
        propertyNewValue: changePropertyNewValue,
      })
      .subscribe(
        () => {
          this.notificationService.success(NotificationText.StatusChanged);
          this.sharedService.pushTransactions(1);
        },
        catchError(err => {
          this.notificationService.error(this.notificationService.errorServiceResponse(err));
          return EMPTY;
        }),
      );

  /**
   * Get asset parent request
   *
   * @param {string} serialNumberCustomer
   * @return {Observable<AssetModel>}
   * @memberof AssetDetailService
   */
  public getAssetParent = (serialNumberCustomer: string) =>
    this.apiService
      .get<AssetResponseModel>(
        ApiServiceProperties.laapi + 'off-hlf-db/get-asset-parent?',
        new HttpParams().set('serialNumberCustomer', encodeURIComponent(serialNumberCustomer)),
      )
      .pipe(
        map((asset: AssetResponseModel) => asset.data),
        catchError(this.apiService.handleError),
      );

  /**
   * Get asset history request
   *
   * @param {string} serialNumberCustomer
   * @param {string} propertyName
   * @return {Observable<TransactionModel[]>}
   * @memberof AssetDetailService
   */
  public getAssetHistory = (serialNumberCustomer: string, propertyName: string) =>
    this.apiService
      .get<TransactionResponseModel>(
        ApiServiceProperties.aems + 'transaction/get-asset-transaction-history?',
        new HttpParams()
          .set('serialNumberCustomer', encodeURIComponent(serialNumberCustomer))
          .set('propertyName', propertyName),
      )
      .pipe(
        map((asset: TransactionResponseModel) => asset.data),
        shareReplay(1),
        catchError(this.apiService.handleError),
      );

  /**
   * Helper method to shorten the serial number
   *
   * @param {string} serialNumber
   * @return {string}
   * @memberof AssetDetailService
   */
  public shortenSerialNumber(serialNumber: string): string {
    if (serialNumber) {
      return serialNumber.length > 23
        ? `${serialNumber.substring(0, 10)} ... ${serialNumber.substring(serialNumber.length - 10)}`
        : serialNumber;
    }
  }

  /**
   * Helper method for undefined property arrays
   *
   * @param {(string[] | AssetModel[])} value
   * @return {(string[] | AssetModel[])}
   * @memberof AssetDetailService
   */
  public isUndefined(value: string[] | AssetModel[]): string[] | AssetModel[] {
    if (typeof value === 'undefined') {
      value = [];
    }
    return value;
  }

  /**
   * Gets icon for missing components
   *
   * @param {AssetModel} asset
   * @param {boolean} missingComponents
   * @return {void}
   * @memberof AssetDetailService
   */
  public getMissingComponentIcon(asset: AssetModel, missingComponents: boolean): void {
    const status = {
      OK: 'checkbox-circle-line',
      NOK: 'close-circle-line',
      FLAG: 'flag-line',
    };
    missingComponents && asset.qualityStatus === 'OK'
      ? (asset.icon = 'error-warning-line')
      : (asset.icon = status[asset.qualityStatus]);
  }

  /**
   * Gets missing child components serial numbers
   *
   * @param {AssetModel} asset
   * @return {AssetModel[]}
   * @memberof AssetDetailService
   */
  public fetchEmptyChildren(asset: AssetModel): AssetModel[] {
    const arrayOfMissingComponents = this.findMissingChildren(asset.componentsSerialNumbers, asset.childComponents);
    const childComponents: AssetModel[] = [];
    Object.values(arrayOfMissingComponents).forEach((serialNumber: string) => {
      const newAsset = this.assetBuilder(serialNumber);
      childComponents.push(newAsset);
    });

    return childComponents;
  }

  /**
   * Finds which of the components is missing
   *
   * @private
   * @param {string[]} serialComponents
   * @param {AssetModel[]} children
   * @return {string[]}
   * @memberof AssetDetailService
   */
  private findMissingChildren(serialComponents: string[], children: AssetModel[]): string[] {
    const arrayOfChildren = [];
    children.forEach(value => {
      arrayOfChildren.push(value.serialNumberCustomer);
    });

    return serialComponents.filter(serial => !arrayOfChildren.includes(serial));
  }

  /**
   * Builds missing child asset
   *
   * @private
   * @param {string} serialNumber
   * @return {AssetModel}
   * @memberof AssetDetailService
   */
  private assetBuilder(serialNumber: string): AssetModel {
    const newAsset: AssetModel = {} as AssetModel;
    newAsset.serialNumberManufacturer = serialNumber;
    newAsset.qualityStatus = 'MISSING';
    newAsset.status = 'MISSING';
    newAsset.manufacturer = '';
    newAsset.productionCountryCodeManufacturer = '';
    newAsset.partNameManufacturer = '';
    newAsset.partNumberManufacturer = '';
    newAsset.partNumberCustomer = '';
    newAsset.serialNumberCustomer = '';
    newAsset.productionDateGmt = '';
    return newAsset;
  }
}
