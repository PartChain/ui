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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { TransactionsService } from './transactions.service';
import { NotificationService } from '../shared/notifications/notification.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../shared/confirm-dialog/confirm-dialog.component';
import { NotificationText } from '../shared/notifications/notification-message/notification-text';
import { FlatNodeTransactionModel } from './flat-node-transaction.model';
import { GroupedTransactionModel } from './grouped-transaction.model';
import { TransactionModel } from './transaction.model';
import { groupBy, flatten } from 'lodash-es';
import { Observable, Subject, EMPTY } from 'rxjs';
import { tap, catchError, takeUntil } from 'rxjs/operators';
import { SharedService } from '../shared/shared.service';

/**
 *
 *
 * @export
 * @class TransactionsComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-cart',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit, OnDestroy {
  /**
   * Transactions per quality status
   *
   * @type {Array<any>}
   * @memberof TransactionsComponent
   */
  public transactionsListQualityStatus: Array<any> = [];

  /**
   * The TreeControl controls the expand/collapse state of tree nodes
   *
   * @type {FlatTreeControl<FlatNodeTransactionModel>}
   * @memberof TransactionsComponent
   */
  public treeControl: FlatTreeControl<FlatNodeTransactionModel>;

  /**
   * The MatTreeFlatDataSource connects the control and flattener to provide data
   *
   * @type {MatTreeFlatDataSource<GroupedTransactionModel, FlatNodeTransactionModel>}
   * @memberof TransactionsComponent
   */
  public dataSource: MatTreeFlatDataSource<GroupedTransactionModel, FlatNodeTransactionModel>;

  /**
   * The TreeFlattener is used to generate the flat list of items from hierarchical data
   *
   * @private
   * @type {MatTreeFlattener<GroupedTransactionModel, FlatNodeTransactionModel>}
   * @memberof TransactionsComponent
   */
  private treeFlattener: MatTreeFlattener<GroupedTransactionModel, FlatNodeTransactionModel>;

  /**
   * Transaction list
   *
   * @type Observable<TransactionModel[]>
   * @memberof TransactionsComponent
   */
  public transactions$ = new Observable<TransactionModel[]>();

  /**
   * Skeleton loading
   *
   * @type {boolean}
   * @memberof TransactionsComponent
   */
  public loading = false;

  /**
   * Transactions title
   *
   * @type {string}
   * @memberof TransactionsComponent
   */
  public title = 'Transactions';

  /**
   * Svg icon
   *
   * @type {object}
   * @memberof TransactionsComponent
   */
  public icon = {
    OK: 'checkbox-circle-line',
    NOK: 'close-circle-line',
    FLAG: 'flag-line',
  };

  /**
   * Error message handler
   *
   * @private
   * @type {Subject<string>}
   * @memberof TransactionsComponent
   */
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  /**
   * Unsubscribe request
   *
   * @private
   * @type {Subject<void>}
   * @memberof TransactionsComponent
   */
  private unsubscribe$: Subject<void> = new Subject<void>();

  /**
   * @constructor TransactionsComponent.
   * @param {TransactionsService} transactionsService
   * @param {NotificationService} notificationService
   * @param {MatDialog} dialog
   * @param {SharedService} sharedService
   * @memberof TransactionsComponent
   */
  constructor(
    private transactionsService: TransactionsService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private sharedService: SharedService,
  ) {}

  /**
   * Angular lifecycle method - On init
   *
   * @type {void}
   * @memberof TransactionsComponent
   */
  ngOnInit(): void {
    this.clearTransactions();
    this.setTransactionsList();
  }

  /**
   * Angular lifecycle method - On Destroy
   *
   * @type {void}
   * @memberof TransactionsComponent
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Node has child
   *
   * @param {number} _
   * @param {FlatNodeTransactionModel} node
   * @memberof TransactionsComponent
   */
  public hasChild = (_: number, node: FlatNodeTransactionModel) => node.expandable;

  /**
   * Gets the proper message to the ui
   *
   * @param {number} item
   * @return {string}
   * @memberof TransactionsComponent
   */
  public messageToDisplay(item: number): string {
    return item === 1 ? `${item} component changed from ` : `${item} components changed from `;
  }

  /**
   * Submit event
   *
   * @param {string} timestamp
   * @memberof TransactionsComponent
   */
  public onSubmit(timestamp: string): void {
    const transactions = this.transactionsToCommit(timestamp);
    this.commitTransactions(transactions);
  }

  /**
   * Delete event
   *
   * @param {string} timestamp
   * @memberof TransactionsComponent
   */
  public onReject(timestamp: string): void {
    const transactions = this.transactionsToCommit(timestamp);
    this.deleteTransactions(transactions);
  }

  /**
   * Commit all transactions
   *
   * @type {void}
   * @memberof TransactionsComponent
   */
  public commitAll(): void {
    const message = `Are you sure you want to commit all pending transactions?`;
    const dialogData = new ConfirmDialogModel('Confirm Action', message, 'success', false);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        const transactions = this.transactionsToCommit();
        this.commitTransactions(transactions);
      }
    });
  }

  /**
   * Delete all transactions
   *
   * @type {void}
   * @memberof TransactionsComponent
   */
  public deleteAll(): void {
    const message = `Are you sure you want to delete all pending transactions?`;
    const dialogData = new ConfirmDialogModel('Confirm Action', message, 'error', false);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        const transactions = this.transactionsToCommit();
        this.deleteTransactions(transactions);
      }
    });
  }

  /**
   * Get expanded icon
   *
   * @param {*} node
   * @return {*}  {string}
   * @memberof TransactionsComponent
   */
  public getExpandedIcon(node): string {
    return this.treeControl.isExpanded(node) ? 'arrow-down-s-line' : 'arrow-right-s-line';
  }

  /**
   * Grouping transactions by propertyNewValue
   *
   * @private
   * @return {void}
   * @memberof TransactionsComponent
   */
  private setTransactionsList(): void {
    this.transactions$ = this.transactionsService.getTransactionsList().pipe(
      tap((transactions: TransactionModel[]) => {
        this.sharedService.pushTransactions(transactions.length);
        this.seTransactionObject(groupBy(transactions, 'propertyNewValue'));
      }),
      catchError(err => {
        this.errorMessageSubject.next(err);
        this.notificationService.error(err);
        return EMPTY;
      }),
    );
  }

  /**
   * Creating a list of transactions
   *
   * @private
   * @param {*} transactions
   * @return {void}
   * @memberof TransactionsComponent
   */
  private seTransactionObject(transactions: any): void {
    this.transactionsListQualityStatus = [];
    for (const value in transactions) {
      const transaction: GroupedTransactionModel = this.createTransactionToCommit(transactions[value]);
      this.transactionsListQualityStatus.push(transaction);
      this.treeBuilder();
    }
  }

  /**
   * Creating the object schema to be committed
   *
   * @private
   * @param {*} transactions
   * @return {GroupedTransactionModel}
   * @memberof TransactionsComponent
   */
  private createTransactionToCommit(transactions): GroupedTransactionModel {
    const transactionsObjectPerUser = {} as GroupedTransactionModel;
    transactionsObjectPerUser.totalOfTransactions = transactions.length;
    transactions.forEach(transaction => {
      transactionsObjectPerUser.userId = transaction.userId;
      transactionsObjectPerUser.propertyNewValue = transaction.propertyNewValue;
      transactionsObjectPerUser.timestampCreated = transaction.timestampCreated;
      transactionsObjectPerUser.propertyOldValue = transaction.propertyOldValue;
      transactionsObjectPerUser.serialNumberCustomer = transaction.serialNumberCustomer;
    });

    transactionsObjectPerUser.transactions = transactions;
    return transactionsObjectPerUser;
  }

  /**
   * Tree builder
   *
   * @private
   * @return {void}
   * @memberof TransactionsComponent
   */
  private treeBuilder(): void {
    this.treeFlattener = new MatTreeFlattener<GroupedTransactionModel, FlatNodeTransactionModel>(
      this.transactionsService.transformer,
      this.transactionsService.getLevel,
      this.transactionsService.isExpandable,
      this.transactionsService.getChildren,
    );

    this.treeControl = new FlatTreeControl<FlatNodeTransactionModel>(
      this.transactionsService.getLevel,
      this.transactionsService.isExpandable,
    );
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataSource.data = this.transactionsListQualityStatus;
  }

  /**
   * Mapping the transactions to be committed
   *
   * @private
   * @param {string} [timestamp]
   * @return {*}  {*}
   * @memberof TransactionsComponent
   */
  private transactionsToCommit(timestamp?: string): any {
    return timestamp
      ? this.transactionsListQualityStatus
          .filter((transaction: GroupedTransactionModel) => transaction.timestampCreated === timestamp)[0]
          .transactions.map((transactionId: TransactionModel) => +transactionId.transactionId)
      : (this.transactionsListQualityStatus = flatten(
          this.transactionsListQualityStatus.map((transaction: GroupedTransactionModel) => transaction.transactions),
        ).map((tx: TransactionModel) => +tx.transactionId));
  }

  /**
   * Commit transactions request
   *
   * @private
   * @param {number[]} transactions
   * @return {void}
   * @memberof TransactionsComponent
   */
  private commitTransactions(transactions: number[]): void {
    this.loading = true;
    this.transactionsService.commitTransactions(transactions).subscribe(() => {
      this.notificationService.success(NotificationText.SuccessFullyCommitted, 3000);
      this.loading = false;
      this.clearTransactions();
      this.setTransactionsList();
    }),
      takeUntil(this.unsubscribe$),
      catchError(err => {
        this.errorMessageSubject.next(err);
        this.notificationService.error(this.notificationService.errorServiceResponse(err));
        return EMPTY;
      });
  }

  /**
   * Delete transactions request
   *
   * @private
   * @param {number[]} transactions
   * @memberof TransactionsComponent
   */
  private deleteTransactions(transactions: number[]): void {
    this.transactionsService.deleteTransactions(transactions).subscribe(() => {
      this.notificationService.success(NotificationText.SuccessFullyDeleted);
      this.clearTransactions();
      this.setTransactionsList();
    }),
      takeUntil(this.unsubscribe$),
      catchError(err => {
        this.errorMessageSubject.next(err);
        this.notificationService.error(this.notificationService.errorServiceResponse(err));
        return EMPTY;
      });
  }

  /**
   * Sets the total of transactions to the subject
   *
   * @private
   * @return {void}
   * @memberof TransactionsComponent
   */
  private clearTransactions(): void {
    this.sharedService.clearTransactions();
  }
}
