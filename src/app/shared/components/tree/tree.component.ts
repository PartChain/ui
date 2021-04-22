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

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Asset } from 'src/app/shared/model/asset.model';
import { FlatNode } from './flat-node.model';
import { TreeService } from './tree.service';

/**
 *
 *
 * @export
 * @class TreeComponent
 * @implements {OnChanges}
 */
@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent implements OnChanges {
  // TODO: MAKE THIS MORE GENERIC FOR OTHER DATA MODELS
  /**
   * Tree asset
   *
   * @type {Asset}
   * @memberof TreeComponent
   */
  @Input() treeViewAssetData: Asset;

  /**
   * Asset event emitter
   *
   * @type {EventEmitter<string>}
   * @memberof TreeComponent
   */
  @Output() assetEvent = new EventEmitter<string>();

  /**
   * Parent icon
   *
   * @type {*} {OK: string,
      NOK: 'close-circle-line',
      FLAG: 'flag-line',
      MISSING: 'error-warning-line'}
   * @memberof TreeComponent
   */
  public icon = {
    OK: 'checkbox-circle-line',
    NOK: 'close-circle-line',
    FLAG: 'flag-line',
    MISSING: 'error-warning-line',
  };

  /**
   * Children icon
   *
   * @type {*} {OK: string,
      NOK: 'close-circle-line',
      FLAG: 'flag-line',
      MISSING: 'error-warning-line'}
   * @memberof TreeComponent
   */
  public childIcon = {
    OK: 'checkbox-circle-line',
    NOK: 'close-circle-line',
    FLAG: 'flag-line',
    MISSING: 'error-warning-line',
  };

  /**
   * Tree control
   *
   * @type {FlatTreeControl<FlatNode>}
   * @memberof TreeComponent
   */
  public treeControl: FlatTreeControl<FlatNode>;

  /**
   * Tree data source
   *
   * @type {MatTreeFlatDataSource<Asset, FlatNode>}
   * @memberof TreeComponent
   */
  public dataSource: MatTreeFlatDataSource<Asset, FlatNode>;

  /**
   * Tree flattener
   *
   * @private
   * @type {MatTreeFlattener<Asset, FlatNode>}
   * @memberof TreeComponent
   */
  private treeFlattener: MatTreeFlattener<Asset, FlatNode>;

  /**
   * @constructor TreeComponent
   * @param {TreeService} treeService
   * @memberof TreeComponent
   */
  constructor(private treeService: TreeService) {}

  /**
   * Angular lifecycle method - Ng On Changes
   *
   * @return {void}
   * @memberof TreeComponent
   */
  ngOnChanges(): void {
    this.treeFlattener = new MatTreeFlattener<Asset, FlatNode>(
      this.treeService.transformer,
      this.treeService.getLevel,
      this.treeService.isExpandable,
      this.treeService.getChildren,
    );

    this.treeControl = new FlatTreeControl<FlatNode>(this.treeService.getLevel, this.treeService.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataSource.data = [this.treeViewAssetData];
  }

  /**
   * Tree has child
   *
   * @param {number} _
   * @param {FlatNode} node
   * @return {boolean}
   * @memberof TreeComponent
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public hasChild = (_: number, node: FlatNode) => node.expandable;

  /**
   * Tree asset event
   *
   * @param {string} serialNumber
   * @return {void}
   * @memberof TreeComponent
   */
  public getAssetComponent(serialNumber: string): void {
    this.assetEvent.emit(serialNumber);
  }

  /**
   * Get icon
   *
   * @param {FlatNode} node
   * @return {string}
   * @memberof TreeComponent
   */
  public getExpandedIcon(node: FlatNode): string {
    if (node.expandable) {
      return this.treeControl.isExpanded(node) ? 'arrow-down-s-line' : 'arrow-right-s-line';
    }
  }
}
