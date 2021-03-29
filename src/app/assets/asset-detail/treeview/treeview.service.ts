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
import { AssetModel } from '../../asset.model';
import { FlatNodeModel } from './flat-node.model';
import { of as observableOf, Observable } from 'rxjs';

/**
 * Tree view injectable service
 *
 * @export
 * @class TreeviewService
 */
@Injectable({
  providedIn: 'root',
})
export class TreeviewService {
  /**
  /** Transform the data to something the tree can read.
   *
   * @param {AssetModel} node
   * @param {number} level
   * @return {{
   *     partNameManufacturer: string;
   *     serialNumberManufacturer: string;
   *     serialNumberCustomer: string;
   *     qualityStatus: string;
   *     icon: string;
   *     level: number;
   *     expandable: boolean;
   *   }}
   * @memberof TreeviewService
   */
  public transformer(
    node: AssetModel,
    level: number,
  ): {
    partNameManufacturer: string;
    serialNumberManufacturer: string;
    serialNumberCustomer: string;
    qualityStatus: string;
    icon: string;
    level: number;
    expandable: boolean;
  } {
    return {
      partNameManufacturer: node.partNameManufacturer,
      serialNumberManufacturer: node.serialNumberManufacturer,
      serialNumberCustomer: node.serialNumberCustomer,
      qualityStatus: node.qualityStatus,
      icon: node.icon,
      level,
      expandable: !!node.childComponents,
    };
  }

  /**
   * Get the level of the node
   *
   * @param {FlatNodeModel} node
   * @return {number}
   * @memberof TreeviewService
   */
  public getLevel(node: FlatNodeModel): number {
    return node.level;
  }

  /**
   * Return whether the node is expanded or not
   *
   * @param {FlatNodeModel} node
   * @return {boolean}
   * @memberof TreeviewService
   */
  public isExpandable(node: FlatNodeModel): boolean {
    return node.expandable;
  }

  /**
   * Get the children for the node
   *
   * @param {AssetModel} node
   * @return {Observable<AssetModel[]>}
   * @memberof TreeviewService
   */
  public getChildren(node: AssetModel): Observable<AssetModel[]> {
    return observableOf(node.childComponents);
  }
}
