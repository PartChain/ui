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
import { SharedService } from '../shared.service';

/**
 * Injectable filter service
 *
 * @export
 * @class FilterService
 */
@Injectable({
  providedIn: 'root',
})
export class FilterService {
  /**
   * @constructor FilterService.
   * @param {SharedService} sharedService
   * @memberof FilterService
   */
  constructor(private sharedService: SharedService) {}

  /**
   * Is default date range selected
   *
   * @private
   * @static
   * @param {FormGroup} form
   * @return {boolean}
   * @memberof FilterService
   */
  private static isDefaultProductionDateRange(form: FormGroup): boolean {
    return form.get('productionDateFrom').value === '' && form.get('productionDateTo').value === '';
  }

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
      componentStatus: ['all'],
      manufacturerLine: [''],
      manufacturerPlant: [''],
      serialNumberType: ['SINGLE'],
    });
  }

  /**
   * Dashboard form getter
   *
   * @return {FormGroup}
   * @memberof FilterService
   */
  public getDashboardFormGroup(): FormGroup {
    const builder = new FormBuilder();
    return builder.group({
      productionDateFrom: ['', Validators.required],
      productionDateTo: [''],
    });
  }

  /**
   * Reducing the provided values
   *
   * @param {*} values
   * @param {string} type
   * @return {*}
   * @memberof FilterService
   */
  public createFilters(values: any, type: string) {
    return Object.entries(values)
      .filter(([_, value]) => value !== '' && value !== null && value !== 'all')
      .reduce(
        (acc, [key, value]) => {
          acc[key] = { value };
          return acc;
        },
        { type: { value: type } },
      );
  }

  /**
   * Gets number of active filters based on defined rules
   *
   * @param {FormGroup} form
   * @return {number}
   * @memberof FilterService
   */
  public activeFilterCount(form: FormGroup): number {
    return Object.entries(form.controls).reduce((acc, [key, value]) => {
      if (
        key !== 'type' &&
        key !== 'productionDateTo' &&
        value.value !== 'all' &&
        value.value !== null &&
        value.value !== ''
      ) {
        if (!FilterService.isDefaultProductionDateRange(form)) {
          acc++;
        } else {
          acc++;
        }
      }
      return acc;
    }, 0);
  }

  /**
   * End date edge case
   *
   * @param {FormGroup} form
   * @return {void}
   * @memberof FilterService
   */
  public isEndDateMissing(form: FormGroup): void {
    if (form.get('productionDateFrom').value !== '' && form.get('productionDateTo').value === '') {
      form.controls.productionDateTo.setValue(this.sharedService.setTodayDate());
    }
  }

  /**
   * Gets reduced filter values
   *
   * @param {FormGroup} form
   * @param {string} type
   * @return {*}
   * @memberof FilterService
   */
  public getModalFilters(form: FormGroup, type: string) {
    return this.createFilters(
      Object.entries(form.controls).reduce((acc, [key, value]) => {
        acc[key] = value.value;
        return acc;
      }, {}),
      type,
    );
  }
}
