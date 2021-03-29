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
import { NotificationService } from '../../../shared/notifications/notification.service';
import { AssetModel } from '../../asset.model';
import { AssetDetailService } from '../asset-detail.service';
import { Observable, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 *
 *
 * @export
 * @class AssetParentComponent
 * @implements {OnChanges}
 */
@Component({
  selector: 'app-asset-parent',
  templateUrl: './asset-parent.component.html',
  styleUrls: ['./asset-parent.component.scss'],
})
export class AssetParentComponent implements OnChanges {
  /**
   * Asset serial number
   *
   * @type {string}
   * @memberof AssetParentComponent
   */
  @Input() serialNumber: string;

  /**
   * Asset event emitter
   *
   * @type {EventEmitter<string>}
   * @memberof AssetParentComponent
   */
  @Output() assetEvent = new EventEmitter<string>();

  /**
   * Asset parent observable
   *
   * @type {Observable<AssetModel>}
   * @memberof AssetParentComponent
   */
  public parentAsset$ = new Observable<AssetModel>();

  /**
   * @constructor AssetParentComponent.
   * @param {AssetDetailService} assetDetailService
   * @param {NotificationService} notificationService
   * @memberof AssetParentComponent
   */
  constructor(private assetDetailService: AssetDetailService, private notificationService: NotificationService) {}

  /**
   * Angular lifecycle method - On Changes
   *
   * @param {SimpleChanges} changes
   * @return {void}
   * @memberof AssetParentComponent
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.serialNumber) {
      this.getParent(changes.serialNumber.currentValue);
    }
  }

  /**
   * Asset parent emitter
   *
   * @param {string} serialNumber
   * @return {void}
   * @memberof AssetParentComponent
   */
  public getParentAsset(serialNumber: string): void {
    this.assetEvent.emit(serialNumber);
  }

  /**
   * Helper method to shorten the serial number
   *
   * @param {string} serialNumber
   * @return {string}
   * @memberof AssetParentComponent
   */
  public shortenSerialNumber(serialNumber: string): string {
    return this.assetDetailService.shortenSerialNumber(serialNumber);
  }

  /**
   * Get asset parent request
   *
   * @private
   * @param {string} serialNumber
   * @return {void}
   * @memberof AssetParentComponent
   */
  private getParent(serialNumber: string): void {
    if (serialNumber) {
      (this.parentAsset$ = this.assetDetailService.getAssetParent(serialNumber).pipe()),
        catchError(err => {
          this.notificationService.error(this.notificationService.errorServiceResponse(err));
          return EMPTY;
        });
    }
  }
}
