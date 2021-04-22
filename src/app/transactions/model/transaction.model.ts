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

import { Changelog } from 'src/app/shared/model/changelog.model';

/**
 *
 *
 * @export
 * @interface Transaction
 */
export interface Transaction {
  transactionId: string;
  assetId: string;
  timestampCreated: string;
  timestampChanged?: string;
  status: string;
  userId: string;
  serialNumberCustomer?: string;
  propertyName: string;
  propertyOldValue: string;
  propertyNewValue: string;
  description: string;
  action: string;
  changelog: Changelog[];
  icon?: string;
  timestamp?: string;
  groupingKey: string;
}

/**
 *
 *
 * @export
 * @interface TransactionResponse
 */
export interface TransactionResponse {
  data: Transaction[];
  status: number;
}
