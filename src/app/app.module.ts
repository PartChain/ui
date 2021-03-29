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

import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { PrivateLayoutComponent } from './layout/private-layout/private-layout.component';
import { keycloakInit } from './utils/keycloak-init';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { TemplateModule } from './shared/template.module';
import { AboutComponent } from './about/about.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { AssetsModule } from './assets/assets.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { TransactionsModule } from './transactions/transactions.module';
import { KpisModule } from './kpis/kpis.module';
import { AclModule } from './acl/acl.module';
import { NavBarComponent } from './layout/nav-bar/nav-bar.component';
import { ResizerComponent } from './layout/resizer/resizer.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { icons } from './shared/shared-icons.module';

/**
 *
 *
 * @export
 * @class AppModule
 */
@NgModule({
  declarations: [
    AppComponent,
    PublicLayoutComponent,
    PrivateLayoutComponent,
    AboutComponent,
    IntroductionComponent,
    PageNotFoundComponent,
    NavBarComponent,
    ResizerComponent,
    SidebarComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    KeycloakAngularModule,
    SvgIconsModule.forRoot({
      defaultSize: 'sm',
      sizes: {
        xs: '18px',
        sm: '24px',
        md: '36px',
        lg: '48px',
        xl: '64px',
        xxl: '128px',
      },
    }),
    SvgIconsModule.forChild(icons),
    AclModule,
    TransactionsModule,
    KpisModule,
    AssetsModule,
    SharedModule,
    TemplateModule,
    CoreModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: keycloakInit,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'en-GB',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
