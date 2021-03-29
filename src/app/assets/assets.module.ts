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
import { AssetsComponent } from './assets.component';
import { VehiclesComponent } from '../vehicles/vehicles.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AssetsRouting } from './assets-routing.module';
import { AssetDetailComponent } from './asset-detail/asset-detail.component';
import { AssetsListComponent } from './assets-list/assets-list.component';
import { AssetTimelineComponent } from './asset-detail/asset-timeline/asset-timeline.component';
import { TreeviewComponent } from './asset-detail/treeview/treeview.component';
import { AssetSearchComponent } from '../asset-search/asset-search.component';
import { CustomsReportModalComponent } from '../vehicles/customs-report-modal/customs-report-modal.component';
import { SkeletonTableComponent } from './assets-list/skeleton-table/skeleton-table.component';
import { PaginationComponent } from './assets-list/pagination/pagination.component';
import { TableSelectionComponent } from './assets-list/table-selection/table-selection.component';
import { AssetParentComponent } from './asset-detail/asset-parent/asset-parent.component';
import { TableEmptyStateComponent } from './assets-list/table-empty-state/table-empty-state.component';
import { TemplateModule } from '../shared/template.module';
import { SharedModule } from '../shared/shared.module';
import { AssetDetailSkeletonComponent } from './asset-detail/asset-detail-skeleton/asset-detail-skeleton.component';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { icons } from './../shared/shared-icons.module';
import { CoreModule } from '../core/core.module';

/**
 *
 *
 * @export
 * @class AssetsModule
 */
@NgModule({
  declarations: [
    AssetsComponent,
    VehiclesComponent,
    AssetsListComponent,
    AssetTimelineComponent,
    AssetDetailComponent,
    TreeviewComponent,
    AssetSearchComponent,
    CustomsReportModalComponent,
    SkeletonTableComponent,
    PaginationComponent,
    TableSelectionComponent,
    AssetParentComponent,
    TableEmptyStateComponent,
    AssetDetailSkeletonComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TemplateModule,
    RouterModule.forChild(AssetsRouting),
    SvgIconsModule.forChild(icons),
    CoreModule,
  ],
  exports: [],
  entryComponents: [AssetTimelineComponent, TreeviewComponent, CustomsReportModalComponent],
})
export class AssetsModule {}
