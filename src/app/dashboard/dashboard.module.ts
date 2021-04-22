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
import { DashboardComponent } from './presentation/dashboard.component';
import { BarChartComponent } from './presentation/bar-chart/bar-chart.component';
import { LineChartComponent } from './presentation/line-chart/line-chart.component';
import { MapComponent } from './presentation/map/map.component';
import { DashboardService } from './core/dashboard.service';
import { TemplateModule } from '../shared/template.module';
import { CommonModule } from '@angular/common';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { SharedModule } from '../shared/shared.module';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { icons } from './../shared/shared-icons.module';
import { EventsComponent } from './presentation/events/events.component';
import { DashboardFacade } from './abstraction/dashboard.facade';
import { DashboardState } from './core/dashboard.state';
import { DashboardRoutingModule } from './dashboard.routing';
import { IntroductionModule } from '../introduction/introduction.module';

/**
 *
 *
 * @export
 * @class DashboardModule
 */
@NgModule({
  declarations: [DashboardComponent, MapComponent, BarChartComponent, LineChartComponent, EventsComponent],
  imports: [
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1IjoiZmVsaXhnZXJiaWciLCJhIjoiY2sxNmh4d2dvMTJkdTNpcGZtcWhvaHpuNyJ9.2hJW4R6PoiqIgytqUn1kbg',
    }),
    CommonModule,
    TemplateModule,
    SharedModule,
    SvgIconsModule.forChild(icons),
    DashboardRoutingModule,
    IntroductionModule,
  ],
  providers: [DashboardService, DashboardFacade, DashboardState],
})
export class DashboardModule {}
