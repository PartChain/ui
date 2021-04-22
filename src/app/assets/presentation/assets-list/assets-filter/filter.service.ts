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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../../../shared/core/shared.service';
import { AssetFilter } from '../../../model/asset-filter.model';

/**
 *
 *
 * @export
 * @class FilterService
 */
@Injectable({
  providedIn: 'root',
})
export class FilterService {
  /**
   * @constructor FilterService
   * @param {SharedService} sharedService
   * @memberof FilterService
   */
  constructor(private sharedService: SharedService) {}

  /**
   * Form getter
   *
   * @return {FormGroup}
   * @memberof FilterService
   */
  public getDefaultForm(): FormGroup {
    const builder = new FormBuilder();
    return builder.group({
      serialNumberCustomer: [''],
      manufacturer: [''],
      productionCountryCode: [''],
      partNameNumber: [''],
      productionDateFrom: ['', Validators.required],
      productionDateTo: [''],
      qualityStatus: ['all'],
      manufacturerLine: [''],
      manufacturerPlant: [''],
      serialNumberType: ['SINGLE'],
    });
  }

  /**
   * Filter builder
   *
   * @param {AssetFilter} values
   * @param {string} type
   * @return {{ type: { value: string } }}
   * @memberof FilterService
   */
  public createFilters(values: AssetFilter, type: string): { type: { value: string } } {
    return Object.entries(values)
      .filter(([value]) => value !== '' && value !== null && value !== 'all')
      .reduce(
        (acc, [key, value]) => {
          acc[key] = { value };
          return acc;
        },
        { type: { value: type } },
      );
  }

  /**
   * Is filter end date missing
   *
   * @param {FormGroup} form
   * @memberof FilterService
   */
  public isEndDateMissing(form: FormGroup): void {
    if (form.get('productionDateFrom').value !== '' && form.get('productionDateTo').value === '') {
      form.controls.productionDateTo.setValue(this.sharedService.setTodayDate());
    }
  }

  /**
   * Reduce the filters for the api request
   *
   * @param {FormGroup} form
   * @param {string} type
   * @return {{ type: { value: string } }}
   * @memberof FilterService
   */
  public getModalFilters(form: FormGroup, type: string): { type: { value: string } } {
    return this.createFilters(
      Object.entries(form.controls).reduce((acc, [key, value]) => {
        acc[key] = value.value;
        return acc;
      }, {}),
      type,
    );
  }

  /**
   * Filter getter
   *
   * @param {Router} router
   * @return {*}  {{
   *     productionDateFrom: { value: string };
   *     productionDateTo: { value: string };
   *     type: { value: string };
   *   }}
   * @memberof FilterService
   */
  public getFilter(
    router: Router,
  ): {
    productionDateFrom: { value: string };
    productionDateTo: { value: string };
    type: { value: string };
  } {
    const route = router.url
      .split('/')
      .slice(-1)
      .toString();
    const mappedQuery = {
      assets: 'other',
      'own-assets': 'own',
    };
    return {
      productionDateFrom: { value: this.sharedService.getPastDays(31) },
      productionDateTo: { value: this.sharedService.setTodayDate() },
      type: { value: mappedQuery[route] },
    };
  }
}
