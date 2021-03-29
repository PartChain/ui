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

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';
import { AssetsPerDayModel, Axis } from '../kpis.model';

/**
 *
 *
 * @export
 * @class LineChartComponent
 * @implements {OnChanges}
 */
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html'
})
export class LineChartComponent implements OnChanges {
  /**
   * Assets per day
   *
   * @type {AssetsPerDayModel}
   * @memberof LineChartComponent
   */
  @Input() lineChartData: AssetsPerDayModel;

  /**
   * Line chart
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
      this.renderAssetOverTimeChart();
    }
  }

  /**
   * Assets per day renderer
   *
   * @private
   * @return {void}
   * @memberof LineChartComponent
   */
  private renderAssetOverTimeChart(): void {
    const ownAssets = this.lineChartData.ownAssets;
    const otherAssets = this.lineChartData.otherAssets;
    const ownData = this.getLineChartData(ownAssets);
    const otherData = this.getLineChartData(otherAssets);
    const labels = Object.keys(ownAssets);
    const canvas = document.getElementById('lineChart') as HTMLCanvasElement;
    this.renderTimeChart(otherData, ownData, canvas, labels);
  }

  /**
   * Line chart renderer
   *
   * @private
   * @param {*} otherData
   * @param {*} ownData
   * @param {HTMLCanvasElement} canvas
   * @param {*} labels
   * @memberof LineChartComponent
   */
  private renderTimeChart(otherData: any, ownData: any, canvas: HTMLCanvasElement, labels: any): void {
    const ctx = canvas.getContext('2d');
    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            data: ownData,
            label: 'Owned Parts',
            borderColor: 'rgba(54, 162, 235, 0.5)',
            fill: false,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            pointRadius: 0,
          },
          {
            data: otherData,
            label: 'Other Parts',
            borderColor: 'rgba(132, 186, 91, 0.5)',
            fill: false,
            backgroundColor: 'rgba(132, 186, 91, 0.5)',
            pointRadius: 0,
          },
        ],
      },
      options: {
        scales: {
          xAxes: {
            type: 'time',
            distribution: 'linear',
            gridLines: {
              display: false,
            },
          },
          yAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                beginAtZero: true,
                userCallback: (label: number) => {
                  if (Math.floor(label) === label) {
                    return label;
                  }
                },
              },
            },
          ],
        },
      },
    });
  }

  /**
   * Gets axis values from assets per day
   *
   * @private
   * @param {*} typeOfData
   * @return {any[]}
   * @memberof LineChartComponent
   */
  private getLineChartData(typeOfData: any): any[] {
    const transformedData: Axis[] = [];
    for (const value in typeOfData) {
      transformedData.push({
        x: new Date(value),
        y: typeOfData[value],
      });
    }
    return transformedData;
  }
}
