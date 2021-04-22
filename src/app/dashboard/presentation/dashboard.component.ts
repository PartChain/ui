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

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DashboardFilter } from '../model/dashboard.model';
import { GroupedTransaction } from '../../transactions/model/grouped-transaction.model';
import { DashboardFacade } from '../abstraction/dashboard.facade';
import { TransactionsFacade } from '../../transactions/abstraction/transactions.facade';
import { MapChart } from '../model/assets-per-plant.model';
import { AssetsPerDayGraph } from '../model/assets-per-day.model';
import { QualityStatusGraph } from '../model/quality-status-ratio.model';
import { Stats } from '../model/stats.model';
import { View } from 'src/app/shared/model/view.model';

/**
 *
 *
 * @export
 * @class DashboardComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  /**
   * Dashboard title
   *
   * @type {string}
   * @memberof DashboardComponent
   */
  public title = 'Dashboard';

  /**
   * Filter form group
   *
   * @type {FormGroup}
   * @memberof DashboardComponent
   */
  public filterForm: FormGroup;

  /**
   * To prevent the user from selecting a date after the current one
   *
   * @type {Date}
   * @memberof DashboardComponent
   */
  public filterMaxDate = new Date();

  /**
   * Show introduction wizard fro new users
   *
   * @type {boolean}
   * @memberof DashboardComponent
   */
  public showIntroduction = false;

  /**
   * Stats state
   *
   * @type {Observable<View<Stats>>}
   * @memberof DashboardComponent
   */
  public stats$: Observable<View<Stats>>;

  /**
   * Total assets state
   *
   * @type {Observable<View<number>>}
   * @memberof DashboardComponent
   */
  public count$: Observable<View<number>>;

  /**
   * Assets per day state
   *
   * @type {Observable<View<AssetsPerDayGraph>>}
   * @memberof DashboardComponent
   */
  public assetsPerDay$: Observable<View<AssetsPerDayGraph>>;

  /**
   * Assets per country state
   *
   * @type {Observable<View<MapChart[]>>}
   * @memberof DashboardComponent
   */
  public assetsPerCountry$: Observable<View<MapChart[]>>;

  /**
   * Quality status chart data state
   *
   * @type {Observable<View<QualityStatusGraph>>}
   * @memberof DashboardComponent
   */
  public qualityStatus$: Observable<View<QualityStatusGraph>>;

  /**
   * Transaction state
   *
   * @type {Observable<View<GroupedTransaction[]>>}
   * @memberof DashboardComponent
   */
  public transactions$: Observable<View<GroupedTransaction[]>>;

  /**
   * @constructor DashboardComponent
   * @param {DashboardFacade} dashboardFacade
   * @param {TransactionsFacade} transactionFacade
   * @memberof DashboardComponent
   */
  constructor(private dashboardFacade: DashboardFacade, private transactionFacade: TransactionsFacade) {
    this.showIntroduction = this.dashboardFacade.isFirstVisit;
    this.filterForm = this.getDashboardFormGroup();
    this.filterMaxDate.getDate();
    this.stats$ = this.dashboardFacade.stats$;
    this.qualityStatus$ = this.dashboardFacade.qualityStatus$;
    this.assetsPerDay$ = this.dashboardFacade.assetsPerDay$;
    this.assetsPerCountry$ = this.dashboardFacade.assetsPerCountry$;
    this.transactions$ = this.transactionFacade.transactions$;
  }

  /**
   * Angular lifecycle method - On Init
   *
   * @return {void}
   * @memberof DashboardComponent
   */
  ngOnInit(): void {
    const transactionFilter: { property_name: string; status: string } = {
      property_name: 'qualityStatus',
      status: 'STORED',
    };
    const formFilter: DashboardFilter = this.getFilter();
    this.dashboardFacade.setStats(formFilter);
    this.dashboardFacade.setAssetsPerCountry(formFilter);
    this.dashboardFacade.setAssetsPerDay(formFilter);
    this.transactionFacade.setTransactions(transactionFilter);
  }

  /**
   * Filter event
   *
   * @return {void}
   * @memberof DashboardComponent
   */
  public filter(): void {
    const formFilter = this.getFilter();
    this.dashboardFacade.setStats(formFilter);
    this.dashboardFacade.setAssetsPerCountry(formFilter);
    this.dashboardFacade.setAssetsPerDay(formFilter);
  }

  /**
   * Checking if the chart has empty values
   *
   * @param {QualityStatusGraph} nok
   * @return {boolean}
   * @memberof DashboardComponent
   */
  public allZero(nok: QualityStatusGraph): boolean {
    if (nok) {
      return nok.data.every(value => value === 0);
    }
  }

  /**
   * Build the form
   *
   * @private
   * @return {FormGroup}
   * @memberof DashboardComponent
   */
  private getDashboardFormGroup(): FormGroup {
    const builder = new FormBuilder();
    const { productionDateFrom, productionDateTo } = this.dashboardFacade.initialFilter;
    return builder.group({
      productionDateFrom: [`${productionDateFrom.value}`, Validators.required],
      productionDateTo: [`${productionDateTo.value}`],
    });
  }

  /**
   * Getting the values from the filter form
   *
   * @private
   * @return {DashboardFilter}
   * @memberof DashboardComponent
   */
  private getFilter(): DashboardFilter {
    return {
      productionDateFrom: { value: this.filterForm.get('productionDateFrom').value },
      productionDateTo: { value: this.filterForm.get('productionDateTo').value },
    };
  }
}
