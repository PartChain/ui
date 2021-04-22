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
import { PrivateLayoutComponent } from './layout/presentation/private-layout/private-layout.component';
import { PageNotFoundComponent } from './page-not-found/presentation/page-not-found.component';
import { realm } from './core/api/api.service.properties';
import { AuthGuard } from './core/auth/auth.guard';

export /** @type {*} */
const routes: Routes = [
  {
    path: realm !== null ? realm[1] : '',
    component: PrivateLayoutComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Home' },
    loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule),
  },
  {
    path: '**',
    component: PageNotFoundComponent,
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
