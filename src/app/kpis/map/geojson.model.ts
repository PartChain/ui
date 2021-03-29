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

/**
 *
 *
 * @export
 * @interface AssetsPerPlant
 */
export interface AssetsPerPlant {
  coordinates: number[];
  assetsCount: number;
  countryCode: string;
  manufacturer: string;
}

/**
 *
 *
 * @export
 * @interface MapData
 */
export interface MapData {
  coordinates: number[];
  assetsCount: number[];
  countryCode: string;
  manufacturer: string[];
}

export /** @type {*} */
const MAPPING = {
  'marker-1': {
    x: 0,
    y: 0,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-2': {
    x: 220,
    y: 0,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-3': {
    x: 420,
    y: 0,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-4': {
    x: 620,
    y: 0,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-5': {
    x: 820,
    y: 0,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-6': {
    x: 1020,
    y: 0,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-7': {
    x: 1220,
    y: 0,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-8': {
    x: 1420,
    y: 0,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-9': {
    x: 0,
    y: 250,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-10': {
    x: 220,
    y: 250,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-20': {
    x: 420,
    y: 250,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-30': {
    x: 620,
    y: 250,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-40': {
    x: 820,
    y: 250,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-50': {
    x: 1020,
    y: 250,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-60': {
    x: 1220,
    y: 250,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-70': {
    x: 1420,
    y: 250,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-80': {
    x: 0,
    y: 500,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-90': {
    x: 220,
    y: 500,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-100': {
    x: 420,
    y: 500,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-200': {
    x: 620,
    y: 500,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-300': {
    x: 820,
    y: 500,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-400': {
    x: 1020,
    y: 500,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-500': {
    x: 1220,
    y: 500,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-600': {
    x: 1420,
    y: 500,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-700': {
    x: 0,
    y: 750,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-800': {
    x: 220,
    y: 750,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-900': {
    x: 420,
    y: 750,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-1000': {
    x: 620,
    y: 750,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-2000': {
    x: 820,
    y: 750,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-3000': {
    x: 1020,
    y: 750,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-4000': {
    x: 1220,
    y: 750,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-5000': {
    x: 1420,
    y: 750,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-6000': {
    x: 0,
    y: 1000,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-7000': {
    x: 220,
    y: 1000,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-8000': {
    x: 420,
    y: 1000,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-9000': {
    x: 620,
    y: 1000,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-10000': {
    x: 820,
    y: 1000,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-20000': {
    x: 1020,
    y: 1000,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-30000': {
    x: 1220,
    y: 1000,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-40000': {
    x: 1420,
    y: 1000,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-50000': {
    x: 0,
    y: 1250,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-60000': {
    x: 220,
    y: 1250,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-70000': {
    x: 420,
    y: 1250,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-80000': {
    x: 620,
    y: 1250,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-90000': {
    x: 820,
    y: 1250,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-100000': {
    x: 1020,
    y: 1250,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-200000': {
    x: 1220,
    y: 1250,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-300000': {
    x: 1420,
    y: 1250,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-400000': {
    x: 0,
    y: 1500,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-500000': {
    x: 220,
    y: 1500,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-600000': {
    x: 420,
    y: 1500,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-700000': {
    x: 620,
    y: 1500,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-800000': {
    x: 820,
    y: 1500,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-900000': {
    x: 1020,
    y: 1500,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  'marker-1000000': {
    x: 1220,
    y: 1500,
    width: 220,
    height: 250,
    anchorY: 250,
  },
  marker: {
    x: 1420,
    y: 1500,
    width: 220,
    height: 250,
    anchorY: 250,
  },
};
