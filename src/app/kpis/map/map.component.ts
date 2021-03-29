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
import { environment } from 'src/environments/environment';
import * as mapbox from 'mapbox-gl';
import { Map } from './../../../../node_modules/mapbox-gl';
import { NavigationControl } from 'mapbox-gl';
(mapbox as any).accessToken = environment.mapBoxAccessToken;
import { MapboxLayer } from '@deck.gl/mapbox';
import { IconLayer } from '@deck.gl/layers';
import { Observable, of } from 'rxjs';
import { AssetsPerPlant, MAPPING, MapData } from './geojson.model';
import { groupBy, flatten, values } from 'lodash-es';

/**
 *
 *
 * @export
 * @class MapComponent
 * @implements {OnChanges}
 */
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnChanges {
  /**
   * Map data
   *
   * @type {AssetsPerPlant[]}
   * @memberof MapComponent
   */
  @Input() mapData: AssetsPerPlant[];

  /**
   * Hovered plant
   *
   * @type {AssetsPerPlant}
   * @memberof MapComponent
   */
  public assetsPerPlant = {} as AssetsPerPlant;

  /**
   * X offset
   *
   * @type {number}
   * @memberof MapComponent
   */
  public offsetX = 0;

  /**
   * Y offset
   *
   * @type {number}
   * @memberof MapComponent
   */
  public offsetY = 0;

  /**
   * Map chart
   *
   * @private
   * @type {Map}
   * @memberof MapComponent
   */
  private map: Map;

  /**
   *Angular lifecycle method - On Changes
   *
   * @param {SimpleChanges} changes
   * @return {void}
   * @memberof MapComponent
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mapData) {
      if (this.map) {
        this.map.destroy();
      }
      const data: MapData[] = this.getMapData(changes.mapData.currentValue);
      this.renderMap(data);
    }
  }

  /**
   * Map renderer
   *
   * @param {MapData[]} data
   * @return {void}
   * @memberof MapComponent
   */
  public renderMap(data: MapData[]): void {
    this.map = new Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10?optimize=true',
      center: { lng: 12.4632953, lat: 47.6482795 },
      zoom: 3,
      maxZoom: 13,
      minZoom: 1,
      pitch: 20,
      attributionControl: false,
    });

    this.map.addControl(
      new NavigationControl({
        showZoom: true,
        showCompass: true,
        visualizePitch: true,
      }),
      'top-right',
    );

    this.map.on('load', () => {
      this.map.resize();
      this.setLayers(this.map, data);
    });
  }

  /**
   * Layer renderer
   *
   * @param {Map} map
   * @param {*} data
   * @return {Observable<any>}
   * @memberof MapComponent
   */
  public setLayers(map: Map, data: any): Observable<any> {
    const layer = map.getLayer('iconLayer');

    if (layer) {
      map.removeLayer('iconLayer');
    }

    const layerProps = {
      data,
      pickable: true,
      iconAtlas: '../assets/images/location-icon.png',
      iconMapping: MAPPING,
      getPosition: d => [+d.coordinates[1], +d.coordinates[0]],
      onHover: ({ object, x, y }) => {
        if (object) {
          this.offsetX = x;
          this.offsetY = y;
          this.assetsPerPlant.coordinates = object.coordinates;
          this.assetsPerPlant.manufacturer = object.manufacturer;
          this.assetsPerPlant.countryCode = object.countryCode;
          this.assetsPerPlant.assetsCount = object.assetsCount;
        } else {
          this.offsetX = null;
        }
      },
    };

    const iconLayer = new MapboxLayer({
      id: 'icon-layer',
      type: IconLayer,
      ...layerProps,
      getIcon: d => this.getIconName(this.reducedArray(d.assetsCount)),
      sizeScale: 20,
      getSize: 5,
    });

    // Change map layer here
    map.addLayer(iconLayer);
    return of(map);
  }

  /**
   * Map resizer
   *
   * @return {void}
   * @memberof MapComponent
   */
  public resize(): void {
    if (this.map) {
      this.map.resize();
    }
  }

  /**
   * Asset count label
   *
   * @param {number} assetsCount
   * @return {string}
   * @memberof MapComponent
   */
  public assetTooltipLabel(assetsCount: number): string {
    return assetsCount === 1 ? `${assetsCount} part` : `${assetsCount} parts`;
  }

  /**
   * Gets marker depending on the asset count
   *
   * @private
   * @param {number} size
   * @return {string}
   * @memberof MapComponent
   */
  private getIconName(size: number): string {
    const digits = this.getDigits(size) - 1;
    const zeros = Array(digits)
      .fill(0)
      .join('');
    const denominator = +`1${zeros}`;
    const marker = `marker-${Math.floor(size / denominator)}${zeros}`;
    return marker;
  }

  /**
   * Gets digits of a number
   *
   * @private
   * @param {number} size
   * @return {number}
   * @memberof MapComponent
   */
  private getDigits(size: number): number {
    // tslint:disable-next-line: no-bitwise
    return (Math.log(size) * Math.LOG10E + 1) | 0;
  }

  /**
   * Grouped manufacturers on the same country
   *
   * @private
   * @param {AssetsPerPlant[]} data
   * @return {MapData[]}
   * @memberof MapComponent
   */
  private getMapData(data: AssetsPerPlant[]): MapData[] {
    // Grouping manufacturers per coordinates
    const groupedByCoordinates = groupBy(data, 'coordinates');
    // Extracting manufacturers on the same country
    const multipleManufacturersPerCountry: AssetsPerPlant[] = flatten(
      values(groupedByCoordinates).filter(value => value.length > 1),
    );
    // Extracting manufacturers from different countries
    const singleManufacturersPerCountry: AssetsPerPlant[] = flatten(
      values(groupedByCoordinates).filter(value => value.length === 1),
    );

    // Pushing values with a map data type
    const mapDataArray: MapData[] = [];
    const arrayOfSingles = this.transformSingleManufacturersPerCountry(singleManufacturersPerCountry);
    mapDataArray.push(...arrayOfSingles);
    const arrayOfMultiples = this.transformMultipleManufacturersPerCountry(multipleManufacturersPerCountry);
    mapDataArray.unshift(...arrayOfMultiples);
    return mapDataArray;
  }

  /**
   * Transform data blueprint for manufacturers on the same country
   *
   * @private
   * @param {AssetsPerPlant[]} assetsPerPlant
   * @return {MapData[]}
   * @memberof MapComponent
   */
  private transformMultipleManufacturersPerCountry(assetsPerPlant: AssetsPerPlant[]): MapData[] {
    const transformedArray: MapData[] = [];
    if (assetsPerPlant.length > 0) {
      const groupByCountry = groupBy(assetsPerPlant, 'countryCode');
      values(groupByCountry).forEach((plant: AssetsPerPlant[]) => {
        const mapData: MapData = {
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
   * Transform data blueprint for manufacturers on different countries
   *
   * @private
   * @param {AssetsPerPlant[]} assetsPerPlant
   * @return {MapData[]}
   * @memberof MapComponent
   */
  private transformSingleManufacturersPerCountry(assetsPerPlant: AssetsPerPlant[]): MapData[] {
    const transformedArray: MapData[] = [];
    assetsPerPlant.forEach((plant: AssetsPerPlant) => {
      const onePerCountry: MapData = {
        coordinates: plant.coordinates,
        countryCode: plant.countryCode,
        manufacturer: [plant.manufacturer],
        assetsCount: [plant.assetsCount],
      };
      transformedArray.push(onePerCountry);
    });
    return transformedArray;
  }

  /**
   * Sums the icon observable values
   *
   * @private
   * @param {number[]} arr
   * @return {number}
   * @memberof MapComponent
   */
  private reducedArray(arr: number[]): number {
    return arr.length > 0 ? arr.reduce((acc, value) => acc + value) : 0;
  }
}
