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
import { SharedModule } from '../shared/shared.module';
import { TemplateModule } from '../shared/template.module';
import { AclListComponent } from './presentation/acl-list/acl-list.component';
import { AclComponent } from './presentation/acl.component';
import { AclService } from './core/acl.service';
import { AclDetailComponent } from './presentation/acl-list/acl-detail/acl-detail.component';
import { AclHistoryComponent } from './presentation/acl-history/acl-history.component';
import { RequestModalComponent } from './presentation/request-modal/request-modal.component';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { icons } from './../shared/shared-icons.module';
import { AclFacade } from './abstraction/acl.facade';
import { AclState } from './core/acl.state';
import { AclTabsComponent } from './presentation/acl-tabs/acl-tabs.component';
import { AclRoutingModule } from './acl.routing';
import { AclEmptyStateComponent } from './presentation/acl-empty-state/acl-empty-state.component';
import { AclSkeletonComponent } from './presentation/acl-skeleton/acl-skeleton.component';

/**
 *
 *
 * @export
 * @class AclModule
 */
@NgModule({
  declarations: [
    AclComponent,
    AclListComponent,
    AclDetailComponent,
    AclHistoryComponent,
    RequestModalComponent,
    AclTabsComponent,
    AclEmptyStateComponent,
    AclSkeletonComponent,
  ],
  imports: [CommonModule, TemplateModule, SharedModule, SvgIconsModule.forChild(icons), AclRoutingModule],
  providers: [AclState, AclFacade, AclService],
})
export class AclModule {}
