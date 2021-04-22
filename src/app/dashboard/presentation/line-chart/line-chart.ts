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

import { Axis } from '../../model/assets-per-day.model';
import { Chart } from 'chart.js';

/**
 *
 *
 * @export
 * @class LineChart
 */
export class LineChart {
  /**
   * Chart renderer
   *
   * @static
   * @param {Axis[]} otherData
   * @param {Axis[]} ownData
   * @param {HTMLCanvasElement} canvas
   * @param {string[]} labels
   * @return {Chart}
   * @memberof LineChart
   */
  public static renderGraph(otherData: Axis[], ownData: Axis[], canvas: HTMLCanvasElement, labels: string[]): Chart {
    const ctx = canvas.getContext('2d');
    return new Chart(ctx, {
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
}
