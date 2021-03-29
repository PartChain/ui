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
import { KpisComponent } from './kpis.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { MapComponent } from './map/map.component';
import { KpisService } from './kpis.service';
import { TemplateModule } from '../shared/template.module';
import { CommonModule } from '@angular/common';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { SharedModule } from '../shared/shared.module';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { icons } from './../shared/shared-icons.module';
import { CoreModule } from '../core/core.module';

/**
 *
 *
 * @export
 * @class KpisModule
 */
@NgModule({
  declarations: [KpisComponent, MapComponent, BarChartComponent, LineChartComponent],
  imports: [
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1IjoiZmVsaXhnZXJiaWciLCJhIjoiY2sxNmh4d2dvMTJkdTNpcGZtcWhvaHpuNyJ9.2hJW4R6PoiqIgytqUn1kbg',
    }),
    CommonModule,
    TemplateModule,
    SharedModule,
    SvgIconsModule.forChild(icons),
    CoreModule,
  ],
  providers: [KpisService],
})
export class KpisModule {}
