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
import { delay } from 'rxjs/operators';
import { SharedService } from 'src/app/shared/core/shared.service';
import { View } from 'src/app/shared/model/view.model';
import { Asset } from '../model/asset.model';
import { Changelog } from '../model/changelog.model';
import { AssetService } from '../core/asset.service';
import { AssetState } from '../core/asset.state';
import { NotificationService } from '../components/notifications/notification.service';
import { NotificationText } from '../components/notifications/notification-message/notification-text';
import { LayoutFacade } from './layout-facade';
import { ClipboardService } from 'ngx-clipboard';
import { Transaction } from 'src/app/transactions/model/transaction.model';

/**
 *
 *
 * @export
 * @class AssetFacade
 */
@Injectable()
export class AssetFacade {
  /**
   * @constructor AssetFacade (DI)
   * @param {AssetState} assetState
   * @param {AssetService} assetService
   * @param {SharedService} sharedService
   * @param {NotificationService} notificationService
   * @param {LayoutFacade} layoutFacade
   * @param {ClipboardService} clipboardService
   * @memberof AssetFacade
   */
  constructor(
    private assetState: AssetState,
    private assetService: AssetService,
    private sharedService: SharedService,
    private notificationService: NotificationService,
    private layoutFacade: LayoutFacade,
    private clipboardService: ClipboardService,
  ) {}

  /**
   * Asset state getter
   *
   * @readonly
   * @type {Observable<View<Asset>>}
   * @memberof AssetFacade
   */
  get asset$(): Observable<View<Asset>> {
    return this.assetState.getAsset$.pipe(delay(0));
  }

  /**
   * Parent state getter
   *
   * @readonly
   * @type {Observable<Asset>}
   * @memberof AssetFacade
   */
  get parent$(): Observable<Asset> {
    return this.assetState.getParent$;
  }

  /**
   * Asset history getter
   *
   * @readonly
   * @type {Observable<Changelog[]>}
   * @memberof AssetFacade
   */
  get assetHistory$(): Observable<Changelog[]> {
    return this.assetState.getAssetHistory$;
  }

  /**
   * Asset breadcrumbs getter
   *
   * @readonly
   * @type {Observable<Asset[]>}
   * @memberof AssetFacade
   */
  get assetBreadcrumb$(): Observable<Asset[]> {
    return this.assetState.getBreadcrumbAssets$;
  }

  /**
   * Is object empty
   *
   * @param {unknown} object
   * @return {boolean}
   * @memberof AssetFacade
   */
  public isEmpty(object: unknown): boolean {
    return this.sharedService.isEmpty(object);
  }

  /**
   * Asset setter
   *
   * @param {string} serialNumberCustomer
   * @param {string} propertyName
   * @return {void}
   * @memberof AssetFacade
   */
  public setAsset(serialNumberCustomer: string): void {
    this.assetState.setAsset({ loader: true });
    this.assetService.getAsset(serialNumberCustomer).subscribe(
      (asset: Asset) => {
        if (!this.sharedService.isEmpty(asset)) {
          this.assetState.setAsset({ data: asset });
        } else {
          this.assetState.setAsset({ error: new Error('Part not found') });
        }
      },
      error => of(this.assetState.setAsset({ error })),
    );
  }

  /**
   * Changelog state setter
   *
   * @param {string} serialNumberCustomer
   * @param {string} propertyName
   * @return {void}
   * @memberof AssetFacade
   */
  public setChangelog(serialNumberCustomer: string, propertyName: string): void {
    this.assetService.getAssetHistory(serialNumberCustomer, propertyName).subscribe((transactions: Transaction[]) => {
      this.assetState.setChangelog(transactions);
    });
  }

  /**
   * Parent state setter
   *
   * @param {string} serialNumberCustomer
   * @return {void}
   * @memberof AssetFacade
   */
  public setAssetParent(serialNumberCustomer: string): void {
    this.assetService.getParent(serialNumberCustomer).subscribe((asset: Asset) => {
      this.assetState.setParent(asset);
    });
  }

  /**
   * Change quality status request
   *
   * @param {string} qualityStatus
   * @param {Asset} asset
   * @return {void}
   * @memberof AssetFacade
   */
  public setQualityStatus(qualityStatus: string, asset: Asset): void {
    this.assetService
      .changeAssetQualityStatus(asset.serialNumberManufacturer, 'qualityStatus', asset.qualityStatus, qualityStatus)
      .subscribe(() => {
        this.notificationService.success(NotificationText.StatusChanged);
        this.layoutFacade.addTransactionsBadge(1);
      });
  }

  /**
   * Shorten serial number helper method
   *
   * @param {string} serialNumber
   * @return {string}
   * @memberof AssetFacade
   */
  public shortenSerialNumber(serialNumber: string): string {
    if (serialNumber) {
      return serialNumber.length > 23
        ? `${serialNumber.substring(0, 10)} ... ${serialNumber.substring(serialNumber.length - 10)}`
        : serialNumber;
    }
  }

  /**
   * Copy to clipboard helper method
   *
   * @param {string} serialNumber
   * @return {void}
   * @memberof AssetFacade
   */
  public copyToClipboard(serialNumber: string): void {
    this.clipboardService.copyFromContent(serialNumber);
    this.notificationService.success('Copied to clipboard: ' + this.shortenSerialNumber(serialNumber));
  }

  /**
   * Error notification helper method
   *
   * @param {string} notification
   * @return {void}
   * @memberof AssetFacade
   */
  public errorNotification(notification: string): void {
    this.notificationService.error(notification);
  }

  /**
   * Remove breadcrumb at position x
   *
   * @param {number} position
   * @return {void}
   * @memberof AssetFacade
   */
  public removeBreadcrumb(position: number): void {
    this.assetState.removeBreadcrumb(position);
  }

  /**
   * Reset breadcrumb to initial value
   *
   * @return {void}
   * @memberof AssetFacade
   */
  public resetBreadcrumb(): void {
    this.assetState.resetBreadcrumb();
  }
}
