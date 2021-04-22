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
import { Observable, of } from 'rxjs';
import { UserService } from '../../core/user/user.service';
import { SharedService } from '../../shared/core/shared.service';
import { Dashboard, DashboardFilter } from '../model/dashboard.model';
import { DashboardService } from '../core/dashboard.service';
import { DashboardState } from '../core/dashboard.state';
import { AssetsPerPlant, MapChart } from '../model/assets-per-plant.model';
import { AssetsPerDay, AssetsPerDayGraph } from '../model/assets-per-day.model';
import { QualityStatusGraph } from '../model/quality-status-ratio.model';
import { Stats } from '../model/stats.model';
import { View } from 'src/app/shared/model/view.model';
import { delay } from 'rxjs/operators';

/**
 *
 *
 * @export
 * @class DashboardFacade
 */
@Injectable()
export class DashboardFacade {
  /**
   * @constructor DashboardFacade (DI)
   * @param {DashboardService} dashboardService
   * @param {SharedService} sharedService
   * @param {UserService} userService
   * @param {DashboardState} dashboardState
   * @memberof DashboardFacade
   */
  constructor(
    private dashboardService: DashboardService,
    private sharedService: SharedService,
    private userService: UserService,
    private dashboardState: DashboardState,
  ) {}

  /**
   * Stats state getter
   *
   * @readonly
   * @type {Observable<View<Stats>>}
   * @memberof DashboardFacade
   */
  get stats$(): Observable<View<Stats>> {
    return this.dashboardState.getStats.pipe(delay(0));
  }

  /**
   * Assets per day state getter
   *
   * @readonly
   * @type {Observable<View<AssetsPerDayGraph>>}
   * @memberof DashboardFacade
   */
  get assetsPerDay$(): Observable<View<AssetsPerDayGraph>> {
    return this.dashboardState.getAssetsPerDay$.pipe(delay(0));
  }

  /**
   * Assets per country state getter
   *
   * @readonly
   * @type {Observable<View<MapChart[]>>}
   * @memberof DashboardFacade
   */
  get assetsPerCountry$(): Observable<View<MapChart[]>> {
    return this.dashboardState.getAssetsPerCountry$.pipe(delay(0));
  }

  /**
   * Quality status state getter
   *
   * @readonly
   * @type {Observable<View<QualityStatusGraph>>}
   * @memberof DashboardFacade
   */
  get qualityStatus$(): Observable<View<QualityStatusGraph>> {
    return this.dashboardState.getQualityStatusRation$.pipe(delay(0));
  }

  /**
   * Is first visit getter
   *
   * @readonly
   * @type {boolean}
   * @memberof DashboardFacade
   */
  get isFirstVisit(): boolean {
    if (this.userService.getFirstVisit() && !this.userService.getDashboardLoaded()) {
      this.userService.setDashboardLoaded();
      return true;
    }
    return false;
  }

  /**
   * Initial filter getter
   *
   * @readonly
   * @type {DashboardFilter}
   * @memberof DashboardFacade
   */
  get initialFilter(): DashboardFilter {
    return {
      productionDateFrom: { value: this.sharedService.getPastDays(31) },
      productionDateTo: { value: this.sharedService.setTodayDate() },
    };
  }

  /**
   * Stats state setter
   *
   * @param {DashboardFilter} filter
   * @return {void}
   * @memberof DashboardFacade
   */
  public setStats(filter: DashboardFilter): void {
    this.dashboardState.setStats({ loader: true });
    this.dashboardState.setQualityStatusRatio({ loader: true });
    this.dashboardService.getStats(filter).subscribe(
      (kpiStats: Dashboard) => {
        const stats: Stats = {
          assetsCount: kpiStats.assetsCount,
          ownAssetsCount: kpiStats.ownAssetsCount,
          otherAssetsCount: kpiStats.otherAssetsCount,
        };
        this.dashboardState.setStats({ data: stats });
        this.dashboardState.setQualityStatusRatio({ data: kpiStats.qualityStatusRatio });
      },
      error => {
        of(this.dashboardState.setStats({ error }));
        of(this.dashboardState.setQualityStatusRatio({ error }));
      },
    );
  }

  /**
   * Assets per day state setter
   *
   * @param {DashboardFilter} filter
   * @return {void}
   * @memberof DashboardFacade
   */
  public setAssetsPerDay(filter: DashboardFilter): void {
    this.dashboardState.setAssetsPerDay({ loader: true });
    this.dashboardService.getAssetsPerDay(filter).subscribe(
      (assetsPerDay: AssetsPerDay) => {
        this.sharedService.isEmpty(assetsPerDay)
          ? this.dashboardState.setAssetsPerDay({ error: new Error('No results') })
          : this.dashboardState.setAssetsPerDay({
              data: assetsPerDay,
            });
      },
      error => of(this.dashboardState.setAssetsPerDay({ error })),
    );
  }

  /**
   * Assets per country state setter
   *
   * @param {DashboardFilter} filter
   * @return {void}
   * @memberof DashboardFacade
   */
  public setAssetsPerCountry(filter: DashboardFilter): void {
    this.dashboardState.setAssetsPerCountry({ loader: true });
    this.dashboardService.getAssetsPerCountry(filter).subscribe(
      (assetsPerCountry: AssetsPerPlant[]) => {
        this.dashboardState.setAssetsPerCountry({ data: assetsPerCountry });
      },
      error => of(this.dashboardState.setAssetsPerCountry({ error })),
    );
  }
}
