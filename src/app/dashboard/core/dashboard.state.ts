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

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { State } from '../../shared/model/state';
import { DashboardAssembler } from './dashboard.assembler';
import { AssetsPerPlant, MapChart } from '../model/assets-per-plant.model';
import { AssetsPerDayGraph, AssetsPerDay } from '../model/assets-per-day.model';
import { QualityStatusGraph, QualityStatusRatio } from '../model/quality-status-ratio.model';
import { Stats } from '../model/stats.model';
import { View } from 'src/app/shared/model/view.model';

/**
 *
 *
 * @export
 * @class DashboardState
 */
@Injectable()
export class DashboardState {
  /**
   * Stats state
   *
   * @private
   * @readonly
   * @type {State<View<Stats>>}
   * @memberof DashboardState
   */
  private readonly stats$: State<View<Stats>> = new State<View<Stats>>({ loader: true });

  /**
   * Assets per day state
   *
   * @private
   * @readonly
   * @type {State<View<AssetsPerDayGraph>>}
   * @memberof DashboardState
   */
  private readonly assetsPerDay$: State<View<AssetsPerDayGraph>> = new State<View<AssetsPerDayGraph>>({ loader: true });

  /**
   * Assets per country state
   *
   * @private
   * @readonly
   * @type {State<View<MapChart[]>>}
   * @memberof DashboardState
   */
  private readonly assetsPerCountry$: State<View<MapChart[]>> = new State<View<MapChart[]>>({ loader: true });

  /**
   * Quality status ratio state
   *
   * @private
   * @readonly
   * @type {State<View<QualityStatusGraph>>}
   * @memberof DashboardState
   */
  private readonly qualityStatusRatio$: State<View<QualityStatusGraph>> = new State<View<QualityStatusGraph>>({
    loader: true,
  });

  /**
   * Stats getter
   *
   * @readonly
   * @type {Observable<View<Stats>>}
   * @memberof DashboardState
   */
  get getStats(): Observable<View<Stats>> {
    return this.stats$.observable;
  }

  /**
   * Assets per day getter
   *
   * @readonly
   * @type {Observable<View<AssetsPerDayGraph>>}
   * @memberof DashboardState
   */
  get getAssetsPerDay$(): Observable<View<AssetsPerDayGraph>> {
    return this.assetsPerDay$.observable;
  }

  /**
   * Assets per country getter
   *
   * @readonly
   * @type {Observable<View<MapChart[]>>}
   * @memberof DashboardState
   */
  get getAssetsPerCountry$(): Observable<View<MapChart[]>> {
    return this.assetsPerCountry$.observable;
  }

  /**
   * Quality status ratio getter
   *
   * @readonly
   * @type {Observable<View<QualityStatusGraph>>}
   * @memberof DashboardState
   */
  get getQualityStatusRation$(): Observable<View<QualityStatusGraph>> {
    return this.qualityStatusRatio$.observable;
  }

  /**
   * Stats setter
   *
   * @param {View<Stats>} stats
   * @return {void}
   * @memberof DashboardState
   */
  public setStats(stats: View<Stats>): void {
    this.stats$.update(stats);
  }

  /**
   * Assets per day setter
   *
   * @param {View<AssetsPerDay>} assets
   * @return {void}
   * @memberof DashboardState
   */
  public setAssetsPerDay(assets: View<AssetsPerDay>): void {
    const assetsPerDayView: View<AssetsPerDayGraph> = {
      data: assets.data && DashboardAssembler.assembleAssetsPerDay(assets.data),
      loader: assets.loader,
      error: assets.error,
    };
    this.assetsPerDay$.update(assetsPerDayView);
  }

  /**
   * Assets per country setter
   *
   * @param {View<AssetsPerPlant[]>} assetsPerCountry
   * @return {void}
   * @memberof DashboardState
   */
  public setAssetsPerCountry(assetsPerCountry: View<AssetsPerPlant[]>): void {
    const mapView: View<MapChart[]> = {
      data: assetsPerCountry.data && DashboardAssembler.assembleMap(assetsPerCountry.data),
      loader: assetsPerCountry.loader,
      error: assetsPerCountry.error,
    };
    this.assetsPerCountry$.update(mapView);
  }

  /**
   * Quality status ratio setter
   *
   * @param {View<QualityStatusRatio>} qualityStatusRatio
   * @return {void}
   * @memberof DashboardState
   */
  public setQualityStatusRatio(qualityStatusRatio: View<QualityStatusRatio>): void {
    const qualityStatusView: View<QualityStatusGraph> = {
      data: qualityStatusRatio.data && DashboardAssembler.assembleQualityStatusGraph(qualityStatusRatio.data),
      loader: qualityStatusRatio.loader,
      error: qualityStatusRatio.error,
    };
    this.qualityStatusRatio$.update(qualityStatusView);
  }
}
