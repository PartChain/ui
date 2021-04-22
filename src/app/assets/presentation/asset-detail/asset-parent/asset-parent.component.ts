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
import { Asset } from '../../../../shared/model/asset.model';
import { Observable } from 'rxjs';
import { AssetFacade } from 'src/app/shared/abstraction/asset-facade';

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
   * Serial number
   *
   * @type {string}
   * @memberof AssetParentComponent
   */
  @Input() serialNumber: string;

  /**
   * Asset serial number event emitter
   *
   * @type {EventEmitter<string>}
   * @memberof AssetParentComponent
   */
  @Output() assetEvent = new EventEmitter<string>();

  /**
   * Parent state
   *
   * @type {Observable<Asset>}
   * @memberof AssetParentComponent
   */
  public assetParent$: Observable<Asset> = new Observable<Asset>();

  /**
   * @constructor AssetParentComponent
   * @param {AssetFacade} assetFacade
   * @memberof AssetParentComponent
   */
  constructor(private assetFacade: AssetFacade) {
    this.assetParent$ = this.assetFacade.parent$;
  }

  /**
   * Angular lifecycle method - Ng On Changes
   *
   * @param {SimpleChanges} changes
   * @return {void}
   * @memberof AssetParentComponent
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.serialNumber) {
      this.assetFacade.setAssetParent(changes.serialNumber.currentValue);
    }
  }

  /**
   * Parent serial number event
   *
   * @param {string} serialNumber
   * @return {void}
   * @memberof AssetParentComponent
   */
  public getParentAsset(serialNumber: string): void {
    this.assetEvent.emit(serialNumber);
  }
}
