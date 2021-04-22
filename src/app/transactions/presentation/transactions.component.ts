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
import { GroupedTransaction } from '../model/grouped-transaction.model';
import { Observable } from 'rxjs';
import { TransactionsFacade } from '../abstraction/transactions.facade';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { View } from 'src/app/shared/model/view.model';

/**
 *
 *
 * @export
 * @class TransactionsComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-cart',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  /**
   * Page title
   *
   * @type {string}
   * @memberof TransactionsComponent
   */
  public title = 'Transactions';

  /**
   * Transactions state
   *
   * @type {Observable<View<GroupedTransaction[]>>}
   * @memberof TransactionsComponent
   */
  public transactions$: Observable<View<GroupedTransaction[]>>;

  /**
   * @constructor TransactionsComponent
   * @param {MatDialog} dialog
   * @param {TransactionsFacade} transactionsFacade
   * @memberof TransactionsComponent
   */
  constructor(private dialog: MatDialog, private transactionsFacade: TransactionsFacade) {
    this.transactions$ = this.transactionsFacade.transactionsTree$;
  }

  /**
   * Angular lifecycle - On Init
   *
   * @return {void}
   * @memberof TransactionsComponent
   */
  ngOnInit(): void {
    this.transactionsFacade.setPendingTransactions();
  }

  /**
   * Submit single transaction event
   *
   * @param {string} timestamp
   * @return {void}
   * @memberof TransactionsComponent
   */
  public onSubmit(timestamp: string): void {
    this.transactionsFacade.commitTransactions(timestamp);
  }

  /**
   * Delete single transaction event
   *
   * @param {string} timestamp
   * @return {void}
   * @memberof TransactionsComponent
   */
  public onDelete(timestamp: string): void {
    this.transactionsFacade.deleteTransactions(timestamp);
  }

  /**
   * Commit all transactions event
   *
   * @param {boolean} event
   * @return {void}
   * @memberof TransactionsComponent
   */
  public commitAll(event: boolean): void {
    if (event) {
      const message = `Are you sure you want to commit all pending transactions?`;
      const dialogData = new ConfirmDialogModel('Confirm Action', message, 'success', false);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: dialogData,
        panelClass: 'custom-dialog-container',
      });

      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.transactionsFacade.commitTransactions();
        }
      });
    }
  }

  /**
   * Delete all transactions event
   *
   * @param {boolean} event
   * @return {void}
   * @memberof TransactionsComponent
   */
  public deleteAll(event: boolean): void {
    if (event) {
      const message = `Are you sure you want to delete all pending transactions?`;
      const dialogData = new ConfirmDialogModel('Confirm Action', message, 'error', false);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: dialogData,
        panelClass: 'custom-dialog-container',
      });

      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.transactionsFacade.deleteTransactions();
        }
      });
    }
  }
}
