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
import { AssetModel } from '../../asset.model';
import { AssetService } from '../../asset.service';
import { NotificationService } from '../../../shared/notifications/notification.service';
import { FormGroup } from '@angular/forms';
import { FilterService } from '../../../shared/assets-filter/filter.service';

/**
 *
 *
 * @export
 * @class TableSelectionComponent
 * @implements {OnChanges}
 */
@Component({
  selector: 'app-table-selection',
  templateUrl: './table-selection.component.html',
  styleUrls: ['./table-selection.component.scss'],
})
export class TableSelectionComponent implements OnChanges {
  /**
   * Total of assets filtered
   *
   * @type {number}
   * @memberof TableSelectionComponent
   */
  @Input() totalOfAssets: number;

  /**
   * Form group
   *
   * @type {FormGroup}
   * @memberof TableSelectionComponent
   */
  @Input() formFilters: FormGroup;

  /**
   * Asset params
   *
   * @type {string[]}
   * @memberof TableSelectionComponent
   */
  @Input() assetModel: string[];

  /**
   * Type of assets
   *
   * @type {string}
   * @memberof TableSelectionComponent
   */
  @Input() assetsType: string;

  /**
   * Number of selected rows
   *
   * @type {number}
   * @memberof TableSelectionComponent
   */
  @Input() selectedRows: number;

  /**
   * Page length
   *
   * @type {number}
   * @memberof TableSelectionComponent
   */
  @Input() pageLength: number;

  /**
   * Page title
   *
   * @type {string}
   * @memberof TableSelectionComponent
   */
  @Input() title: string;

  /**
   * Clear selection emitter
   *
   * @type {EventEmitter<boolean>}
   * @memberof TableSelectionComponent
   */
  @Output() selection: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Nr° of selected assets emitter
   *
   * @type {EventEmitter<AssetModel[]>}
   * @memberof TableSelectionComponent
   */
  @Output() selectedAssets: EventEmitter<AssetModel[]> = new EventEmitter<AssetModel[]>();

  /**
   * Getting all assets flag
   *
   * @type {boolean}
   * @memberof TableSelectionComponent
   */
  public isGettingAllAssets: boolean;

  /**
   * Are all assets selected flag
   *
   * @type {boolean}
   * @memberof TableSelectionComponent
   */
  public totalOfComponentsSelected = false;

  /**
   * Type of data displayed
   *
   * @type {string}
   * @memberof TableSelectionComponent
   */
  public typeOfData = '';

  /**
   * @constructor TableSelectionComponent.
   * @param {AssetService} assetService
   * @param {NotificationService} notificationService
   * @param {FilterService} filterService
   * @memberof TableSelectionComponent
   */
  constructor(
    private assetService: AssetService,
    private notificationService: NotificationService,
    private filterService: FilterService,
  ) {}

  /**
   * Angular lifecycle method - On Changes
   *
   * @param {SimpleChanges} changes
   * @returns {void}
   * @memberof TableSelectionComponent
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.title) {
      this.typeOfData = changes.title.currentValue.substr(this.title.indexOf(' ') + 1).toLocaleLowerCase();
    }
  }

  /**
   * Get assets request
   *
   * @return {void}
   * @memberof TableSelectionComponent
   */
  public getAssetListAwait(): void {
    this.isGettingAllAssets = true;
    this.assetService
      .getAssets(this.filterService.getModalFilters(this.formFilters, this.assetsType), -1, this.assetModel)
      .toPromise()
      .then(
        (asset: any) => {
          this.totalOfComponentsSelected = true;
          this.isGettingAllAssets = false;
          this.selectedAssets.emit(asset.data);
        },
        error => {
          this.isGettingAllAssets = false;
          this.notificationService.error(this.notificationService.errorServiceResponse(error));
        },
      );
  }

  /**
   * Method to label the number of rows selected
   *
   * @param {number} row
   * @return {string}
   * @memberof TableSelectionComponent
   */
  public numberOfRowsSelected(row: number): string {
    return row === 1 ? `${row} ${this.typeOfData.slice(0, -1)}` : `${row} ${this.typeOfData}`;
  }

  /**
   * Clear selection emitter
   *
   * @return {void}
   * @memberof TableSelectionComponent
   */
  public clearSelection(): void {
    this.selection.emit(true);
    this.totalOfComponentsSelected = false;
    this.selectedAssets.emit([]);
  }
}
