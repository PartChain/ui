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

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EMPTY, Observable, Subject } from 'rxjs';
import { KpisService } from './kpis.service';
import { TransactionsService } from '../transactions/transactions.service';
import { FilterService } from '../shared/assets-filter/filter.service';
import { NotificationService } from '../shared/notifications/notification.service';
import { TransactionModel } from '../transactions/transaction.model';
import { KpisModel, QualityStatusRatio } from './kpis.model';
import { groupBy, isEmpty, orderBy } from 'lodash-es';
import { SharedService } from '../shared/shared.service';
import { GroupedTransactionModel } from '../transactions/grouped-transaction.model';
import { catchError, tap } from 'rxjs/operators';
import { UserService } from '../core/user/user.service';

/**
 *
 *
 * @export
 * @class KpisComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-kpis',
  templateUrl: './kpis.component.html',
  styleUrls: ['./kpis.component.scss'],
})
export class KpisComponent implements OnInit {
  /**
   * Assets event emitter
   *
   * @type {EventEmitter<string>}
   * @memberof KpisComponent
   */
  @Output() assetEvent = new EventEmitter<string>();

  /**
   * List of available transactions
   *
   * @type {Array<GroupedTransactionModel>}
   * @memberof KpisComponent
   */
  public transactionsList: Array<GroupedTransactionModel> = [];

  /**
   * Kpis
   *
   * @type {Observable<KpisModel>}
   * @memberof KpisComponent
   */
  public kpis$: Observable<KpisModel> = new Observable<KpisModel>();

  /**
   * Assets per day
   *
   * @type {Observable<any>}
   * @memberof KpisComponent
   */
  public assetsPerDay$: Observable<any> = new Observable<any>();

  /**
   * Assets per country
   *
   * @type {Observable<any>}
   * @memberof KpisComponent
   */
  public assetsPerCountry$: Observable<any> = new Observable<any>();

  /**
   * Transactions
   *
   * @type {Observable<TransactionModel[]>}
   * @memberof KpisComponent
   */
  public transactions$: Observable<TransactionModel[]> = new Observable<TransactionModel[]>();

  /**
   * Filter form
   *
   * @type {FormGroup}
   * @memberof KpisComponent
   */
  public filterForm: FormGroup;

  /**
   * Dashboard title
   *
   * @type {string}
   * @memberof KpisComponent
   */
  public title = 'Dashboard';

  /**
   * Current date
   *
   * @type {Date}
   * @memberof KpisComponent
   */
  public today = new Date();

  /**
   * Show introduction wizard
   *
   * @type {boolean}
   * @memberof KpisComponent
   */
  public showIntroduction = false;

  /**
   * Error message handler
   *
   * @private
   * @type {Subject<string>}
   * @memberof KpisComponent
   */
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  /**
   * Transaction serial number
   *
   * @private
   * @type {string}
   * @memberof KpisComponent
   */
  private transactionSerialNumber = '';

  /**
   * @constructor KpisComponent.
   * @param {KpisService} kpisService
   * @param {TransactionsService} transactionsService
   * @param {FilterService} filterService
   * @param {NotificationService} notificationService
   * @param {SharedService} sharedService
   * @param {UserService} userService
   * @memberof KpisComponent
   */
  constructor(
    private kpisService: KpisService,
    private transactionsService: TransactionsService,
    private filterService: FilterService,
    private notificationService: NotificationService,
    private sharedService: SharedService,
    private userService: UserService,
  ) {
    if (this.userService.getFirstVisit() && !this.userService.getDashboardLoaded()) {
      this.showIntroduction = true;
      this.userService.setDashboardLoaded();
    }
    this.filterForm = this.filterService.getDashboardFormGroup();
    this.today.getDate();
  }

  /**
   * Angular lifecycle method - On Init
   *
   * @return {void}
   * @memberof KpisComponent
   */
  ngOnInit(): void {
    this.setTileDates();
    this.getKpis();
  }

  /**
   * Gets the proper message to the events list
   *
   * @param {number} total
   * @return {string}
   * @memberof KpisComponent
   */
  public messageToDisplay(total: number): string {
    return total === 1 ? `${total} part committed` : `${total} parts committed`;
  }

  /**
   * Get kpis filter event
   *
   * @return {void}
   * @memberof KpisComponent
   */
  public filter(): void {
    this.getKpis();
  }

  /**
   * Helper method to check for empty objects
   *
   * @param {*} object
   * @return {boolean}
   * @memberof KpisComponent
   */
  public isKpisEmpty(object: any): boolean {
    return this.sharedService.isEmpty(object);
  }

  /**
   * Checks total of nok assets
   *
   * @param {*} nok
   * @return {number}
   * @memberof KpisComponent
   */
  public checkForNOKChartValues(nok: any): number {
    if (!isEmpty(nok)) {
      const status: QualityStatusRatio[] = Object.values(nok);
      const barChartNOKValues = status.map(value => value.NOK);
      const sumOfNOK = barChartNOKValues.reduce((acc, value) => acc + value);
      return sumOfNOK;
    } else {
      return 0;
    }
  }

  /**
   * Kpi stats request
   *
   * @private
   * @param {*} [filter]
   * @return {Observable<KpisModel>}
   * @memberof KpisComponent
   */
  private getKpiStats(filter?: any): Observable<KpisModel> {
    return this.kpisService.getKPIS(filter).pipe(
      tap(() => {
        this.transactions$ = this.getTransactionsList();
      }),
    );
  }

  /**
   * Overall kpis request
   *
   * @private
   * @return {void}
   * @memberof KpisComponent
   */
  private getKpis(): void {
    const filter = {
      productionDateFrom: {
        value: this.filterForm.get('productionDateFrom').value,
      },
      productionDateTo: { value: this.filterForm.get('productionDateTo').value },
    };
    this.kpis$ = this.getKpiStats({ filter });
    this.assetsPerDay$ = this.kpisService.getAssetsPerDay({ filter });
    this.assetsPerCountry$ = this.kpisService.getAssetsPerCountry({ filter });
  }

  /**
   * Transaction list request
   *
   * @private
   * @return {Observable<TransactionModel[]>}
   * @memberof KpisComponent
   */
  private getTransactionsList(): Observable<TransactionModel[]> {
    this.transactionsList = [];
    return this.transactionsService.getTransactions().pipe(
      tap(transactions => {
        transactions.forEach(transaction => {
          transaction.groupingKey = `${transaction.propertyOldValue}${transaction.propertyNewValue}`;
        });
        transactions.map(value => {
          this.transactionSerialNumber = value.assetId;
        });
        this.seTransactionObject(groupBy(transactions, 'groupingKey'));
      }),
      catchError(err => {
        this.errorMessageSubject.next(err);
        this.notificationService.error(err);
        return EMPTY;
      }),
    );
  }

  /**
   * Creates a list of grouped transactions
   *
   * @private
   * @param {*} transactions
   * @return {void}
   * @memberof KpisComponent
   */
  private seTransactionObject(transactions): void {
    for (const value in transactions) {
      const transactionsObjectPerUser = {} as GroupedTransactionModel;
      transactionsObjectPerUser.totalOfTransactions = transactions[value].length;
      transactions[value].forEach(transaction => {
        transactionsObjectPerUser.userId = transaction.userId;
        transactionsObjectPerUser.propertyNewValue = transaction.propertyNewValue;
        transactionsObjectPerUser.timestampCreated = transaction.timestampCreated;
        transactionsObjectPerUser.propertyOldValue = transaction.propertyOldValue;
      });
      // Transaction list to display on the ui
      this.transactionsList.push(transactionsObjectPerUser);
      this.transactionsList = orderBy(
        this.transactionsList,
        transaction => this.sharedService.timestampToDate(+transaction.timestampCreated),
        ['desc'],
      );
    }
  }

  /**
   * Form dates setter
   *
   * @private
   * @return {void}
   * @memberof KpisComponent
   */
  private setTileDates(): void {
    if (
      this.filterForm.get('productionDateFrom').value === '' ||
      this.filterForm.get('productionDateTo').value === ''
    ) {
      this.filterForm.controls.productionDateFrom.setValue(this.sharedService.getPastDays(31));
      this.filterForm.controls.productionDateTo.setValue(this.sharedService.setTodayDate());
    }
  }
}
