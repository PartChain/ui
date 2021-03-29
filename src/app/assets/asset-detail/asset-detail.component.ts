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

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { AssetModel, CustomField } from '../asset.model';
import { TransactionModel } from '../../transactions/transaction.model';
import { NotificationService } from '../../shared/notifications/notification.service';
import { realm } from '../../core/api/api.service.properties';
import { AssetDetailService } from './asset-detail.service';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

/**
 *
 *
 * @export
 * @class AssetDetailComponent
 * @implements {OnChanges}
 */
@Component({
  selector: 'app-asset-detail',
  templateUrl: './asset-detail.component.html',
  styleUrls: ['./asset-detail.component.scss'],
})
export class AssetDetailComponent implements OnChanges {
  /**
   * Asset serial number
   *
   * @type {string}
   * @memberof AssetDetailComponent
   */
  @Input() serialNumber: string;

  /**
   * Asset type
   *
   * @type {string}
   * @memberof AssetDetailComponent
   */
  @Input() assetType: string;

  /**
   * Page title
   *
   * @type {string}
   * @memberof AssetDetailComponent
   */
  @Input() title: string;

  /**
   * Close sidebar emitter
   *
   * @type {EventEmitter}
   * @memberof AssetDetailComponent
   */
  @Output() closeEditPanelEvent = new EventEmitter();

  /**
   * Asset exists
   *
   * @type {boolean}
   * @memberof AssetDetailComponent
   */
  public assetExists: boolean;

  /**
   * Organization configuration reference
   *
   * @type {string}
   * @memberof AssetDetailComponent
   */
  public organization: string;

  /**
   * Handle collapsed timeline
   *
   * @type {boolean}
   * @memberof AssetDetailComponent
   */
  public isTimelineCollapsed = false;

  /**
   * Handle collapsed tree view
   *
   * @type {boolean}
   * @memberof AssetDetailComponent
   */
  public isTreeViewCollapsed = false;

  /**
   * Timeline data
   *
   * @type {TransactionModel[]}
   * @memberof AssetDetailComponent
   */
  public timelineData: TransactionModel[];

  /**
   * Parent asset
   *
   * @type {AssetModel}
   * @memberof AssetDetailComponent
   */
  public parent: AssetModel;

  /**
   * Asset detail observable
   *
   * @type {Observable<AssetModel>}
   * @memberof AssetDetailComponent
   */
  public assetDetail$ = new Observable<AssetModel>();

  /**
   * Enable back arrow after asset navigation
   *
   * @type {boolean}
   * @memberof AssetDetailComponent
   */
  public showArrow = false;

  /**
   * Asset custom fields
   *
   * @type {CustomField[]}
   * @memberof AssetDetailComponent
   */
  public customFields: CustomField[] = [];

  /**
   * Error message handler
   *
   * @private
   * @type {Subject<string>}
   * @memberof AssetDetailComponent
   */
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  /**
   * Stores the previous value of qualityStatus to prevent duplicate changes
   *
   * @private
   * @type {string}
   * @memberof AssetDetailComponent
   */
  private previousQualityStatus = '';

  /**
   * Stores the previous value of serialNumber to handle parent details search
   *
   * @private
   * @type {string}
   * @memberof AssetDetailComponent
   */
  private previousSerialNumber = '';

  /**
   * @constructor AssetDetailComponent.
   * @param {AssetDetailService} assetDetailService
   * @param {NotificationService} notificationService
   * @param {ClipboardService} clipboardService
   * @memberof AssetDetailComponent
   */
  constructor(
    private assetDetailService: AssetDetailService,
    private notificationService: NotificationService,
    private clipboardService: ClipboardService,
  ) {
    if (realm) {
      this.organization = realm[1];
    }
  }

  /**
   * Angular lifecycle method - On Changes
   *
   * @param {SimpleChanges} changes
   * @return {void}
   * @memberof AssetDetailComponent
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.isTimelineCollapsed = false;
    this.isTreeViewCollapsed = false;
    if (changes.serialNumber) {
      this.showArrow = false;
      this.getAsset(changes.serialNumber.currentValue);
    }
  }

  /**
   * Close sidebar emitter
   *
   * @return {void}
   * @memberof AssetDetailComponent
   */
  public dialogClose(): void {
    this.closeEditPanelEvent.emit();
  }

  /**
   * Change asset quality status
   *
   * @param {string} qualityStatus
   * @param {AssetModel} asset
   * @memberof AssetDetailComponent
   */
  public changeQualityStatus(qualityStatus: string, asset: AssetModel): void {
    if (qualityStatus !== this.previousQualityStatus && qualityStatus !== asset.qualityStatus) {
      this.assetDetailService.changeAssetQualityStatus(
        asset.serialNumberManufacturer,
        'qualityStatus',
        asset.qualityStatus,
        qualityStatus,
      );
      this.previousQualityStatus = qualityStatus;
    } else {
      this.notificationService.error(`The status is already marked as ${qualityStatus}`);
    }
  }

  /**
   * handle collapsed timeline
   *
   * @return {void}
   * @memberof AssetDetailComponent
   */
  public getTimelineData(): void {
    this.isTimelineCollapsed = !this.isTimelineCollapsed;
  }

  /**
   * handle collapsed tree view
   *
   * @return {void}
   * @memberof AssetDetailComponent
   */
  public getTreeViewData(): void {
    this.isTreeViewCollapsed = !this.isTreeViewCollapsed;
  }

  /**
   * Render the previous asset searched
   *
   * @type {void}
   * @memberof AssetDetailComponent
   */
  public getChild(): void {
    this.showArrow = false;
    this.serialNumber = this.previousSerialNumber;
    this.getAsset(this.serialNumber);
  }

  /**
   * Render child asset
   *
   * @type {void}
   * @memberof AssetDetailComponent
   */
  public getAssetFromComponent(serialNumber: string): void {
    this.getAsset(serialNumber);
    this.isTimelineCollapsed = false;
    this.isTreeViewCollapsed = false;
  }

  /**
   * Render parent asset
   *
   * @type {void}
   * @memberof AssetDetailComponent
   */
  public getAssetParent(serialNumber: string): void {
    this.showArrow = true;
    this.previousSerialNumber = this.serialNumber;
    this.serialNumber = serialNumber;
    this.getAsset(this.serialNumber);
  }

  /**
   * Helper method to shorten the serial number
   *
   * @param {string} serialNumber
   * @return {string}
   * @memberof AssetDetailComponent
   */
  public shortenSerialNumber(serialNumber: string): string {
    return this.assetDetailService.shortenSerialNumber(serialNumber);
  }

  /**
   * Clipboard copy
   *
   * @param {string} serialNumber
   * @return {void}
   * @memberof AssetDetailComponent
   */
  public copyToClipboard(serialNumber: string): void {
    this.clipboardService.copyFromContent(serialNumber);
    this.notificationService.success('Copied to clipboard ' + this.shortenSerialNumber(serialNumber));
  }

  /**
   * Gets expanded icon
   *
   * @param {boolean} event
   * @return {string}
   * @memberof AssetDetailComponent
   */
  public getExpandedIcon(event: boolean): string {
    return event ? 'arrow-up-s-fill' : 'arrow-down-s-fill';
  }

  /**
   * Get asset request
   *
   * @private
   * @param {string} serialNumber
   * @return {void}
   * @memberof AssetDetailComponent
   */
  private getAsset(serialNumber: string): void {
    this.assetDetail$ = this.assetDetailService.getAsset(serialNumber).pipe(
      tap((asset: AssetModel) => {
        this.setParent(asset);
        asset.childComponents = this.assetDetailService.isUndefined(asset.childComponents) as AssetModel[];
        asset.componentsSerialNumbers = this.assetDetailService.isUndefined(asset.componentsSerialNumbers) as string[];

        let missingComponents = false;
        const children: AssetModel[] = [];
        if (asset.componentsSerialNumbers.length !== asset.childComponents.length) {
          missingComponents = true;
          children.push(...this.assetDetailService.fetchEmptyChildren(asset));
        }

        asset.childComponents.push(...children);

        const fields = asset.customFields;
        for (const field in fields) {
          this.customFields.push({
            field,
            value: fields[field],
          });
        }

        this.assetDetailService.getMissingComponentIcon(asset, missingComponents);
      }),
      catchError(err => {
        this.errorMessageSubject.next(err);
        this.notificationService.error(err);
        return EMPTY;
      }),
    );
  }

  /**
   * Parent asset setter
   *
   * @private
   * @param {AssetModel} asset
   * @return {void}
   * @memberof AssetDetailComponent
   */
  private setParent(asset: AssetModel): void {
    if (this.parent === undefined || asset.serialNumberManufacturer === this.parent.serialNumberManufacturer) {
      this.parent = asset;
    }
  }
}
