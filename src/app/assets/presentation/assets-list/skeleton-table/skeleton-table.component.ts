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

import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Asset } from '../../../../shared/model/asset.model';

/**
 *
 *
 * @export
 * @class SkeletonTableComponent
 */
@Component({
  selector: 'app-skeleton-list',
  templateUrl: './skeleton-table.component.html',
  styleUrls: ['./skeleton-table.component.scss'],
})
export class SkeletonTableComponent {
  /**
   * Mock table data
   *
   * @type {MatTableDataSource<Asset>}
   * @memberof SkeletonTableComponent
   */
  public data: MatTableDataSource<Asset> = new MatTableDataSource<Asset>(new Array(25).fill(null));

  /**
   * Table columns
   *
   * @type {string[]}
   * @memberof SkeletonTableComponent
   */
  public columns: string[] = [
    'select',
    'manufacturer',
    'partNameManufacturer',
    'partNumberManufacturer',
    'serialNumberManufacturer',
    'qualityStatus',
    'productionDateGmt',
    'childComponents',
  ];
}
