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
import { Asset } from '../../../shared/model/asset.model';
import { realm } from '../../../core/api/api.service.properties';
import { Observable } from 'rxjs';
import { AssetFacade } from '../../../shared/abstraction/asset-facade';
import { View } from 'src/app/shared/model/view.model';

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
   * Serial number
   *
   * @type {string}
   * @memberof AssetDetailComponent
   */
  @Input() serialNumber: string;

  /**
   * Asset query type
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
   * Close event emitter
   *
   * @type {EventEmitter}
   * @memberof AssetDetailComponent
   */
  @Output() closeEditPanelEvent = new EventEmitter();

  /**
   * Current organization
   *
   * @type {string}
   * @memberof AssetDetailComponent
   */
  public organization: string;

  /**
   * Timeline expandable flag
   *
   * @type {boolean}
   * @memberof AssetDetailComponent
   */
  public isTimelineCollapsed = false;

  /**
   * Treeview expandable flag
   *
   * @type {boolean}
   * @memberof AssetDetailComponent
   */
  public isTreeViewCollapsed = false;

  /**
   * Show arrow flag
   *
   * @type {boolean}
   * @memberof AssetDetailComponent
   */
  public showArrow = false;

  /**
   * Asset state
   *
   * @type {Observable<View<Asset>>}
   * @memberof AssetDetailComponent
   */
  public asset$: Observable<View<Asset>>;

  /**
   * Previous quality status
   *
   * @private
   * @type {string}
   * @memberof AssetDetailComponent
   */
  private previousQualityStatus = '';

  /**
   * Previous serial number
   *
   * @private
   * @type {string}
   * @memberof AssetDetailComponent
   */
  private previousSerialNumber = '';

  /**
   * @constructor AssetDetailComponent
   * @param {AssetFacade} assetFacade
   * @memberof AssetDetailComponent
   */
  constructor(private assetFacade: AssetFacade) {
    if (realm) {
      this.organization = realm[1];
    }
    this.asset$ = this.assetFacade.asset$;
  }

  /**
   * Angular lifecycle method - Ng On Changes
   *
   * @param {SimpleChanges} changes
   * @return {void}
   * @memberof AssetDetailComponent
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.isTimelineCollapsed = true;
    this.isTreeViewCollapsed = true;
    if (changes.serialNumber) {
      this.assetFacade.setAsset(changes.serialNumber.currentValue);
    }
  }

  /**
   * Dialog close event
   *
   * @return {void}
   * @memberof AssetDetailComponent
   */
  public dialogClose(): void {
    this.closeEditPanelEvent.emit();
  }

  /**
   * Change quality status request
   *
   * @param {string} qualityStatus
   * @param {Asset} asset
   * @return {void}
   * @memberof AssetDetailComponent
   */
  public changeQualityStatus(qualityStatus: string, asset: Asset): void {
    if (qualityStatus !== this.previousQualityStatus && qualityStatus !== asset.qualityStatus) {
      this.assetFacade.setQualityStatus(qualityStatus, asset);
      this.previousQualityStatus = qualityStatus;
    } else {
      this.assetFacade.errorNotification(`The status is already marked as ${qualityStatus}`);
    }
  }

  /**
   * Get child asset
   *
   * @return {void}
   * @memberof AssetDetailComponent
   */
  public getChild(): void {
    this.showArrow = false;
    this.serialNumber = this.previousSerialNumber;
    this.assetFacade.setAsset(this.serialNumber);
  }

  /**
   * Get asset from tree view
   *
   * @param {string} serialNumber
   * @return {void}
   * @memberof AssetDetailComponent
   */
  public getAssetFromComponent(serialNumber: string): void {
    this.showArrow = true;
    this.previousSerialNumber = this.serialNumber;
    this.isTimelineCollapsed = true;
    this.isTreeViewCollapsed = true;
    this.assetFacade.setAsset(serialNumber);
  }

  /**
   * Get parent asset
   *
   * @param {string} serialNumber
   * @return {void}
   * @memberof AssetDetailComponent
   */
  public getAssetParent(serialNumber: string): void {
    this.showArrow = true;
    this.previousSerialNumber = this.serialNumber;
    this.serialNumber = serialNumber;
    this.assetFacade.setAsset(serialNumber);
  }

  /**
   * Copy serial number to clipboard
   *
   * @param {string} serialNumber
   * @return {void}
   * @memberof AssetDetailComponent
   */
  public copyToClipboard(serialNumber: string): void {
    this.assetFacade.copyToClipboard(serialNumber);
  }

  /**
   * Expanded icon handler
   *
   * @param {boolean} event
   * @return {string}
   * @memberof AssetDetailComponent
   */
  public getExpandedIcon(event: boolean): string {
    return event ? 'arrow-up-s-fill' : 'arrow-down-s-fill';
  }

  /**
   * Quality status status should only be available on the page (My parts) owned by the logged user
   *
   * @param {Asset} asset
   * @return {boolean}
   * @memberof AssetDetailComponent
   */
  public isAuthorizeToChangeStatus(asset: Asset): boolean {
    return (
      (this.assetType === 'own' && this.organization === `${asset.mspid.toLocaleLowerCase()}Realm`) ||
      this.organization === `${asset.mspid.toLocaleLowerCase()}`
    );
  }
}
