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
import { Asset } from '../../model/asset.model';
import { FlatNode } from './flat-node.model';
import { of as observableOf, Observable } from 'rxjs';

/**
 *
 *
 * @export
 * @class TreeService
 */
@Injectable({
  providedIn: 'root',
})
export class TreeService {
  /**
   * Transform the data to something the tree can read
   *
   * @param {Asset} node
   * @param {number} level
   * @return {*}  {{
   *     partNameManufacturer: string;
   *     serialNumberManufacturer: string;
   *     serialNumberCustomer: string;
   *     qualityStatus: string;
   *     icon: string;
   *     manufacturer: string;
   *     productionCountryCodeManufacturer: string;
   *     partNumberManufacturer?: string;
   *     partNumberCustomer?: string;
   *     status: string;
   *     productionDateGmt: string;
   *     componentsSerialNumbers?: string[];
   *     mspid: string;
   *     manufacturerLine?: string;
   *     manufacturerPlant?: string;
   *     serialNumberType: string;
   *     level: number;
   *     expandable: boolean;
   *   }}
   * @memberof TreeService
   */
  public transformer(
    node: Asset,
    level: number,
  ): {
    partNameManufacturer: string;
    serialNumberManufacturer: string;
    serialNumberCustomer: string;
    qualityStatus: string;
    icon: string;
    manufacturer: string;
    productionCountryCodeManufacturer: string;
    partNumberManufacturer?: string;
    partNumberCustomer?: string;
    status: string;
    productionDateGmt: string;
    componentsSerialNumbers?: string[];
    mspid: string;
    manufacturerLine?: string;
    manufacturerPlant?: string;
    serialNumberType: string;
    level: number;
    expandable: boolean;
  } {
    return {
      partNameManufacturer: node.partNameManufacturer,
      serialNumberManufacturer: node.serialNumberManufacturer,
      serialNumberCustomer: node.serialNumberCustomer,
      qualityStatus: node.qualityStatus,
      icon: node.icon,
      manufacturer: node.manufacturer,
      productionCountryCodeManufacturer: node.productionCountryCodeManufacturer,
      partNumberManufacturer: node.partNameManufacturer,
      partNumberCustomer: node.partNumberCustomer,
      status: node.status,
      productionDateGmt: node.productionDateGmt,
      componentsSerialNumbers: node.componentsSerialNumbers,
      mspid: node.mspid,
      manufacturerLine: node.manufacturerLine,
      manufacturerPlant: node.manufacturerPlant,
      serialNumberType: node.serialNumberType,
      level,
      expandable: !!node.childComponents,
    };
  }

  /**
   * Get the level of the node
   *
   * @param {FlatNode} node
   * @return {number}
   * @memberof TreeService
   */
  public getLevel(node: FlatNode): number {
    return node.level;
  }

  /**
   * Return whether the node is expanded or not
   *
   * @param {FlatNode} node
   * @return {boolean}
   * @memberof TreeService
   */
  public isExpandable(node: FlatNode): boolean {
    return node.expandable;
  }

  /**
   * Get the children for the node
   *
   * @param {Asset} node
   * @return {Observable<Asset[]>}
   * @memberof TreeService
   */
  public getChildren(node: Asset): Observable<Asset[]> {
    return observableOf(node.childComponents);
  }
}
