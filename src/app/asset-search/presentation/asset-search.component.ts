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
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/components/notifications/notification.service';
import { Asset } from '../../shared/model/asset.model';
import { ClipboardService } from 'ngx-clipboard';
import { AssetFacade } from '../../shared/abstraction/asset-facade';
import { View } from '../../shared/model/view.model';

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
   * Serial number searched
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
   * Is searching flag
   *
   * @type {boolean}
   * @memberof AssetSearchComponent
   */
  public isSearching: boolean;

  /**
   * Asset state
   *
   * @type {Observable<View<Asset>>}
   * @memberof AssetSearchComponent
   */
  public asset$: Observable<View<Asset>>;

  /**
   * Parent state
   *
   * @type {Observable<Asset>}
   * @memberof AssetSearchComponent
   */
  public parent$: Observable<Asset>;

  /**
   * Breadcrumb state
   *
   * @type {Observable<Asset[]>}
   * @memberof AssetSearchComponent
   */
  public breadcrumb$: Observable<Asset[]>;

  /**
   * @constructor AssetSearchComponent
   * @param {NotificationService} notificationService
   * @param {ClipboardService} clipboardService
   * @param {AssetFacade} assetFacade
   * @memberof AssetSearchComponent
   */
  constructor(
    private notificationService: NotificationService,
    private clipboardService: ClipboardService,
    private assetFacade: AssetFacade,
  ) {
    this.asset$ = this.assetFacade.asset$;
    this.parent$ = this.assetFacade.parent$;
    this.breadcrumb$ = this.assetFacade.assetBreadcrumb$;
  }

  /**
   * Angular lifecycle method - After View Init
   * Event search subscription
   *
   * @return {void}
   * @memberof AssetSearchComponent
   */
  ngAfterViewInit(): void {
    fromEvent(this.serialNumber.nativeElement, 'keyup')
      .pipe(
        map((event: KeyboardEvent) => {
          this.isSearching = true;
          return (event.target as HTMLInputElement).value;
        }),
        filter(value => value.length > 2),
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe((serialNumberCustomer: string) => {
        this.assetFacade.resetBreadcrumb();
        this.assetFacade.setAsset(serialNumberCustomer);
        this.assetFacade.setAssetParent(serialNumberCustomer);
        this.isSearching = false;
      });
  }

  /**
   * Is empty helper method
   *
   * @param {Asset} asset
   * @return {boolean}
   * @memberof AssetSearchComponent
   */
  public isEmpty(asset: Asset): boolean {
    return this.assetFacade.isEmpty(asset);
  }

  /**
   * Copy serial number to clipboard
   *
   * @param {string} serialNumber
   * @return {void}
   * @memberof AssetSearchComponent
   */
  public copyToClipboard(serialNumber: string): void {
    this.clipboardService.copyFromContent(serialNumber);
    this.notificationService.success('Copied to clipboard ' + this.assetFacade.shortenSerialNumber(serialNumber));
  }

  /**
   * Search for child components
   *
   * @param {string} serialNumber
   * @return {void}
   * @memberof AssetSearchComponent
   */
  public getChild(serialNumber: string): void {
    this.isSearching = true;
    this.assetFacade.setAsset(serialNumber);
    this.assetFacade.setAssetParent(serialNumber);
  }

  /**
   * Search for breadcrumb asset
   *
   * @param {Asset} asset
   * @param {number} i
   * @return {void}
   * @memberof AssetSearchComponent
   */
  public getSelectedAsset(asset: Asset, i: number): void {
    this.assetFacade.removeBreadcrumb(i);
    this.assetFacade.setAsset(asset.serialNumberCustomer);
    this.assetFacade.setAssetParent(asset.serialNumberCustomer);
  }

  /**
   * Search for parent asset
   * We reset the breadcrumb since the parent already has the children to search
   *
   * @param {string} parentAsset
   * @return {void}
   * @memberof AssetSearchComponent
   */
  public getParentAsset(parentAsset: string): void {
    this.isSearching = true;
    this.assetFacade.resetBreadcrumb();
    this.assetFacade.setAsset(parentAsset);
    this.assetFacade.setAssetParent(parentAsset);
  }

  /**
   * Icon label key
   *
   * @param {Asset} asset
   * @return {string}
   * @memberof AssetSearchComponent
   */
  public getIcon(asset: Asset): string {
    const mspid = asset.mspid
      .trim()
      .toString()
      .toLocaleLowerCase();
    return mspid !== 'lion' && mspid !== '92a2bd' ? 'car-components-2' : 'car';
  }
}
