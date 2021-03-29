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

import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { EMPTY, fromEvent, Observable, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/notifications/notification.service';
import { AssetDetailService } from '../assets/asset-detail/asset-detail.service';
import { AssetModel, CustomField } from '../assets/asset.model';
import { isEmpty } from 'lodash-es';
import { ClipboardService } from 'ngx-clipboard';

/**
 *
 *
 * @export
 * @class AssetSearchComponent
 * @implements {AfterViewInit}
 */
@Component({
  selector: 'app-asset-search',
  templateUrl: './asset-search.component.html',
  styleUrls: ['./asset-search.component.scss'],
})
export class AssetSearchComponent implements AfterViewInit {
  /**
   * Serial number typed
   *
   * @type {ElementRef}
   * @memberof AssetSearchComponent
   */
  @ViewChild('serialNumber', { read: ElementRef, static: true })
  serialNumber: ElementRef;

  /**
   * Page title
   *
   * @type {string}
   * @memberof AssetSearchComponent
   */
  public title = 'Find Part';

  /**
   * Car icon
   *
   * @type {string}
   * @memberof AssetSearchComponent
   */
  public key = '';

  /**
   * Is searching enable
   *
   * @type {boolean}
   * @memberof AssetSearchComponent
   */
  public isSearching: boolean;

  /**
   * Breadcrumb asset array
   *
   * @type {AssetModel[]}
   * @memberof AssetSearchComponent
   */
  public assets: AssetModel[] = [];

  /**
   * Asset serial number for parent search
   *
   * @type {string}
   * @memberof AssetSearchComponent
   */
  public assetSerialNumber = '';

  /**
   * Asset detail
   *
   * @type {Observable<AssetModel>}
   * @memberof AssetSearchComponent
   */
  public assetDetail$ = new Observable<AssetModel>();

  /**
   * Asset custom fields
   *
   * @type {CustomField[]}
   * @memberof AssetSearchComponent
   */
  public customFields: CustomField[] = [];

  /**
   * Error message handler
   *
   * @private
   * @type {Subject<string>}
   * @memberof AssetSearchComponent
   */
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  /**
   * @constructor AssetSearchComponent.
   * @param {NotificationService} notificationService
   * @param {AssetDetailService} assetDetailService
   * @param {ClipboardService} clipboardService
   * @memberof AssetSearchComponent
   */
  constructor(
    private notificationService: NotificationService,
    private assetDetailService: AssetDetailService,
    private clipboardService: ClipboardService,
  ) {}

  /**
   * Angular lifecycle method - After view Init
   *
   * @return {void}
   * @memberof AssetSearchComponent
   */
  ngAfterViewInit(): void {
    fromEvent(this.serialNumber.nativeElement, 'keyup')
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        filter(value => value.length > 2),
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe((text: string) => {
        this.isSearching = true;
        this.assets = [];
        this.assetDetail$ = this.getAsset(text);
      });
  }

  /**
   * Helper method to shorten the serial number
   *
   * @param {string} serialNumber
   * @return {string}
   * @memberof AssetSearchComponent
   */
  public shortenSerialNumber(serialNumber: string): string {
    return this.assetDetailService.shortenSerialNumber(serialNumber);
  }

  /**
   * Helper method to check for empty objects
   *
   * @param {AssetModel} asset
   * @return {boolean}
   * @memberof AssetSearchComponent
   */
  public isEmpty(asset: AssetModel): boolean {
    return isEmpty(asset);
  }

  /**
   * Clipboard copy
   *
   * @param {string} serialNumber
   * @return {void}
   * @memberof AssetSearchComponent
   */
  public copyToClipboard(serialNumber: string): void {
    this.clipboardService.copyFromContent(serialNumber);
    this.notificationService.success('Copied to clipboard ' + this.shortenSerialNumber(serialNumber));
  }

  /**
   * Get child request
   *
   * @param {string} serialNumber
   * @return {void}
   * @memberof AssetSearchComponent
   */
  public getChild(serialNumber: string): void {
    this.isSearching = true;
    this.assetDetail$ = this.getAsset(serialNumber);
  }

  /**
   * Breadcrumb selected asset
   *
   * @param {number} i
   * @return {void}
   * @memberof AssetSearchComponent
   */
  public getSelectedAsset(i: number): void {
    const asset = this.assets[i];
    this.assetDetail$ = this.getAsset(asset.serialNumberCustomer);
    i === 0 ? (this.assets = []) : this.assets.splice(i);
  }

  /**
   * Get parent request
   *
   * @param {string} parentAsset
   * @return {void}
   * @memberof AssetSearchComponent
   */
  public getParentAsset(parentAsset: string): void {
    this.isSearching = true;
    this.assetDetail$ = this.getAsset(parentAsset);
  }

  /**
   * Get asset request
   *
   * @private
   * @param {string} serialNumber
   * @return {Observable<AssetModel>}
   * @memberof AssetSearchComponent
   */
  private getAsset(serialNumber: string): Observable<AssetModel> {
    return this.assetDetailService.getAsset(serialNumber).pipe(
      tap((asset: AssetModel) => {
        if (asset.manufacturer) {
          this.assetSerialNumber = asset.serialNumberCustomer;
          const check = this.assets.find(value => value.serialNumberCustomer === asset.serialNumberCustomer);
          if (!check) {
            this.assets.push(asset);
          }

          asset.childComponents = this.assetDetailService.isUndefined(asset.childComponents) as AssetModel[];
          asset.componentsSerialNumbers = this.assetDetailService.isUndefined(
            asset.componentsSerialNumbers,
          ) as string[];

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
          const mspid = asset.mspid
            .trim()
            .toString()
            .toLocaleLowerCase();
          mspid !== 'lion' && mspid !== '92a2bd' ? (this.key = 'car-components-2') : (this.key = 'car');
        }
        this.isSearching = false;
      }),
      catchError(err => {
        this.isSearching = false;
        this.errorMessageSubject.next(err);
        this.notificationService.error(err);
        return EMPTY;
      }),
    );
  }
}
