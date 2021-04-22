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

import { AssetsPerDay } from './assets-per-day.model';
import { AssetsPerPlant } from './assets-per-plant.model';
import { QualityStatusRatio } from './quality-status-ratio.model';

/**
 *
 *
 * @export
 * @interface Dashboard
 */
export interface Dashboard {
  qualityStatusRatio: QualityStatusRatio;
  AssetsCountPerCountryAndSupplier: AssetsPerPlant;
  assetsPerDay: AssetsPerDay;
  assetsCount: number;
  ownAssetsCount: number;
  otherAssetsCount: number;
}

/**
 *
 *
 * @export
 * @interface DashboardFilter
 */
export interface DashboardFilter {
  productionDateFrom: { value: string };
  productionDateTo: { value: string };
}
