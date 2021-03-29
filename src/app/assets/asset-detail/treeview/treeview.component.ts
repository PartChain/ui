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
import { AssetModel } from '../../asset.model';
import { FlatNodeModel } from './flat-node.model';
import { TreeviewService } from './treeview.service';
import { AssetDetailService } from '../asset-detail.service';

/**
 *
 *
 * @export
 * @class TreeviewComponent
 * @implements {OnChanges}
 */
@Component({
  selector: 'app-treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.scss'],
})
export class TreeviewComponent implements OnChanges {
  /**
   * Tree view asset
   *
   * @type {AssetModel}
   * @memberof TreeviewComponent
   */
  @Input() treeViewAssetData: AssetModel;

  /**
   * Asset event emitter
   *
   * @return {EventEmitter<string>}
   * @memberof TreeviewComponent
   */
  @Output() assetEvent = new EventEmitter<string>();

  /**
   * Asset parent icon
   *
   * @type {object}
   * @memberof TreeviewComponent
   */
  public icon = {
    OK: 'checkbox-circle-line',
    NOK: 'close-circle-line',
    FLAG: 'flag-line',
    MISSING: 'error-warning-line',
  };

  /**
   * Asset child icon
   *
   * @type {object}
   * @memberof TreeviewComponent
   */
  public childIcon = {
    OK: 'checkbox-circle-line',
    NOK: 'close-circle-line',
    FLAG: 'flag-line',
    MISSING: 'error-warning-line',
  };

  /**
   * The TreeControl controls the expand/collapse state of tree nodes
   *
   * @type {FlatTreeControl<FlatNodeModel>}
   * @memberof TreeviewComponent
   */
  public treeControl: FlatTreeControl<FlatNodeModel>;

  /**
   * The MatTreeFlatDataSource connects the control and flattener to provide data
   *
   * @type {MatTreeFlatDataSource<AssetModel, FlatNodeModel>}
   * @memberof TreeviewComponent
   */
  public dataSource: MatTreeFlatDataSource<AssetModel, FlatNodeModel>;

  /**
   * The TreeFlattener is used to generate the flat list of items from hierarchical data
   *
   * @private
   * @type {MatTreeFlattener<AssetModel, FlatNodeModel>}
   * @memberof TreeviewComponent
   */
  private treeFlattener: MatTreeFlattener<AssetModel, FlatNodeModel>;

  /**
   * @constructor TreeviewComponent.
   * @param {AssetDetailService} assetDetailService
   * @param {TreeviewService} treeviewService
   * @memberof TreeviewComponent
   */
  constructor(private assetDetailService: AssetDetailService, private treeviewService: TreeviewService) {}

  /**
   * Angular lifecycle method - On Changes
   *
   * @return {void}
   * @memberof TreeviewComponent
   */
  ngOnChanges(): void {
    this.treeFlattener = new MatTreeFlattener<AssetModel, FlatNodeModel>(
      this.treeviewService.transformer,
      this.treeviewService.getLevel,
      this.treeviewService.isExpandable,
      this.treeviewService.getChildren,
    );

    this.treeControl = new FlatTreeControl<FlatNodeModel>(
      this.treeviewService.getLevel,
      this.treeviewService.isExpandable,
    );
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataSource.data = [this.treeViewAssetData];
  }

  /**
   * Has child
   *
   * @param {number} _
   * @param {FlatNodeModel} node
   * @memberof TreeviewComponent
   */
  public hasChild = (_: number, node: FlatNodeModel) => node.expandable;

  /**
   * Asset event emitter
   *
   * @param {string} serialNumber
   * @return {void}
   * @memberof TreeviewComponent
   */
  public getAssetComponent(serialNumber: string): void {
    this.assetEvent.emit(serialNumber);
  }

  /**
   * Helper method to shorten the serial number
   *
   * @param {string} serialNumber
   * @return {string}
   * @memberof TreeviewComponent
   */
  public shortenSerialNumber(serialNumber: string): string {
    return this.assetDetailService.shortenSerialNumber(serialNumber);
  }

  /**
   * Expanded icon
   *
   * @param {*} node
   * @return {string}
   * @memberof TreeviewComponent
   */
  public getExpandedIcon(node): string {
    if (node.expandable) {
      return this.treeControl.isExpanded(node) ? 'arrow-down-s-line' : 'arrow-right-s-line';
    }
  }
}
