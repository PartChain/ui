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
import { TableComponent } from './table/table.component';
import { RowDetailDirective } from './table/row.detail.directive';
import { ChildTableComponent } from './table/child-table/child-table.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { AssetsFilterComponent } from './assets-filter/assets-filter.component';
import { NotificationContainerComponent } from './notifications/notification-container/notification-container.component';
import { NotificationMessageComponent } from './notifications/notification-message/notification-message.component';
import { TemplateModule } from './template.module';
import { SpinnerOverlayComponent } from './spinner-overlay/spinner-overlay.component';
import { SharedService } from './shared.service';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { HeaderComponent } from './header/header.component';
import { ButtonComponent } from './button/button.component';
import { MenuButtonComponent } from './menu-button/menu-button.component';
import { TooltipDirective } from './tooltip.directive';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { icons } from './shared-icons.module';
import { IntroductionWizardComponent } from '../introduction/introduction-wizard/introduction-wizard.component';

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
    SpinnerOverlayComponent,
    BreadcrumbsComponent,
    HeaderComponent,
    ButtonComponent,
    MenuButtonComponent,
    TooltipDirective,
    IntroductionWizardComponent,
  ],
  imports: [TemplateModule, SvgIconsModule.forChild(icons)],
  exports: [
    ConfirmDialogComponent,
    AssetsFilterComponent,
    NotificationContainerComponent,
    NotificationMessageComponent,
    TableComponent,
    RowDetailDirective,
    ChildTableComponent,
    SpinnerOverlayComponent,
    BreadcrumbsComponent,
    HeaderComponent,
    ButtonComponent,
    MenuButtonComponent,
    TooltipDirective,
    IntroductionWizardComponent,
  ],
  providers: [SharedService],
  entryComponents: [AssetsFilterComponent, ConfirmDialogComponent, SpinnerOverlayComponent],
})
export class SharedModule {}
