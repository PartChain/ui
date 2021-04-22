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

import { RouterModule, Routes } from '@angular/router';
import { AssetsComponent } from './presentation/assets.component';
import { AssetDetailComponent } from './presentation/asset-detail/asset-detail.component';
import { NgModule } from '@angular/core';
import { OwnAssetsComponent } from './presentation/own-assets/own-assets.component';

export /** @type {*} */
const assetsRouting: Routes = [
  { path: '', pathMatch: 'full', component: AssetsComponent, data: { breadcrumb: '' } },
  {
    path: 'own-assets',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: OwnAssetsComponent,
        data: { breadcrumb: 'Own Assets' },
      },
    ],
  },
  {
    path: 'detail/:serial',
    component: AssetDetailComponent,
    runGuardsAndResolvers: 'always',
    data: { breadcrumb: '' },
  },
];

/**
 *
 *
 * @export
 * @class AssetsRoutingModule
 */
@NgModule({
  imports: [RouterModule.forChild(assetsRouting)],
  exports: [RouterModule],
})
export class AssetsRoutingModule {}
