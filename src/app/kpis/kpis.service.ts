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
import { ApiService } from '../core/api/api.service';
import { ApiServiceProperties } from '../core/api/api.service.properties';
import { KPIResponseModel } from '../core/api/api-response.model';
import { map, catchError } from 'rxjs/operators';

/**
 * Injectable kpi service
 *
 * @export
 * @class KpisService
 */
@Injectable({
  providedIn: 'root',
})
export class KpisService {
  /**
   * @constructor KpisService.
   * @param {ApiService} apiService
   * @memberof KpisService
   */
  constructor(private apiService: ApiService) {}

  /**
   * Get api stats request
   *
   * @param {*} filter
   * @return {Observable<KpisModel>}
   * @memberof KpisService
   */
  public getKPIS = (filter: any) =>
    this.apiService.post(ApiServiceProperties.laapi + 'kpi/kpi-stats', filter).pipe(
      map((payload: KPIResponseModel) => payload.data),
      catchError(this.apiService.handleError),
    );

  /**
   * Helper method to check for empty values
   *
   * @param {string} value
   * @return {boolean}
   * @memberof KpisService
   */
  public isEmpty(value: string): boolean {
    return value === undefined;
  }

  /**
   * Assets per day request
   *
   * @param {*} filter
   * @return {Observable<KpisModel>}
   * @memberof KpisService
   */
  public getAssetsPerDay = (filter: any) =>
    this.apiService.post(ApiServiceProperties.laapi + 'kpi/assets-per-day', filter).pipe(
      map((payload: KPIResponseModel) => payload.data),
      catchError(this.apiService.handleError),
    );

  /**
   * Assets per country request
   *
   * @param {*} filter
   * @return {Observable<KpisModel>}
   * @memberof KpisService
   */
  public getAssetsPerCountry = (filter: any) =>
    this.apiService.post(ApiServiceProperties.laapi + 'kpi/assets-per-MaC', filter).pipe(
      map((payload: KPIResponseModel) => payload.data),
      catchError(this.apiService.handleError),
    );
}
