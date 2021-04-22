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

import { flatten, groupBy, values } from 'lodash-es';
import { AssetsPerDay, AssetsPerDayGraph, Axis } from '../model/assets-per-day.model';
import { AssetsPerPlant, MapChart } from '../model/assets-per-plant.model';
import { QualityStatusGraph, QualityStatusRatio } from '../model/quality-status-ratio.model';

/**
 *
 *
 * @export
 * @class DashboardAssembler
 */
export class DashboardAssembler {
  /**
   * Assets per day chart data assembler
   *
   * @static
   * @param {AssetsPerDay} assets
   * @return {AssetsPerDayGraph}
   * @memberof DashboardAssembler
   */
  public static assembleAssetsPerDay(assets: AssetsPerDay): AssetsPerDayGraph {
    const { ownAssets, otherAssets } = assets;
    const ownData: Axis[] = this.getLineChartData(ownAssets);
    const otherData: Axis[] = this.getLineChartData(otherAssets);
    const labels: string[] = Object.keys(ownAssets);
    return {
      ownAssets: { data: ownData, labels },
      otherAssets: { data: otherData, labels },
    };
  }

  /**
   * Quality status ration chart data assembler
   *
   * @static
   * @param {QualityStatusRatio} qualityStatus
   * @return {QualityStatusGraph}
   * @memberof DashboardAssembler
   */
  public static assembleQualityStatusGraph(qualityStatus: QualityStatusRatio): QualityStatusGraph {
    const labels: string[] = this.getLabels(qualityStatus);
    const status: QualityStatusRatio[] = Object.values(qualityStatus);
    const nokValues: number[] = status.map(value => value.NOK);
    return {
      data: nokValues,
      labels,
    };
  }

  /**
   * Helper method to join countries that shared the same coordinates
   *
   * @static
   * @param {AssetsPerPlant[]} assetsPerCountry
   * @return {MapChart[]}
   * @memberof DashboardAssembler
   */
  public static assembleMap(assetsPerCountry: AssetsPerPlant[]): MapChart[] {
    // Grouping manufacturers per coordinates
    const groupedByCoordinates: Record<string, AssetsPerPlant[]> = groupBy(assetsPerCountry, 'coordinates');
    // Extracting manufacturers on the same country
    const multipleManufacturersPerCountry: AssetsPerPlant[] = flatten(
      values(groupedByCoordinates).filter(value => value.length > 1),
    );
    // Extracting manufacturers from different countries
    const singleManufacturersPerCountry: AssetsPerPlant[] = flatten(
      values(groupedByCoordinates).filter(value => value.length === 1),
    );

    // Pushing values with a map data type
    const mapDataArray: MapChart[] = [];
    const arrayOfSingles: MapChart[] = this.transformSingleManufacturersPerCountry(singleManufacturersPerCountry);
    mapDataArray.push(...arrayOfSingles);
    const arrayOfMultiples: MapChart[] = this.transformMultipleManufacturersPerCountry(multipleManufacturersPerCountry);
    mapDataArray.unshift(...arrayOfMultiples);
    return mapDataArray;
  }

  /**
   * Helper method to create the assets per day chart data
   *
   * @private
   * @static
   * @param {Axis} typeOfData
   * @return {Axis[]}
   * @memberof DashboardAssembler
   */
  private static getLineChartData(typeOfData: Axis): Axis[] {
    const transformedData: Axis[] = [];
    for (const value in typeOfData) {
      transformedData.push({
        x: new Date(value),
        y: typeOfData[value],
      });
    }
    return transformedData;
  }

  /**
   * Helper method to get the labels for the nok chart
   *
   * @private
   * @static
   * @param {QualityStatusRatio} qualityStatus
   * @return {string[]}
   * @memberof DashboardAssembler
   */
  private static getLabels(qualityStatus: QualityStatusRatio): string[] {
    const barChartLabels = [];
    for (let data in qualityStatus) {
      if (data.includes('Automotive')) {
        data = data.replace(/Automotive Lighting/i, 'AL');
        data = data.substring(data.indexOf('S'), -1);
      }
      barChartLabels.push(data);
    }
    return barChartLabels;
  }

  /**
   * Transform data blueprint for manufacturers on the same country
   *
   * @private
   * @static
   * @param {AssetsPerPlant[]} assetsPerPlant
   * @return {MapChart[]}
   * @memberof DashboardAssembler
   */
  private static transformMultipleManufacturersPerCountry(assetsPerPlant: AssetsPerPlant[]): MapChart[] {
    const transformedArray: MapChart[] = [];
    if (assetsPerPlant.length > 0) {
      const groupByCountry: Record<string, AssetsPerPlant[]> = groupBy(assetsPerPlant, 'countryCode');
      values(groupByCountry).forEach((plant: AssetsPerPlant[]) => {
        const mapData: MapChart = {
          coordinates: plant[0].coordinates,
          countryCode: plant[0].countryCode,
          manufacturer: plant.map(prop => prop.manufacturer),
          assetsCount: plant.map(prop => prop.assetsCount),
        };
        transformedArray.push(mapData);
      });
    }
    return transformedArray;
  }

  /**
   * Transform data blueprint for manufacturers on different country
   *
   * @private
   * @static
   * @param {AssetsPerPlant[]} assetsPerPlant
   * @return {MapChart[]}
   * @memberof DashboardAssembler
   */
  private static transformSingleManufacturersPerCountry(assetsPerPlant: AssetsPerPlant[]): MapChart[] {
    const transformedArray: MapChart[] = [];
    assetsPerPlant.forEach((plant: AssetsPerPlant) => {
      const onePerCountry: MapChart = {
        coordinates: plant.coordinates,
        countryCode: plant.countryCode,
        manufacturer: [plant.manufacturer],
        assetsCount: [plant.assetsCount],
      };
      transformedArray.push(onePerCountry);
    });
    return transformedArray;
  }
}
