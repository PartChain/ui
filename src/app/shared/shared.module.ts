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
import { TableComponent } from './components/table/table.component';
import { RowDetailDirective } from './components/table/row.detail.directive';
import { ChildTableComponent } from './components/table/child-table/child-table.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { AssetsFilterComponent } from '../assets/presentation/assets-list/assets-filter/assets-filter.component';
import { NotificationContainerComponent } from './components/notifications/notification-container/notification-container.component';
import { NotificationMessageComponent } from './components/notifications/notification-message/notification-message.component';
import { TemplateModule } from './template.module';
import { SharedService } from './core/shared.service';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { HeaderComponent } from './components/header/header.component';
import { ButtonComponent } from './components/button/button.component';
import { MenuComponent } from './components/menu/menu.component';
import { TooltipDirective } from './directives/tooltip.directive';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { icons } from './shared-icons.module';
import { RoleDirective } from './directives/role.directive';
import { TabsModule } from './components/tabs/tabs.module';
import { DestroyService } from './core/destroy.service';
import { MenuItemComponent } from './components/menu/menu-item/menu-item.component';
import { ShortenPipe } from './pipes/shorten.pipe';
import { ViewContainerDirective } from './directives/view-container.directive';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { TreeComponent } from './components/tree/tree.component';
import { TreeService } from './components/tree/tree.service';
import { AssetFacade } from './abstraction/asset-facade';
import { AssetState } from './core/asset.state';
import { AssetService } from './core/asset.service';

/**
 *
 *
 * @export
 * @class SharedModule
 */
@NgModule({
  declarations: [
    ConfirmDialogComponent,
    AssetsFilterComponent,
    NotificationContainerComponent,
    NotificationMessageComponent,
    TableComponent,
    RowDetailDirective,
    ChildTableComponent,
    BreadcrumbsComponent,
    HeaderComponent,
    ButtonComponent,
    MenuComponent,
    MenuItemComponent,
    TreeComponent,
    TooltipDirective,
    RoleDirective,
    ShortenPipe,
    ViewContainerDirective,
    EmptyStateComponent,
  ],
  imports: [TemplateModule, TabsModule, SvgIconsModule.forChild(icons)],
  exports: [
    ConfirmDialogComponent,
    AssetsFilterComponent,
    NotificationContainerComponent,
    NotificationMessageComponent,
    TableComponent,
    RowDetailDirective,
    ChildTableComponent,
    BreadcrumbsComponent,
    HeaderComponent,
    ButtonComponent,
    MenuComponent,
    MenuItemComponent,
    TreeComponent,
    TooltipDirective,
    RoleDirective,
    TabsModule,
    ShortenPipe,
    ViewContainerDirective,
    EmptyStateComponent,
  ],
  providers: [SharedService, DestroyService, TreeService, AssetFacade, AssetState, AssetService],
  entryComponents: [ConfirmDialogComponent],
})
export class SharedModule {}
