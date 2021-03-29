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
import { QualityStatusRatio } from '../kpis.model';

/**
 *
 *
 * @export
 * @class BarChartComponent
 * @implements {OnChanges}
 */
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html'
})
export class BarChartComponent implements OnChanges {
  /**
   * NOK data
   *
   * @type {QualityStatusRatio}
   * @memberof BarChartComponent
   */
  @Input() barChartData: QualityStatusRatio;

  /**
   * Bar chart
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
      this.prepareData();
    }
  }

  /**
   * Bar chart renderer
   *
   * @param {*} chartData
   * @param {HTMLCanvasElement} canvas
   * @param {*} labels
   * @return {void}
   * @memberof BarChartComponent
   */
  public renderBarChart(chartData: any, canvas: HTMLCanvasElement, labels: any): void {
    const ctx = canvas.getContext('2d');
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        datasets: [
          {
            label: 'NOK',
            data: chartData,
            backgroundColor: 'rgba(231, 76, 60, 1)',
            type: 'bar',
          },
        ],
        labels,
      },
      options: {
        responsive: true,
        legend: {
          display: false,
        },
        xAxes: [
          {
            barThickness: 1,
          },
        ],
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                userCallback(label) {
                  // when the floored value is the same as the value we have a whole number
                  if (Math.floor(label) === label) {
                    return label;
                  }
                },
              },
              gridLines: {
                display: false,
              },
            },
          ],
        },
      },
    });
  }

  /**
   * Gets chart data
   *
   * @private
   * @return {void}
   * @memberof BarChartComponent
   */
  private prepareData(): void {
    const labels = this.getLabels();
    const status: QualityStatusRatio[] = Object.values(this.barChartData);
    const barChartNOKValues = status.map(value => value.NOK);
    const canvas = document.getElementById('barChart') as HTMLCanvasElement;
    this.renderBarChart(barChartNOKValues, canvas, labels);
  }

  /**
   * Gets chart labels
   *
   * @private
   * @return {string[]}
   * @memberof BarChartComponent
   */
  private getLabels(): string[] {
    const barChartLabels = [];
    for (let data in this.barChartData) {
      if (data.includes('Automotive')) {
        data = data.replace(/Automotive Lighting/i, 'AL');
        data = data.substring(data.indexOf('S'), -1);
      }
      barChartLabels.push(data);
    }
    return barChartLabels;
  }
}
