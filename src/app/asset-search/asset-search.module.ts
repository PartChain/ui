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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { icons } from '../shared/shared-icons.module';
import { SharedModule } from '../shared/shared.module';
import { TemplateModule } from '../shared/template.module';
import { AssetSearchRoutingModule } from './asset-search.routing';
import { AssetSearchSkeletonComponent } from './presentation/asset-search-skeleton/asset-search-skeleton.component';
import { AssetSearchComponent } from './presentation/asset-search.component';

/**
 *
 *
 * @export
 * @class AssetSearchModule
 */
@NgModule({
  declarations: [AssetSearchComponent, AssetSearchSkeletonComponent],
  imports: [CommonModule, SharedModule, TemplateModule, SvgIconsModule.forChild(icons), AssetSearchRoutingModule],
})
export class AssetSearchModule {}
