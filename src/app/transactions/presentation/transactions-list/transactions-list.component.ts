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

import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { TransactionsFacade } from '../../abstraction/transactions.facade';
import { FlatNodeTransaction } from '../../model/flat-node-transaction.model';
import { GroupedTransaction } from '../../model/grouped-transaction.model';

/**
 *
 *
 * @export
 * @class TransactionsListComponent
 * @implements {OnChanges}
 */
@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss'],
})
export class TransactionsListComponent implements OnChanges {
  /**
   * Grouped transactions
   *
   * @type {GroupedTransaction[]}
   * @memberof TransactionsListComponent
   */
  @Input() transactions: GroupedTransaction[];

  /**
   * Submit event emitter
   *
   * @type {EventEmitter<string>}
   * @memberof TransactionsListComponent
   */
  @Output() submitTransaction: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Delete event emitter
   *
   * @type {EventEmitter<string>}
   * @memberof TransactionsListComponent
   */
  @Output() deleteTransaction: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Commit all event emitter
   *
   * @type {EventEmitter<boolean>}
   * @memberof TransactionsListComponent
   */
  @Output() commitAllTransactions: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Delete all event emitter
   *
   * @type {EventEmitter<boolean>}
   * @memberof TransactionsListComponent
   */
  @Output() deleteAllTransactions: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Tree controls
   *
   * @type {FlatTreeControl<FlatNodeTransaction>}
   * @memberof TransactionsListComponent
   */
  public treeControl: FlatTreeControl<FlatNodeTransaction>;

  /**
   * Transaction status icon
   *
   * @type {+} {OK: string, NOK: string, FLAG: string}
   * @memberof TransactionsListComponent
   */
  public icon = {
    OK: 'checkbox-circle-line',
    NOK: 'close-circle-line',
    FLAG: 'flag-line',
  };

  /**
   * Loading flag
   *
   * @type {boolean}
   * @memberof TransactionsListComponent
   */
  public loading = false;

  /**
   * Tree data source
   *
   * @type {MatTreeFlatDataSource<GroupedTransaction, FlatNodeTransaction>}
   * @memberof TransactionsListComponent
   */
  public dataSource: MatTreeFlatDataSource<GroupedTransaction, FlatNodeTransaction>;

  /**
   * Tree flattener
   *
   * @private
   * @type {MatTreeFlattener<GroupedTransaction, FlatNodeTransaction>}
   * @memberof TransactionsListComponent
   */
  private treeFlattener: MatTreeFlattener<GroupedTransaction, FlatNodeTransaction>;

  /**
   * @constructor TransactionsListComponent (DI)
   * @param {TransactionsFacade} transactionsFacade
   * @memberof TransactionsListComponent
   */
  constructor(private transactionsFacade: TransactionsFacade) {}

  /**
   * Angular lifecycle method - Ng On Changes
   *
   * @param {SimpleChanges} changes
   * @return {void}
   * @memberof TransactionsListComponent
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.transactions) {
      this.treeBuilder(changes.transactions.currentValue);
    }
  }

  /**
   * Tree child expandable
   *
   * @param {number} _
   * @param {FlatNodeTransaction} node
   * @memberof TransactionsListComponent
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public hasChild = (_: number, node: FlatNodeTransaction) => node.expandable;

  /**
   * Expandable icon
   *
   * @param {FlatNodeTransaction} node
   * @return {string}
   * @memberof TransactionsListComponent
   */
  public getExpandedIcon(node: FlatNodeTransaction): string {
    return this.treeControl.isExpanded(node) ? 'arrow-down-s-line' : 'arrow-right-s-line';
  }

  /**
   * Transactions label
   *
   * @param {number} item
   * @return {string}
   * @memberof TransactionsListComponent
   */
  public messageToDisplay(item: number): string {
    return item === 1 ? `${item} component changed from ` : `${item} components changed from `;
  }

  /**
   * Submit a single grouped transaction event
   *
   * @param {string} timestamp
   * @return {void}
   * @memberof TransactionsListComponent
   */
  public onSubmit(timestamp: string): void {
    this.submitTransaction.emit(timestamp);
  }

  /**
   * Commit all transactions event
   *
   * @return {void}
   * @memberof TransactionsListComponent
   */
  public commitAll(): void {
    this.commitAllTransactions.emit(true);
  }

  /**
   * Delete a single grouped transaction event
   *
   * @param {string} timestamp
   * @return {void}
   * @memberof TransactionsListComponent
   */
  public onReject(timestamp: string): void {
    this.transactionsFacade.deleteTransactions(timestamp);
  }

  /**
   * Delete all transactions event
   *
   * @return {void}
   * @memberof TransactionsListComponent
   */
  public deleteAll(): void {
    this.deleteAllTransactions.emit(true);
  }

  /**
   * Tree builder
   *
   * @private
   * @param {GroupedTransaction[]} transactions
   * @return {void}
   * @memberof TransactionsListComponent
   */
  private treeBuilder(transactions: GroupedTransaction[]): void {
    this.treeFlattener = new MatTreeFlattener<GroupedTransaction, FlatNodeTransaction>(
      this.transactionsFacade.transformer,
      this.transactionsFacade.level,
      this.transactionsFacade.isExpandable,
      this.transactionsFacade.children,
    );

    this.treeControl = new FlatTreeControl<FlatNodeTransaction>(
      this.transactionsFacade.level,
      this.transactionsFacade.isExpandable,
    );
    const dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    dataSource.data = transactions;
    this.dataSource = dataSource;
  }
}
