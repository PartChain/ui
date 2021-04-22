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

import { union } from 'lodash-es';
import { Transaction } from 'src/app/transactions/model/transaction.model';
import { Asset } from '../model/asset.model';
import { Changelog } from '../model/changelog.model';

/**
 *
 *
 * @export
 * @class AssetAssembler
 */
export class AssetAssembler {
  /**
   * Asset assembler
   * We are fetching the missing components
   * and add them to the child components list
   *
   * @static
   * @param {Asset} asset
   * @return {Asset}
   * @memberof AssetAssembler
   */
  public static assembleAsset(asset: Asset): Asset {
    const childComponents: Asset[] = this.isUndefined(asset.childComponents) as Asset[];
    const componentsSerialNumbers: string[] = this.isUndefined(asset.componentsSerialNumbers) as string[];
    const missingChildren: Asset[] = [];
    if (componentsSerialNumbers.length !== childComponents.length) {
      missingChildren.push(...AssetAssembler.fetchEmptyChildren(asset));
    }
    const mergedChildren: Asset[] = union(missingChildren, asset.childComponents);
    const status = {
      OK: 'checkbox-circle-line',
      NOK: 'close-circle-line',
      FLAG: 'flag-line',
    };
    const icon =
      missingChildren.length > 0 && asset.qualityStatus === 'OK' ? 'error-warning-line' : status[asset.qualityStatus];

    return {
      ...asset,
      childComponents: mergedChildren,
      icon,
    };
  }

  /**
   * Changelog assembler
   *
   * @static
   * @param {Transaction[]} transactions
   * @param {Asset} timelineAsset
   * @return {Changelog[]}
   * @memberof AssetAssembler
   */
  public static assembleChangelog(transactions: Transaction[], timelineAsset: Asset): Changelog[] {
    const changelog: Changelog[] = [] as Changelog[];
    let changelogValue = {} as Changelog;
    const mspid: string = timelineAsset.mspid
      .trim()
      .toString()
      .toLocaleLowerCase();
    const part: 'Vehicle' | 'Component' = mspid === 'lion' || mspid === '92a2bd' ? 'Vehicle' : 'Component';
    const action = {
      OK: 'Updated',
      NOK: 'Blocked',
      FLAG: 'Flagged',
    };
    const icon = {
      OK: 'arrow-left-right-fill',
      NOK: 'close-circle',
      FLAG: 'flag-line',
    };

    const productionDate: Changelog = this.getProductionDate(timelineAsset, part);
    changelog.unshift(productionDate);

    if (transactions.length > 0) {
      transactions.forEach((transaction: Transaction) => {
        changelogValue.action = `${part} ${action[transaction.propertyNewValue]}`;
        changelogValue.timestamp = transaction.timestampChanged;
        changelogValue.icon = icon[transaction.propertyNewValue];
        changelog.push(changelogValue);
        changelogValue = {} as Changelog;
      });
    }
    return changelog.reverse();
  }

  /**
   * Helper method to fetch the components that are missing
   *
   * @private
   * @static
   * @param {Asset} asset
   * @return {Asset[]}
   * @memberof AssetAssembler
   */
  private static fetchEmptyChildren(asset: Asset): Asset[] {
    const arrayOfMissingComponents: string[] = this.findMissingChildren(
      asset.componentsSerialNumbers,
      asset.childComponents,
    );
    const childComponents: Asset[] = [];
    Object.values(arrayOfMissingComponents).forEach((serialNumber: string) => {
      const newAsset = this.assetBuilder(serialNumber);
      childComponents.push(newAsset);
    });

    return childComponents;
  }

  /**
   * Helper method to replace undefined values
   * with empty arrays
   *
   * @private
   * @static
   * @param {(string[] | Asset[])} value
   * @return {(string[] | Asset[])}
   * @memberof AssetAssembler
   */
  private static isUndefined(value: string[] | Asset[]): string[] | Asset[] {
    if (typeof value === 'undefined') {
      value = [];
    }
    return value;
  }

  /**
   * We are using the asset production date
   * as the created value for the asset changelog
   *
   * @private
   * @static
   * @param {Asset} asset
   * @param {string} part
   * @return {Changelog}
   * @memberof AssetAssembler
   */
  private static getProductionDate(asset: Asset, part: string): Changelog {
    const created = {} as Changelog;
    created.action = `${part} Created`;
    created.timestamp = asset.productionDateGmt;
    created.icon = 'check-fill';
    return created;
  }

  /**
   * Helper method to find which components are missing
   *
   * @private
   * @static
   * @param {string[]} serialComponents
   * @param {Asset[]} children
   * @return {string[]}
   * @memberof AssetAssembler
   */
  private static findMissingChildren(serialComponents: string[], children: Asset[]): string[] {
    const arrayOfChildren = [];
    children.forEach(value => arrayOfChildren.push(value.serialNumberCustomer));

    return serialComponents.filter(serial => !arrayOfChildren.includes(serial));
  }

  /**
   * Missing asset builder
   *
   * @private
   * @static
   * @param {string} serialNumber
   * @return {Asset}
   * @memberof AssetAssembler
   */
  private static assetBuilder(serialNumber: string): Asset {
    return {
      serialNumberManufacturer: serialNumber,
      qualityStatus: 'MISSING',
      status: 'MISSING',
      manufacturer: '',
      productionCountryCodeManufacturer: '',
      partNameManufacturer: '',
      partNumberManufacturer: '',
      partNumberCustomer: '',
      serialNumberCustomer: '',
      productionDateGmt: '',
      mspid: '',
      serialNumberType: '',
    };
  }
}
