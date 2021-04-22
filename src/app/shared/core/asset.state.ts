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
import { Observable } from 'rxjs';
import { State } from 'src/app/shared/model/state';
import { View } from 'src/app/shared/model/view.model';
import { Transaction } from 'src/app/transactions/model/transaction.model';
import { AssetAssembler } from './asset.assembler';
import { Asset } from '../model/asset.model';
import { Changelog } from '../model/changelog.model';

/**
 *
 *
 * @export
 * @class AssetState
 */
@Injectable()
export class AssetState {
  /**
   * Asset state
   *
   * @private
   * @readonly
   * @type {State<View<Asset>>}
   * @memberof AssetState
   */
  private readonly asset$: State<View<Asset>> = new State<View<Asset>>(undefined);

  /**
   * Breadcrumb state
   *
   * @private
   * @readonly
   * @type {State<Asset[]>}
   * @memberof AssetState
   */
  private readonly breadcrumbAssets$: State<Asset[]> = new State<Asset[]>(undefined);

  /**
   * Parent state
   *
   * @private
   * @readonly
   * @type {State<Asset>}
   * @memberof AssetState
   */
  private readonly parent$: State<Asset> = new State<Asset>(undefined);

  /**
   * Asset history state
   *
   * @private
   * @readonly
   * @type {State<Changelog[]>}
   * @memberof AssetState
   */
  private readonly assetHistory$: State<Changelog[]> = new State<Changelog[]>([]);

  /**
   * Asset search state
   *
   * @private
   * @readonly
   * @type {State<View<Asset>>}
   * @memberof AssetState
   */
  private readonly assetSearchState$: State<View<Asset>> = new State<View<Asset>>(undefined);

  /**
   * Asset state getter
   *
   * @readonly
   * @type {Observable<View<Asset>>}
   * @memberof AssetState
   */
  get getAsset$(): Observable<View<Asset>> {
    return this.asset$.observable;
  }

  /**
   * Breadcrumb state getter
   *
   * @readonly
   * @type {Observable<Asset[]>}
   * @memberof AssetState
   */
  get getBreadcrumbAssets$(): Observable<Asset[]> {
    return this.breadcrumbAssets$.observable;
  }

  /**
   * parent state getter
   *
   * @readonly
   * @type {Observable<Asset>}
   * @memberof AssetState
   */
  get getParent$(): Observable<Asset> {
    return this.parent$.observable;
  }

  /**
   * Asset history state getter
   *
   * @readonly
   * @type {Observable<Changelog[]>}
   * @memberof AssetState
   */
  get getAssetHistory$(): Observable<Changelog[]> {
    return this.assetHistory$.observable;
  }

  /**
   * Asset search state getter
   *
   * @readonly
   * @type {Observable<View<Asset>>}
   * @memberof AssetState
   */
  get getAssetSearchState$(): Observable<View<Asset>> {
    return this.assetSearchState$.observable;
  }

  /**
   * Asset state setter
   *
   * @param {View<Asset>} asset
   * @param {Transaction[]} [assetTransactions]
   * @return {void}
   * @memberof AssetState
   */
  public setAsset(asset: View<Asset>): void {
    const newAsset: View<Asset> = {
      data: asset.data && AssetAssembler.assembleAsset(asset.data),
      loader: asset.loader,
      error: asset.error,
    };
    this.asset$.update(newAsset);
    if (newAsset.data) {
      this.setBreadcrumb(newAsset.data);
    }
  }

  /**
   * Parent state setter
   *
   * @param {Asset} assetParent
   * @return {void}
   * @memberof AssetState
   */
  public setParent(assetParent: Asset): void {
    this.parent$.update(assetParent);
  }

  /**
   * Changelog state setter
   *
   * @param {Asset} asset
   * @param {Transaction[]} [assetTransactions]
   * @return {void}
   * @memberof AssetState
   */
  public setChangelog(assetTransactions?: Transaction[]): void {
    const asset: View<Asset> = this.asset$.snapshot;
    if (asset && assetTransactions) {
      const changelog: Changelog[] = AssetAssembler.assembleChangelog(assetTransactions, asset.data);
      this.assetHistory$.update(changelog);
    }
  }

  /**
   * Breadcrumb state setter
   *
   * @param {Asset} newAsset
   * @return {void}
   * @memberof AssetState
   */
  public setBreadcrumb(newAsset: Asset): void {
    if (this.breadcrumbAssets$.snapshot) {
      const hasAsset: Asset = this.breadcrumbAssets$.snapshot.find(
        value => value.serialNumberCustomer === newAsset.serialNumberCustomer,
      );
      if (!hasAsset) {
        this.breadcrumbAssets$.update([...this.breadcrumbAssets$.snapshot, newAsset]);
      }
    } else {
      this.breadcrumbAssets$.update([newAsset]);
    }
  }

  /**
   * Remove breadcrumb at position x
   *
   * @param {number} position
   * @return {void}
   * @memberof AssetState
   */
  public removeBreadcrumb(position: number): void {
    const breadcrumbs: Asset[] = this.breadcrumbAssets$.snapshot;
    breadcrumbs.splice(position, breadcrumbs.length);
  }

  /**
   * Reset breadcrumbs state
   *
   * @return {void}
   * @memberof AssetState
   */
  public resetBreadcrumb(): void {
    this.breadcrumbAssets$.reset();
  }
}
