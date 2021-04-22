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

import { Chart } from 'chart.js';

/**
 *
 *
 * @export
 * @class BarChart
 */
export class BarChart {
  /**
   * Chart renderer
   *
   * @static
   * @param {number[]} data
   * @param {string[]} labels
   * @param {HTMLCanvasElement} canvas
   * @return {Chart}
   * @memberof BarChart
   */
  public static renderGraph(data: number[], labels: string[], canvas: HTMLCanvasElement): Chart {
    const ctx = canvas.getContext('2d');
    return new Chart(ctx, {
      type: 'bar',
      data: {
        datasets: [
          {
            label: 'NOK',
            data,
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
}
