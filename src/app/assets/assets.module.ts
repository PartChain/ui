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
import { AssetsComponent } from './presentation/assets.component';
import { OwnAssetsComponent } from './presentation/own-assets/own-assets.component';
import { CommonModule } from '@angular/common';
import { AssetsRoutingModule } from './assets.routing';
import { AssetDetailComponent } from './presentation/asset-detail/asset-detail.component';
import { AssetsListComponent } from './presentation/assets-list/assets-list.component';
import { AssetTimelineComponent } from './presentation/asset-detail/asset-timeline/asset-timeline.component';
import { SkeletonTableComponent } from './presentation/assets-list/skeleton-table/skeleton-table.component';
import { PaginationComponent } from './presentation/assets-list/pagination/pagination.component';
import { TableSelectionComponent } from './presentation/assets-list/table-selection/table-selection.component';
import { AssetParentComponent } from './presentation/asset-detail/asset-parent/asset-parent.component';
import { TableEmptyStateComponent } from './presentation/assets-list/table-empty-state/table-empty-state.component';
import { TemplateModule } from '../shared/template.module';
import { SharedModule } from '../shared/shared.module';
import { AssetDetailSkeletonComponent } from './presentation/asset-detail/asset-detail-skeleton/asset-detail-skeleton.component';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { icons } from './../shared/shared-icons.module';
import { AssetsListFacade } from './abstraction/assets-list.facade';
import { AssetsListState } from './core/assets-list.state';

/**
 *
 *
 * @export
 * @class AssetsModule
 */
@NgModule({
  declarations: [
    AssetsComponent,
    OwnAssetsComponent,
    AssetsListComponent,
    AssetDetailComponent,
    AssetTimelineComponent,
    SkeletonTableComponent,
    PaginationComponent,
    TableSelectionComponent,
    AssetParentComponent,
    TableEmptyStateComponent,
    AssetDetailSkeletonComponent,
  ],
  imports: [CommonModule, SharedModule, TemplateModule, AssetsRoutingModule, SvgIconsModule.forChild(icons)],
  exports: [],
  providers: [AssetsListFacade, AssetsListState],
})
export class AssetsModule {}
