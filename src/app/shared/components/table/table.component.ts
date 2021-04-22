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

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ColumnConfig } from './column-config';
import { Table } from './table';
import { ColumnType } from './column-type';
import { TableFactory } from './table-factory';
import { tableAnimation } from './table-animation';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AssetsListFacade } from 'src/app/assets/abstraction/assets-list.facade';

/**
 *
 *
 * @export
 * @class TableComponent
 * @implements {OnInit}
 * @implements {AfterViewInit}
 * @implements {OnChanges}
 * @implements {OnDestroy}
 * @template T
 */
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [tableAnimation],
})
export class TableComponent<T> implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  /**
   * Read only table getter
   *
   * @readonly
   * @type {boolean}
   * @memberof TableComponent
   */
  get isTableReadOnly(): boolean {
    return this.tableReadOnly;
  }

  /**
   * Data source: a dataSource or an array must be passed as parameter
   *
   * @type {(MatTableDataSource<T> | Array<T>)}
   * @memberof TableComponent
   */
  @Input()
  get dataSet(): MatTableDataSource<T> | Array<T> {
    return this.data;
  }

  /**
   * Table data setter
   *
   * @param {MatTableDataSource<T> | Array<T>} data
   * @memberof TableComponent
   */
  set dataSet(data: MatTableDataSource<T> | Array<T>) {
    if (this.data !== data) {
      this.changeDetector.markForCheck();
    }
    this.data = data;
  }

  /**
   * Mat sort setter
   *
   * @param {MatSort} matSort
   * @memberof TableComponent
   */
  @ViewChild(MatSort) set matSort(matSort: MatSort) {
    this.sort = matSort;
    this.setDataSourceAttributes();
  }

  /**
   * Child table element
   *
   * @type {ElementRef}
   * @memberof TableComponent
   */
  @ViewChild('gridTemplate', { static: true }) gridTemplate: ElementRef;

  /**
   * Is a single child row
   *
   * @type {boolean}
   * @memberof TableComponent
   */
  @Input() singleChildRowDetail: boolean;

  /**
   * Clear selected rows
   *
   * @type {boolean}
   * @memberof TableComponent
   */
  @Input() removeSelection = false;

  /**
   * Clicked row
   *
   * @type {string}
   * @memberof TableComponent
   */
  @Input() clickedRow: string;

  /**
   * The Table class contains the configuration of the table and columns
   *
   * @type {Table}
   * @memberof TableComponent
   */
  @Input() tableConfiguration?: Table = new Table(undefined, undefined);

  /**
   * Emits the number of selected rows
   *
   * @type {EventEmitter<Array<T>>}
   * @memberof TableComponent
   */
  @Output() selectedRowsEmitter?: EventEmitter<Array<T>> = new EventEmitter<Array<T>>();

  /**
   * Emits the clicked row
   *
   * @type {EventEmitter<boolean>}
   * @memberof TableComponent
   */
  @Output() clickedRowEmitter?: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Table data
   *
   * @type {MatTableDataSource<T>}
   * @memberof TableComponent
   */
  public dataSource: MatTableDataSource<T>;

  /**
   * Table columns
   *
   * @type {Array<string>}
   * @memberof TableComponent
   */
  public columnsToShow: Array<string> = [];

  /**
   * Binding columns
   *
   * @type {Array<ColumnConfig>}
   * @memberof TableComponent
   */
  public dataColumns?: Array<ColumnConfig>;

  /**
   * Table detail data
   *
   * @type {Array<ColumnConfig>}
   * @memberof TableComponent
   */
  public detailData: Array<ColumnConfig> = [];

  /**
   * Model to set the selected element
   *
   * @type {SelectionModel<T>}
   * @memberof TableComponent
   */
  public selection = new SelectionModel<T>(true, []);

  /**
   * Get the selected asset for managing the row background color
   *
   * @type {string}
   * @memberof TableComponent
   */
  public selectedAsset = '';

  /**
   * Current expanded row
   *
   * @type {{}}
   * @memberof TableComponent
   */
  public expandedRow = {};

  /**
   * Mat table data
   *
   * @private
   * @type {(MatTableDataSource<T> | Array<T>)}
   * @memberof TableComponent
   */
  private data: MatTableDataSource<T> | Array<T>;

  /**
   * Data array
   *
   * @private
   * @type {Array<T>}
   * @memberof TableComponent
   */
  private dataArray: Array<T>;

  /**
   * Handle the checkbox view within the table
   *
   * @private
   * @type {boolean}
   * @memberof TableComponent
   */
  private tableReadOnly = true;

  /**
   * First column to display -> select checkboxes
   * This is set if the table is not read only
   *
   * @private
   * @type {Array<ColumnConfig>}
   * @memberof TableComponent
   */
  private technicalColumnsBegin: Array<ColumnConfig>;

  /**
   * Selected rows
   *
   * @private
   * @type {Array<T>}
   * @memberof TableComponent
   */
  private selectedRows: Array<T> = [];

  /**
   * Count of the selected rows
   *
   * @private
   * @type {number}
   * @memberof TableComponent
   */
  private numberOfSelectedItems = 0;

  /**
   * Material table sort
   *
   * @private
   * @type {MatSort}
   * @memberof TableComponent
   */
  private sort: MatSort;

  /**
   * @constructor TableComponent
   * @param {ChangeDetectorRef} changeDetector
   * @param {AssetsListFacade} assetsFacade
   * @memberof TableComponent
   */
  constructor(public changeDetector: ChangeDetectorRef, private assetsFacade: AssetsListFacade) {
    this.selectedAsset = undefined;
  }

  /**
   * Gets the columns names and labels
   *
   * @static
   * @template T
   * @param {T} dataObject
   * @return {Array<ColumnConfig>}
   * @memberof TableComponent
   */
  static searchColumnDefinition<T>(dataObject: T): Array<ColumnConfig> {
    const keys: Array<ColumnConfig> = [];

    for (const name of Object.keys(dataObject)) {
      keys.push({ fieldName: name, label: name });
    }
    return keys;
  }

  /**
   * Angular lifecycle method - Ng On Init
   *
   * @return {void}
   * @memberof TableComponent
   */
  ngOnInit(): void {
    this.initTable();
  }

  /**
   * Angular lifecycle method - Ng After View Init
   *
   * @return {void}
   * @memberof TableComponent
   */
  ngAfterViewInit(): void {
    this.initializeTechnicalColumns();
  }

  /**
   * Angular lifecycle method - Ng On Changes
   *
   * @return {void}
   * @memberof TableComponent
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet || changes.tableConfiguration) {
      this.initTable();
    }

    if (changes.removeSelection) {
      this.selection.clear();
    }

    if (typeof this.clickedRow === 'undefined') {
      this.assetsFacade.setSelectedAsset(undefined);
      this.selectedAsset = undefined;
    }
  }

  /**
   * Angular lifecycle method - Ng On Destroy
   *
   * @return {void}
   * @memberof TableComponent
   */
  ngOnDestroy(): void {
    this.assetsFacade.setSelectedAsset(undefined);
    this.selectedAsset = undefined;
  }

  /**
   * Method to nav what happens when a row is clicked.
   *
   * @param {*} row
   * @param {ColumnConfig} column
   * @return {void}
   * @memberof TableComponent
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public onRowClick(row, column: ColumnConfig): void {
    if (column.type !== 'TABLE') {
      this.assetsFacade.setSelectedAsset(row.serialNumberCustomer);
      this.selectedAsset = row.serialNumberCustomer;
    }
  }

  /**
   * Table empty state for read only tables
   *
   * @return {string}
   * @memberof TableComponent
   */
  public getTableEmptyState(): string {
    if (this.dataSource.filteredData.length === 0 && !!this.tableConfiguration.tableConfig.emptyStateReason) {
      return this.tableConfiguration.tableConfig.emptyStateReason;
    }
    return 'No data available';
  }

  /**
   * Whether the number of selected elements matches the total number of rows
   *
   * @return {boolean}
   * @memberof TableComponent
   */
  public isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    this.setSelectionActions();
    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection
   *
   * @return {void}
   * @memberof TableComponent
   */
  public masterToggle(): void {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
    this.setSelectionActions();
  }

  /**
   * The label for the checkbox on the passed row
   *
   * @param {*} [row]
   * @return {string}
   * @memberof TableComponent
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.serialNumberCustomer + 1}`;
  }

  /**
   * Handles the type of actions that should be available on row selection
   *
   * @return {void}
   * @memberof TableComponent
   */
  public setSelectionActions(): void {
    this.numberOfSelectedItems = this.selectedRows.length;
    this.selectedRows = this.selection.selected;
    this.selectedRowsEmitter.emit(this.selectedRows);
  }

  /**
   * Gets the columns styles
   *
   * @param {ColumnConfig} cell
   * @return {{ flex: number }}
   * @memberof TableComponent
   */
  public getStyle(cell: ColumnConfig): { flex: number } {
    if (cell && cell.width) {
      return { flex: cell.width };
    }

    return { flex: 1.1 };
  }

  /**
   * Selected row style
   *
   * @param {*} row
   * @return {{ 'background-color': string }}
   * @memberof TableComponent
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public getRowStyle(row): { 'background-color': string } {
    return this.selectedAsset === row.serialNumberCustomer
      ? { 'background-color': '#efefef' }
      : { 'background-color': '#fff' };
  }

  /**
   * Gets class for downloadable columns
   *
   * @param {ColumnConfig} cell
   * @return {string}
   * @memberof TableComponent
   */
  public getClass(cell: ColumnConfig): string {
    if (ColumnType.FILE === cell.type) {
      return 'download';
    }
  }

  /**
   * Expand detail table on click
   *
   * @param {*} row
   * @param {string} data
   * @return {void}
   * @memberof TableComponent
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public onDetailGrid(row, data: string): void {
    row.selectedTemplate = this.gridTemplate;
    if (typeof row.isExpanded === 'undefined') {
      row.isExpanded = false;
    }

    row.isExpanded = !row.isExpanded;
    row.selectedColumn = data;
    this.expandedRow = row;
  }

  /**
   * Detail table builder
   *
   * @param {string} column
   * @return {Table}
   * @memberof TableComponent
   */
  public getDetailConfiguration(column: string): Table {
    if (!this.dataColumns) {
      return TableFactory.buildTable(undefined, undefined);
    }

    for (const col in this.dataColumns) {
      if (column === this.dataColumns[col].fieldName) {
        if (this.dataColumns[col].detailTable) {
          const table = this.dataColumns[col].detailTable;
          if (table) {
            return table;
          }
        } else {
          return TableFactory.buildTable(undefined, undefined);
        }
      }
    }

    return TableFactory.buildTable(undefined, undefined);
  }

  /**
   * Table builder
   *
   * @return {void}
   * @memberof TableComponent
   */
  public initTable(): void {
    this.changeDetector.detach();

    if (this.data instanceof MatTableDataSource) {
      this.dataSource = this.data;
    } else if (this.data instanceof Array) {
      this.dataArray = this.data;
    }

    if (this.dataArray) {
      this.dataSource = new MatTableDataSource<T>(this.dataArray);
    }

    this.initializeTechnicalColumns();
    this.dataColumns = [];

    if (this.tableConfiguration && this.tableConfiguration.columnDefinition) {
      for (const item of this.tableConfiguration.columnDefinition) {
        this.dataColumns.push(item);
      }
      this.columnsToShow = this.setColumnsToShow(this.technicalColumnsBegin, this.dataColumns);
    } else {
      // we try to extract the definition from the dataset
      if (this.dataSource.data.length > 0) {
        this.dataColumns = TableComponent.searchColumnDefinition(this.dataSource.data[0]);
        if (this.columnsToShow.length === 0) {
          this.columnsToShow = this.setColumnsToShow(this.technicalColumnsBegin, this.dataColumns);
        }
      }
    }

    this.changeDetector.reattach();
  }

  /**
   * Gets the first table column
   *
   * @private
   * @return {void}
   * @memberof TableComponent
   */
  private initializeTechnicalColumns(): void {
    this.technicalColumnsBegin = [];
    this.tableReadOnly = !this.isTechnicalColumnsBeginVisible();

    // show the select checkbox only if record and table are editable
    if (!this.tableReadOnly) {
      this.technicalColumnsBegin.push({ fieldName: 'select', label: 'select' });
    }
  }

  /**
   * Checks if the table configuration and the table content allows content update
   *
   * @private
   * @return {boolean}
   * @memberof TableComponent
   */
  private isTechnicalColumnsBeginVisible(): boolean {
    let visibility = false;

    if (this.tableConfiguration && this.tableConfiguration.tableConfig) {
      visibility = !this.tableConfiguration.tableConfig.isReadOnly;
    }

    return visibility;
  }

  /**
   * Setting the sort functionality
   *
   * @private
   * @return {void}
   * @memberof TableComponent
   */
  private setDataSourceAttributes(): void {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  /**
   * Prepares all the columns to be displayed
   *
   * @private
   * @param {Array<ColumnConfig>} standardColBegin
   * @param {Array<ColumnConfig>} appColumns
   * @return {Array<string>}
   * @memberof TableComponent
   */
  private setColumnsToShow(standardColBegin: Array<ColumnConfig>, appColumns: Array<ColumnConfig>): Array<string> {
    const columns: Array<string> = [];

    if (typeof standardColBegin !== 'undefined') {
      for (const column of standardColBegin) {
        columns.push(column.fieldName);
      }
    }

    for (const column of appColumns) {
      if (!column.hide) {
        columns.push(column.fieldName);
      }

      if (column.hide && column.showInDetail) {
        this.detailData.push(column);
      }
    }

    return columns;
  }
}
