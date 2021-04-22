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
import { ApiService } from '../../core/api/api.service';
import { ApiServiceProperties } from '../../core/api/api.service.properties';
import { map } from 'rxjs/operators';
import { Dashboard, DashboardFilter } from '../model/dashboard.model';
import { AssetsPerDay } from '../model/assets-per-day.model';
import { AssetsPerPlant } from '../model/assets-per-plant.model';
import { Observable } from 'rxjs';

/**
 *
 *
 * @export
 * @class DashboardService
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  /**
   * @constructor DashboardService (DI)
   * @param {ApiService} apiService
   * @memberof DashboardService
   */
  constructor(private apiService: ApiService) {}

  /**
   * Stats request
   *
   * @param {DashboardFilter} filter
   * @return {Observable<Dashboard>}
   * @memberof DashboardService
   */
  public getStats(filter: DashboardFilter): Observable<Dashboard> {
    return this.apiService
      .post(`${ApiServiceProperties.laapi}kpi/kpi-stats`, { filter })
      .pipe(map((payload: { data: Dashboard; status: number }) => payload.data));
  }

  /**
   * Assets per day request
   *
   * @param {DashboardFilter} filter
   * @return {Observable<AssetsPerDay>}
   * @memberof DashboardService
   */
  public getAssetsPerDay(filter: DashboardFilter): Observable<AssetsPerDay> {
    return this.apiService
      .post(`${ApiServiceProperties.laapi}kpi/assets-per-day`, { filter })
      .pipe(map((payload: { data: AssetsPerDay; status: number }) => payload.data));
  }

  /**
   * Assets per plant request
   *
   * @param {DashboardFilter} filter
   * @return {Observable<AssetsPerPlant[]>}
   * @memberof DashboardService
   */
  public getAssetsPerCountry(filter: DashboardFilter): Observable<AssetsPerPlant[]> {
    return this.apiService
      .post(ApiServiceProperties.laapi + 'kpi/assets-per-MaC', { filter })
      .pipe(map((payload: { data: AssetsPerPlant[]; status: number }) => payload.data));
  }
}
