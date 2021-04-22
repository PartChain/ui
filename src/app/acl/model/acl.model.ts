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
 * @interface Acl
 */
export interface Acl {
  entities: string[];
  comment?: string;
  status: string;
  timestamp: string;
  changedBy: string;
  targetOrg: string;
  owner: string;
  history: Acl[];
}

/**
 *
 *
 * @export
 * @interface AclList
 */
export interface AclList {
  ACL: Acl;
  owner: string;
}

/**
 *
 *
 * @export
 * @interface HistoryAcl
 */
export interface HistoryAcl {
  targetOrg: string;
  history: Acl[];
}

/**
 *
 *
 * @export
 * @interface ACLResponse
 */
export interface ACLResponse {
  status: number;
  resultLength?: number;
  data: AclList;
}
