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
import { Asset } from 'src/app/shared/model/asset.model';

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
   * Total os assets
   *
   * @type {number}
   * @memberof TableSelectionComponent
   */
  @Input() totalOfAssets: number;

  /**
   * Selected rows
   *
   * @type {Asset[]}
   * @memberof TableSelectionComponent
   */
  @Input() selectedRows: Asset[];

  /**
   * Page title
   *
   * @type {string}
   * @memberof TableSelectionComponent
   */
  @Input() title: string;

  /**
   * Loading complete flag
   *
   * @type {boolean}
   * @memberof TableSelectionComponent
   */
  @Input() loadingComplete: boolean;

  /**
   * Clear selection event emitter
   *
   * @type {EventEmitter<boolean>}
   * @memberof TableSelectionComponent
   */
  @Output() selection: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Get all assets event emitter
   *
   * @type {EventEmitter<boolean>}
   * @memberof TableSelectionComponent
   */
  @Output() getAllAssets: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Is getting all assets flag
   *
   * @type {boolean}
   * @memberof TableSelectionComponent
   */
  public isGettingAllAssets = false;

  /**
   * Type of data (vehicles, parts, components)
   *
   * @type {string}
   * @memberof TableSelectionComponent
   */
  public typeOfData = '';

  /**
   * Angular lifecycle method - Ng On Changes
   *
   * @param {SimpleChanges} changes
   * @return {void}
   * @memberof TableSelectionComponent
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.title) {
      this.typeOfData = changes.title.currentValue.substr(this.title.indexOf(' ') + 1).toLocaleLowerCase();
    }
  }

  /**
   * Emit request all assets event
   *
   * @return {void}
   * @memberof TableSelectionComponent
   */
  public getAssets(): void {
    this.isGettingAllAssets = true;
    this.getAllAssets.emit(true);
  }

  /**
   * Get proper message for number of rows selected
   *
   * @param {number} row
   * @return {string}
   * @memberof TableSelectionComponent
   */
  public numberOfRowsSelected(row: number): string {
    return row === 1 ? `${row} ${this.typeOfData.slice(0, -1)}` : `${row} ${this.typeOfData}`;
  }

  /**
   * Clear selection event
   *
   * @return {void}
   * @memberof TableSelectionComponent
   */
  public clearSelection(): void {
    this.selection.emit(true);
    this.isGettingAllAssets = false;
  }
}
