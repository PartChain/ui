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

import { AclModel } from 'src/app/acl/acl.model';
import { TilesModel } from 'src/app/shared/tiles.model';
import { KpisModel } from 'src/app/kpis/kpis.model';
import { AssetModel } from '../../assets/asset.model';
import { TransactionModel } from '../../transactions/transaction.model';

/**
 *
 *
 * @export
 * @interface AssetListResponseModel
 */
export interface AssetListResponseModel {
  nextPage?: boolean;
  resultLength?: number;
  data: AssetModel[];
}

/**
 *
 *
 * @export
 * @interface AssetResponseModel
 */
export interface AssetResponseModel {
  data: AssetModel;
  status: number;
}

/**
 *
 *
 * @export
 * @interface ExportResponseModel
 */
export interface ExportResponseModel {
  type: string;
  data: number[];
}
/**
 *
 *
 * @export
 * @interface TransactionResponseModel
 */
export interface TransactionResponseModel {
  data: TransactionModel[];
  status: number;
}
/**
 *
 *
 * @export
 * @interface KPIResponseModel
 */
export interface KPIResponseModel {
  data: KpisModel;
  status: number;
}

/**
 *
 *
 * @export
 * @interface TilesResponseModel
 */
export interface TilesResponseModel {
  data: TilesModel;
  status: number;
}

/**
 *
 *
 * @export
 * @interface ACLResponseModel
 */
export interface ACLResponseModel {
  status: number;
  resultLength?: number;
  data: AclModel;
}

/**
 *
 *
 * @export
 * @interface RecommendedAclsResponseModel
 */
export interface RecommendedAclsResponseModel {
  status: number;
  resultLength?: number;
  data: string[];
}
