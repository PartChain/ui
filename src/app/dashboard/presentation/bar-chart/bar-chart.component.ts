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

import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';
import { QualityStatusGraph } from '../../model/quality-status-ratio.model';
import { BarChart } from './bar-chart';

/**
 *
 *
 * @export
 * @class BarChartComponent
 * @implements {OnChanges}
 */
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent implements OnChanges {
  /**
   * Chart data
   *
   * @type {QualityStatusGraph}
   * @memberof BarChartComponent
   */
  @Input() barChartData: QualityStatusGraph;

  /**
   * Chart element
   *
   * @private
   * @type {Chart}
   * @memberof BarChartComponent
   */
  private barChart: Chart;

  /**
   * Angular lifecycle method - On Changes
   *
   * @param {SimpleChanges} changes
   * @return {void}
   * @memberof BarChartComponent
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.barChartData) {
      if (this.barChart) {
        this.barChart.destroy();
      }
      this.barChart = this.renderBarChart();
    }
  }

  /**
   * Render the char on the canvas
   *
   * @private
   * @return {Chart}
   * @memberof BarChartComponent
   */
  private renderBarChart(): Chart {
    const { data, labels } = this.barChartData;
    const canvas = document.getElementById('barChart') as HTMLCanvasElement;
    return BarChart.renderGraph(data, labels, canvas);
  }
}
