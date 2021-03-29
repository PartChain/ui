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
import { AssetService } from '../../assets/asset.service';
import { AssetModel } from '../../assets/asset.model';

/**
 *
 *
 * @export
 * @class TableComponent
 * @implements {OnInit}
 * @implements {AfterViewInit}
 * @implements {OnChanges}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [tableAnimation],
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  /**
   * Read only table getter
   *
   * @readonly
   * @type {boolean}
   * @memberof TableComponent
   */
  get isTableReadOnly() {
    return this.tableReadOnly;
  }

  /**
   * Data source: a dataSource or an array must be passed as parameter
   *
   * @type {(MatTableDataSource<any> | Array<any>)}
   * @memberof TableComponent
   */
  @Input()
  get dataSet(): MatTableDataSource<any> | Array<any> {
    return this.data;
  }

  /**
   * Data source setter
   *
   * @param {MatTableDataSource<any> | Array<any>} data
   * @memberof TableComponent
   */
  set dataSet(data: MatTableDataSource<any> | Array<any>) {
    if (this.data !== data) {
      this.changeDetector.markForCheck();
    }
    this.data = data;
  }

  /**
   * Table sort setter
   *
   * @param {MatSort} matSort
   * @memberof TableComponent
   */
  @ViewChild(MatSort) set matSort(matSort: MatSort) {
    this.sort = matSort;
    this.setDataSourceAttributes();
  }

  /**
   * Expand to check child-table
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
   * Get clicked row
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
   * @type {(EventEmitter<Array<any> | AssetModel[]>)}
   * @memberof TableComponent
   */
  @Output() selectedRowsEmitter?: EventEmitter<Array<any> | AssetModel[]> = new EventEmitter<
    Array<any> | AssetModel[]
  >();

  /**
   * Data to be displayed
   *
   * @type {MatTableDataSource<any>}
   * @memberof TableComponent
   */
  public dataSource: MatTableDataSource<any>;

  /**
   * Columns to be displayed
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
   * Detail table columns
   *
   * @type {Array<ColumnConfig>}
   * @memberof TableComponent
   */
  public detailData: Array<ColumnConfig> = [];

  /**
   * Model to set the selected element
   *
   * @type {SelectionModel<any>}
   * @memberof TableComponent
   */
  public selection = new SelectionModel<any>(true, []);

  /**
   * Get the selected asset for managing the row background color
   *
   * @type {string}
   * @memberof TableComponent
   */
  public selectedAsset = '';

  /**
   * Gets the expanded row
   *
   * @type {*}
   * @memberof TableComponent
   */
  public expandedRow: any = {};

  /**
   * Table data
   *
   * @private
   * @type {(MatTableDataSource<any> | Array<any>)}
   * @memberof TableComponent
   */
  private data: MatTableDataSource<any> | Array<any>;

  /**
   * Data to be displayed
   *
   * @private
   * @type {Array<any>}
   * @memberof TableComponent
   */
  private dataArray: Array<any>;

  /**
   *
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
   * @type {Array<any>}
   * @memberof TableComponent
   */
  private selectedRows: Array<any> = [];

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
   * @constructor TableComponent.
   * @param {ChangeDetectorRef} changeDetector
   * @param {AssetService} assetService
   * @memberof TableComponent
   */
  constructor(public changeDetector: ChangeDetectorRef, private assetService: AssetService) {}

  /**
   * Gets the columns names and labels
   *
   * @static
   * @param {*} dataObject
   * @return {Array<ColumnConfig>}
   * @memberof TableComponent
   */
  static searchColumnDefinition(dataObject: any): Array<ColumnConfig> {
    const keys: Array<ColumnConfig> = [];

    for (const name of Object.keys(dataObject)) {
      keys.push({ fieldName: name, label: name });
    }
    return keys;
  }

  /**
   * Angular lifecycle method - On init
   *
   * @return {void}
   * @memberof TableComponent
   */
  ngOnInit(): void {
    this.initTable();
  }

  /**
   * Angular lifecycle method - After view init
   *
   * @return {void}
   * @memberof TableComponent
   */
  ngAfterViewInit(): void {
    this.initializeTechnicalColumns();
  }

  /**
   * Angular lifecycle method - On changes
   *
   * @param {SimpleChanges} changes
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
      this.assetService.selectedAssetUUID$.next(undefined);
      this.selectedAsset = undefined;
    }
  }

  /**
   * Angular lifecycle method - On destroy
   *
   * @return {void}
   * @memberof TableComponent
   */
  ngOnDestroy(): void {
    this.assetService.selectedAssetUUID$.next(undefined);
  }

  /**
   * Method to handle row clicks.
   *
   * @param {*} row
   * @param {ColumnConfig} column
   * @memberof TableComponent
   */
  public onRowClick(row, column: ColumnConfig): void {
    if (column.type !== 'TABLE') {
      const selectedAssetUUID = this.assetService.selectedAssetUUID$.getValue();
      if (selectedAssetUUID !== row.serialNumberCustomer) {
        this.assetService.selectedAssetUUID$.next(row.serialNumberCustomer);
        this.selectedAsset = row.serialNumberCustomer;
      } else {
        // On the second click on the same row, deselect the row
        this.assetService.selectedAssetUUID$.next(undefined);
        this.selectedAsset = undefined;
      }
      if (this.expandedRow.isExpanded) {
        this.expandedRow.isExpanded = false;
      }
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
   * Whether the number of selected elements matches the total number of rows.
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
   * Selects all rows if they are not all selected; otherwise clear selection.
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
  public checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.serialNumberCustomer + 1}`;
  }

  /**
   * Handles the type of actions that should be available on row selection
   *
   * @returns {void}
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
   * Click event to expand the child table
   *
   * @param {*} row
   * @param {string} data
   * @param {ColumnConfig} [column]
   * @memberof TableComponent
   */
  public onDetailGrid(row: any, data: string, column?: ColumnConfig): void {
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
   * @param {*} column
   * @return {Table}
   * @memberof TableComponent
   */
  public getDetailConfiguration(column: any): Table {
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
      this.dataSource = new MatTableDataSource<any>(this.dataArray);
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
   * First column builder
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
   * Check if the select column is visible
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
   * Column builder
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
