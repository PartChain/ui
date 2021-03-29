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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { PrivateLayoutComponent } from './layout/private-layout/private-layout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { KpisComponent } from './kpis/kpis.component';
import { realm } from './core/api/api.service.properties';
import { AuthGuard } from './core/user/auth/auth.guard';
import { AclComponent } from './acl/acl.component';
import { AssetSearchComponent } from './asset-search/asset-search.component';
import { RoleGuard } from './core/user/role.guard';

export /** @type {*} */
const routes: Routes = [
  {
    path: realm !== null ? realm[1] : '',
    component: PrivateLayoutComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Home' },
    children: [
      { path: '', pathMatch: 'full', component: KpisComponent },
      {
        path: 'dashboard',
        component: KpisComponent,
        data: { breadcrumb: 'Home' },
      },
      {
        path: 'about',
        component: AboutComponent,
        data: { breadcrumb: 'About' },
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
        canActivate: [RoleGuard],
        data: { role: ['admin', 'quality_manager'], breadcrumb: 'Transactions' },
      },
      {
        path: 'introduction',
        component: IntroductionComponent,
        data: { breadcrumb: 'Introduction' },
      },
      { path: 'kpis', component: KpisComponent, data: { breadcrumb: 'KPIs' } },
      {
        path: 'acl',
        component: AclComponent,
        canActivate: [RoleGuard],
        data: { role: ['admin'], breadcrumb: 'Access Control List' },
      },
      {
        path: 'components',
        loadChildren: './assets/assets.module#AssetsModule',
        data: { breadcrumb: 'Components' },
      },
      {
        path: 'find',
        pathMatch: 'full',
        component: AssetSearchComponent,
        data: { breadcrumb: 'Find Part' },
      },
    ],
  },
  {
    path: '**',
    component: PublicLayoutComponent,
    children: [{ path: '**', component: PageNotFoundComponent }],
  },
];

/**
 *
 *
 * @export
 * @class AppRoutingModule
 */
@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
