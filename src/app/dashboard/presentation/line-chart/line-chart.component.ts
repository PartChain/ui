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
import { AssetsPerDayGraph } from '../../model/assets-per-day.model';
import { LineChart } from './line-chart';

/**
 *
 *
 * @export
 * @class LineChartComponent
 * @implements {OnChanges}
 */
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent implements OnChanges {
  /**
   * Line chart data
   *
   * @type {AssetsPerDayGraph}
   * @memberof LineChartComponent
   */
  @Input() lineChartData: AssetsPerDayGraph;

  /**
   * Chart element
   *
   * @private
   * @type {Chart}
   * @memberof LineChartComponent
   */
  private lineChart: Chart;

  /**
   * Angular lifecycle method - On Changes
   *
   * @param {SimpleChanges} changes
   * @return {void}
   * @memberof LineChartComponent
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.lineChartData) {
      if (this.lineChart) {
        this.lineChart.destroy();
      }
      this.lineChart = this.renderAssetOverTimeChart();
    }
  }

  /**
   * Render the char on the canvas
   *
   * @private
   * @return {Chart}
   * @memberof LineChartComponent
   */
  private renderAssetOverTimeChart(): Chart {
    const { ownAssets, otherAssets } = this.lineChartData;
    const canvas = document.getElementById('lineChart') as HTMLCanvasElement;
    return LineChart.renderGraph(otherAssets.data, ownAssets.data, canvas, ownAssets.labels);
  }
}
