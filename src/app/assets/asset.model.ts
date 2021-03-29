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

/**
 *
 *
 * @export
 * @interface CustomField
 */
export interface CustomField {
  field: string;
  value: string;
}

/**
 *
 *
 * @export
 * @interface AssetModel
 */
export interface AssetModel {
  manufacturer: string;
  productionCountryCodeManufacturer: string;
  partNameManufacturer: string;
  partNumberManufacturer?: string;
  partNumberCustomer?: string;
  serialNumberManufacturer: string;
  serialNumberCustomer?: string;
  qualityStatus: string;
  status: string;
  productionDateGmt: string;
  childComponents?: AssetModel[];
  componentsSerialNumbers?: string[];
  icon?: string;
  parents?: AssetModel[];
  mspid: string;
  manufacturerLine?: string;
  manufacturerPlant?: string;
  serialNumberType: string;
  parentSerialNumberManufacturer?: string;
  qualityDocuments?: any;
  customFields?: CustomField;
}
