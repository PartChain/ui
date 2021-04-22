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
import { TransactionsComponent } from './presentation/transactions.component';
import { TransactionsService } from './core/transactions.service';
import { CommonModule } from '@angular/common';
import { TemplateModule } from '../shared/template.module';
import { SharedModule } from '../shared/shared.module';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { icons } from './../shared/shared-icons.module';
import { TransactionsFacade } from './abstraction/transactions.facade';
import { TransactionsState } from './core/transactions.state';
import { TransactionsListComponent } from './presentation/transactions-list/transactions-list.component';
import { TransactionsRoutingModule } from './transactions.routing';

/**
 *
 *
 * @export
 * @class TransactionsModule
 */
@NgModule({
  declarations: [TransactionsComponent, TransactionsListComponent],
  imports: [CommonModule, TemplateModule, SharedModule, SvgIconsModule.forChild(icons), TransactionsRoutingModule],
  providers: [TransactionsService, TransactionsFacade, TransactionsState],
})
export class TransactionsModule {}
