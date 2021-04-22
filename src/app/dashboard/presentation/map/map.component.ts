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
import { Map, NavigationControl } from 'mapbox-gl';
import { MapboxLayer } from '@deck.gl/mapbox';
import { IconLayer } from '@deck.gl/layers';
import { Observable, of } from 'rxjs';
import { AssetsPerPlant, MapChart, MAPPING } from '../../model/assets-per-plant.model';

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
   * @type {MapChart[]}
   * @memberof MapComponent
   */
  @Input() mapData: MapChart[];

  /**
   * Assets per plant hover object
   *
   * @type {AssetsPerPlant}
   * @memberof MapComponent
   */
  public assetsPerPlant: AssetsPerPlant = {} as AssetsPerPlant;

  /**
   * X axis
   * @type {number}
   * @memberof MapComponent
   */
  public offsetX = 0;

  /**
   * Y axis
   * @type {number}
   * @memberof MapComponent
   */
  public offsetY = 0;

  /**
   * Mapbox element
   *
   * @private
   * @type {Map}
   * @memberof MapComponent
   */
  private map: Map;

  /**
   * Angular lifecycle method - On Changes
   *
   * @param {SimpleChanges} changes
   * @return {void}
   * @memberof MapComponent
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mapData) {
      Object.getOwnPropertyDescriptor(mapbox, 'accessToken').set(environment.mapBoxAccessToken);
      if (this.map) {
        this.map.remove();
      }
      const data: MapChart[] = this.mapData;
      this.renderMap(data);
    }
  }

  /**
   * Map renderer
   *
   * @param {MapChart[]} data
   * @return {void}
   * @memberof MapComponent
   */
  public renderMap(data: MapChart[]): void {
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
   * Map layers setter
   *
   * @param {Map} map
   * @param {MapChart[]} data
   * @return {Observable<Map>}
   * @memberof MapComponent
   */
  public setLayers(map: Map, data: MapChart[]): Observable<Map> {
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
   * Map resize event
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
   * Tooltip label
   *
   * @param {number} assetsCount
   * @return {string}
   * @memberof MapComponent
   */
  public assetTooltipLabel(assetsCount: number): string {
    return assetsCount === 1 ? `${assetsCount} part` : `${assetsCount} parts`;
  }

  /**
   * Get marker depending on the asset count
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
    return `marker-${Math.floor(size / denominator)}${zeros}`;
  }

  /**
   * Get digits of a number
   *
   * @private
   * @param {number} size
   * @return {number}
   * @memberof MapComponent
   */
  private getDigits(size: number): number {
    return (Math.log(size) * Math.LOG10E + 1) | 0;
  }

  /**
   *
   * Sums the icon observable values
   * @private
   * @param {number[]} arr
   * @return {number}
   * @memberof MapComponent
   */
  private reducedArray(arr: number[]): number {
    return arr.length > 0 ? arr.reduce((acc, value) => acc + value) : 0;
  }
}
