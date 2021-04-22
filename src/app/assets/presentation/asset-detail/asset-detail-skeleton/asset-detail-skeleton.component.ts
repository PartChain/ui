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

import { Component, Input } from '@angular/core';

/**
 *
 *
 * @export
 * @class AssetDetailSkeletonComponent
 */
@Component({
  selector: 'app-asset-detail-skeleton',
  templateUrl: './asset-detail-skeleton.component.html',
  styleUrls: ['./asset-detail-skeleton.component.scss'],
})
export class AssetDetailSkeletonComponent {
  /**
   * Asset query type
   *
   * @type {string}
   * @memberof AssetDetailSkeletonComponent
   */
  @Input() assetType: string;
}
