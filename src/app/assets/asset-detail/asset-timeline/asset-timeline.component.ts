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
import { TransactionModel } from '../../../transactions/transaction.model';
import { AssetModel } from '../../asset.model';
import { NotificationService } from '../../../shared/notifications/notification.service';
import { Subject, Observable, EMPTY } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AssetDetailService } from '../asset-detail.service';
import { Timeline } from './timeline.model';

/**
 *
 *
 * @export
 * @class AssetTimelineComponent
 * @implements {OnChanges}
 */
@Component({
  selector: 'app-timeline',
  templateUrl: './asset-timeline.component.html',
  styleUrls: ['./asset-timeline.component.scss'],
})
export class AssetTimelineComponent implements OnChanges {
  /**
   * Asset serial number
   *
   * @type {string}
   * @memberof AssetTimelineComponent
   */
  @Input() serialNumber: string;

  /**
   * Asset
   *
   * @type {AssetModel}
   * @memberof AssetTimelineComponent
   */
  @Input() asset: AssetModel;

  /**
   * Timeline list
   *
   * @type {Timeline[]}
   * @memberof AssetTimelineComponent
   */
  public timelineList: Timeline[] = [];

  /**
   * Timeline icon
   *
   * @type {object}
   * @memberof AssetTimelineComponent
   */
  public icon = {
    OK: 'check-fill',
    NOK: 'close-circle-line',
    FLAG: 'flag-line',
  };

  /**
   * Error message handler
   *
   * @private
   * @return {Subject<string>}
   * @memberof AssetTimelineComponent
   */
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  /**
   * Asset history Observable
   *
   * @type {Observable<TransactionModel[]>}
   * @memberof AssetTimelineComponent
   */
  public assetHistory$ = new Observable<TransactionModel[]>();

  /**
   * @constructor AssetTimelineComponent.
   * @param {AssetDetailService} assetDetailService
   * @param {NotificationService} notificationService
   * @memberof AssetTimelineComponent
   */
  constructor(private assetDetailService: AssetDetailService, private notificationService: NotificationService) {}

  /**
   * Angular lifecycle method - On Changes
   *
   * @param {SimpleChanges} changes
   * @return {void}
   * @memberof AssetTimelineComponent
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.serialNumber) {
      this.assetHistory$ = this.getAssetHistory(changes.serialNumber.currentValue, 'qualityStatus');
    }
  }

  /**
   * Transaction list timeline
   *
   * @protected
   * @param {TransactionModel[]} transactions
   * @return {Timeline[]}
   * @memberof AssetTimelineComponent
   */
  protected buildTimeline(transactions: TransactionModel[]): Timeline[] {
    const timeline: Timeline[] = [] as Timeline[];
    const mspid = this.asset.mspid
      .trim()
      .toString()
      .toLocaleLowerCase();
    let timelineValue = {} as Timeline;
    const part = mspid === 'lion' || mspid === '92a2bd' ? 'Vehicle' : 'Component';
    const action = {
      OK: 'Updated',
      NOK: 'Blocked',
      FLAG: 'Flagged',
    };

    const productionDate = this.getProductionDate(this.asset, part);
    timeline.unshift(productionDate);

    if (transactions.length > 0) {
      transactions.forEach((transaction: TransactionModel) => {
        timelineValue.action = `${part} ${action[transaction.propertyNewValue]}`;
        timelineValue.timestamp = transaction.timestampChanged;
        timelineValue.icon = this.icon[transaction.propertyNewValue];
        timeline.push(timelineValue);
        timelineValue = {} as Timeline;
      });
    }
    return timeline.reverse();
  }

  /**
   * Get asset history request
   *
   * @private
   * @param {string} serialNumber
   * @param {string} propertyName
   * @return {Observable<TransactionModel[]>}
   * @memberof AssetTimelineComponent
   */
  private getAssetHistory(serialNumber: string, propertyName: string): Observable<TransactionModel[]> {
    return this.assetDetailService.getAssetHistory(serialNumber, propertyName).pipe(
      tap(transactions => {
        this.timelineList = this.buildTimeline(transactions);
      }),
      catchError(err => {
        this.errorMessageSubject.next(err);
        this.notificationService.error(err);
        return EMPTY;
      }),
    );
  }

  /**
   * Get asset production date
   *
   * @private
   * @param {AssetModel} asset
   * @param {string} part
   * @return {Timeline}
   * @memberof AssetTimelineComponent
   */
  private getProductionDate(asset: AssetModel, part: string): Timeline {
    const created = {} as Timeline;
    created.action = `${part} Created`;
    created.timestamp = asset.productionDateGmt;
    created.icon = 'check-fill';
    return created;
  }
}
