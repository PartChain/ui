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

import { ColumnConfig } from '../../shared/components/table/column-config';
import { ColumnType } from '../../shared/components/table/column-type';
import { TableFactory } from '../../shared/components/table/table-factory';
import { Table } from '../../shared/components/table/table';
import { TableConfig } from '../../shared/components/table/table-config';

/**
 *
 *
 * @export
 * @class AssetListTableBuilder
 */
export class AssetListTableBuilder {
  /**
   * Table builder
   *
   * @static
   * @return {Table}
   * @memberof AssetListTableBuilder
   */
  static getTable(): Table {
    // data of the detail
    const detailColumns: Array<ColumnConfig> = [
      {
        fieldName: 'manufacturer',
        label: 'Manufacturer',
        hide: false,
        width: 3,
      },
      {
        fieldName: 'partNameManufacturer',
        label: 'Part Name',
        hide: false,
        width: 4,
      },
      {
        fieldName: 'partNumberManufacturer',
        label: 'Part Number',
        hide: false,
        width: 2,
      },
      {
        fieldName: 'serialNumberCustomer',
        label: 'Serial Number',
        hide: false,
        width: 5,
      },
      {
        fieldName: 'qualityStatus',
        label: 'Quality Status',
        hide: false,
        width: 2,
      },
      {
        fieldName: 'productionDateGmt',
        label: 'Production Date',
        hide: false,
        type: ColumnType.DATE,
        width: 2,
      },
    ];

    // build the table that contains the details
    const detailTable: Table = TableFactory.buildTable(
      detailColumns,
      new TableConfig(false, { emptyStateReason: 'No data available' }),
    );

    const columnsConfig: Array<ColumnConfig> = [
      {
        fieldName: 'manufacturer',
        label: 'Manufacturer',
        hide: false,
        width: 2,
      },
      { fieldName: 'partNameManufacturer', label: 'Part Name', hide: false },
      {
        fieldName: 'partNumberManufacturer',
        label: 'Part Number',
        hide: false,
      },
      {
        fieldName: 'serialNumberCustomer',
        label: 'Serial Number',
        hide: false,
        width: 6,
      },
      {
        fieldName: 'qualityStatus',
        label: 'Quality Status',
        hide: false,
        width: 1,
      },
      {
        fieldName: 'productionDateGmt',
        label: 'Production Date',
        hide: false,
        type: ColumnType.DATE,
      },
      {
        fieldName: 'childComponents',
        label: 'Components',
        hide: false,
        type: ColumnType.TABLE,
        width: 1,
        detailTable,
      },
    ];
    return TableFactory.buildTable(columnsConfig, new TableConfig(true, { emptyStateReason: 'No data available' }));
  }

  /**
   * Mobile table builder
   *
   * @static
   * @return {Table}
   * @memberof AssetListTableBuilder
   */
  static getMobileScreenTable(): Table {
    const detailColumns: Array<ColumnConfig> = [
      {
        fieldName: 'partNameManufacturer',
        label: 'Part Name',
        hide: false,
        width: 0.3,
      },
      {
        fieldName: 'serialNumberCustomer',
        label: 'Serial Number',
        hide: false,
        width: 0.5,
      },
    ];

    // build the table that contains the details
    const detailTable: Table = TableFactory.buildTable(
      detailColumns,
      new TableConfig(false, { emptyStateReason: 'No data available' }),
    );

    const columnsConfig: Array<ColumnConfig> = [
      {
        fieldName: 'partNameManufacturer',
        label: 'Part Name',
        hide: false,
        width: 0.3,
      },
      {
        fieldName: 'serialNumberCustomer',
        label: 'Serial Number',
        hide: false,
        width: 0.5,
      },
      {
        fieldName: 'childComponents',
        label: 'Components',
        hide: false,
        type: ColumnType.TABLE,
        width: 0.3,
        detailTable,
      },
    ];
    return TableFactory.buildTable(columnsConfig, new TableConfig(true, { emptyStateReason: 'No data available' }));
  }
}
