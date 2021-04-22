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

import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AssetListTableBuilder } from '../../model/asset-list-table-builder';
import { Asset } from '../../../shared/model/asset.model';
import { AssetsFilterComponent } from './assets-filter/assets-filter.component';
import { Table } from '../../../shared/components/table/table';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Realm } from 'src/app/core/model/realm.model';
import { AssetsListFacade } from '../../abstraction/assets-list.facade';
import { Pagination } from '../../model/pagination.model';
import { AssetsList } from '../../model/assets-list.model';
import { View } from 'src/app/shared/model/view.model';

/**
 *
 *
 * @export
 * @class AssetsListComponent
 * @implements {OnInit}
 * @implements {AfterViewInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AssetsListComponent implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked {
  /**
   * Query type (own / other)
   *
   * @type {string}
   * @memberof AssetsListComponent
   */
  @Input() queryType: string;

  /**
   * Filter form group
   *
   * @type {FormGroup}
   * @memberof AssetsListComponent
   */
  public form: FormGroup;

  /**
   * Asset list table schema
   *
   * @type {Table}
   * @memberof AssetsListComponent
   */
  public assetTable: Table;

  /**
   * Flag to handle the selected row events from child components
   *
   * @type {boolean}
   * @memberof AssetsListComponent
   */
  public removeSelectedRows: boolean;

  /**
   * Counter to handle pagination requests
   *
   * @type {number}
   * @memberof AssetsListComponent
   */
  public currentPage: number;

  /**
   * Gets the proper org labeling for each route
   *
   * @type {Realm}
   * @memberof AssetsListComponent
   */
  public org: Realm;

  /**
   * Page title
   *
   * @type {string}
   * @memberof AssetsListComponent
   */
  public title: string;

  /**
   * Page route
   *
   * @type {string}
   * @memberof AssetsListComponent
   */
  public route: string;

  /**
   * Asset list state
   *
   * @type {Observable<View<AssetsList>>}
   * @memberof AssetsListComponent
   */
  public assets$: Observable<View<AssetsList>>;

  /**
   * Asset list state (with no pagination)
   *
   * @type {Observable<AssetsList>}
   * @memberof AssetsListComponent
   */
  public fullAssets$: Observable<AssetsList>;

  /**
   * Selected asset state
   *
   * @type {Observable<string>}
   * @memberof AssetsListComponent
   */
  public selectedAsset$: Observable<string>;

  /**
   * Pagination state
   *
   * @type {Observable<Pagination>}
   * @memberof AssetsListComponent
   */
  public pagination$: Observable<Pagination>;

  /**
   * Selected rows state
   *
   * @type {Observable<Asset[]>}
   * @memberof AssetsListComponent
   */
  public selectedRows$: Observable<Asset[]>;

  /**
   * Total of assets state
   *
   * @type {Observable<number>}
   * @memberof AssetsListComponent
   */
  public totalOfAssets$: Observable<number>;

  /**
   * Filters state
   *
   * @type {Observable<Array<{ key: string; value: string }>>}
   * @memberof AssetsListComponent
   */
  public filters$: Observable<Array<{ key: string; value: string }>>;

  /**
   * Loading state
   *
   * @type {Observable<boolean>}
   * @memberof AssetsListComponent
   */
  public loading$: Observable<boolean>;

  /**
   * @constructor AssetsListComponent
   * @param {MatDialog} dialog
   * @param {Router} router
   * @param {AssetsListFacade} assetsFacade
   * @param {ChangeDetectorRef} changeDetector
   * @memberof AssetsListComponent
   */
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private assetsFacade: AssetsListFacade,
    private changeDetector: ChangeDetectorRef,
  ) {
    this.currentPage = 1;
    this.removeSelectedRows = false;
    this.form = this.assetsFacade.getDefaultForm();
    this.org = this.assetsFacade.getOrgPreferences();
    this.route = this.router.url
      .split('/')
      .slice(-1)
      .toString();
    this.assets$ = this.assetsFacade.assets$.pipe(
      tap(() => {
        this.detectScreenSize();
      }),
    );
    this.pagination$ = this.assetsFacade.pagination$;
    this.totalOfAssets$ = this.assetsFacade.totalOfAssets$;
    this.filters$ = this.assetsFacade.filters$;
    this.selectedRows$ = this.assetsFacade.selectedRows$;
    this.selectedAsset$ = this.assetsFacade.selectedAsset$;
    this.loading$ = this.assetsFacade.loading$;
    this.fullAssets$ = this.assetsFacade.fullAssets$;
  }

  /**
   * Angular lifecycle - Ng On Init
   *
   * @return {void}
   * @memberof AssetsListComponent
   */
  ngOnInit(): void {
    this.title = this.getTitleName();
    const filter = this.assetsFacade.getInitialFilter(this.router);
    this.form.controls.productionDateFrom.setValue(filter.productionDateFrom.value);
    this.form.controls.productionDateTo.setValue(filter.productionDateTo.value);
    this.assetsFacade.setFilters(this.assetsFacade.getFilter(this.form, this.queryType));
    this.assetsFacade.setAssets(filter, this.currentPage, 'firstPage');
  }

  /**
   * Angular lifecycle - Ng After View Init
   *
   * @return {void}
   * @memberof AssetsListComponent
   */
  ngAfterViewInit(): void {
    this.detectScreenSize();
  }

  /**
   * Angular lifecycle method - After view checked
   *
   * @return {void}
   * @memberof AssetsListComponent
   */
  ngAfterViewChecked(): void {
    // The change detector is called to fix a 'ExpressionChangedAfterItHasBeenCheckedError' bug
    // This happens because we receive a selected row event and set a variable in this component with those values
    // That triggers a button display and a component display which causes a bug.
    // The values changed before the component checks the current value
    this.changeDetector.detectChanges();
  }

  /**
   * Angular lifecycle - Ng On Destroy
   *
   * @return {void}
   * @memberof AssetsListComponent
   */
  ngOnDestroy(): void {
    this.assetsFacade.resetAssets();
    this.assetsFacade.resetSelectedRows();
    this.assetsFacade.resetFilters();
    this.form.reset(this.assetsFacade.getDefaultForm());
  }

  /**
   * Resize window listener
   *
   * @private
   * @return {void}
   * @memberof AssetsListComponent
   */
  @HostListener('window:resize', [])
  private onResize(): void {
    this.detectScreenSize();
  }

  /**
   * Close sidebar event
   *
   * @return {void}
   * @memberof AssetsListComponent
   */
  public closeSideBar(): void {
    this.assetsFacade.setSelectedAsset(undefined);
    this.detectScreenSize();
  }

  /**
   * Open filter event
   *
   * @return {void}
   * @memberof AssetsListComponent
   */
  public openFilter(): void {
    const form: FormGroup = this.form;
    this.dialog.open(AssetsFilterComponent, {
      data: {
        type: this.getTitleName(),
        form,
        cb: () => {
          this.assetsFacade.getMissingDate(form);
          this.assetsFacade.resetFilters();
          this.assetsFacade.setFilters(this.assetsFacade.getFilter(this.form, this.queryType));
          this.assetsFacade.setSelectedRows([]);
          this.assetsFacade.setAssets(
            this.assetsFacade.getFilter(this.form, this.queryType),
            this.currentPage,
            'firstPage',
          );
        },
        clear: () => {
          this.assetsFacade.resetFilters();
          form.reset(this.assetsFacade.getDefaultForm().value);
        },
      },
      panelClass: 'custom-dialog-container',
    });
  }

  /**
   * Next page event
   *
   * @param {boolean} event
   * @return {void}
   * @memberof AssetsListComponent
   */
  public loadNextPage(event: boolean): void {
    this.assetsFacade.setSelectedRows([]);
    this.currentPage++;
    if (event) {
      this.assetsFacade.setAssets(this.assetsFacade.getFilter(this.form, this.queryType), this.currentPage, 'nextPage');
    }
  }

  /**
   * Previous page event
   *
   * @param {boolean} event
   * @return {void}
   * @memberof AssetsListComponent
   */
  public loadPreviousPage(event: boolean): void {
    this.assetsFacade.setSelectedRows([]);
    this.currentPage--;
    if (event) {
      this.assetsFacade.setAssets(
        this.assetsFacade.getFilter(this.form, this.queryType),
        this.currentPage,
        'previousPage',
      );
    }
  }

  /**
   * Get selected rows event
   *
   * @param {Asset[]} event
   * @return {void}
   * @memberof AssetsListComponent
   */
  public getSelectedRows(event: Asset[]): void {
    this.assetsFacade.setSelectedRows(event);
    this.removeSelectedRows = false;
  }

  /**
   * Get all assets with no pagination event
   *
   * @param {Asset[]} event
   * @return {void}
   * @memberof AssetsListComponent
   */
  public getAllAssets(event: Asset[]): void {
    if (event) {
      this.assetsFacade.setAssets(this.assetsFacade.getFilter(this.form, this.queryType), -1);
    }
  }

  /**
   * Clear table selection event
   *
   * @return {void}
   * @memberof AssetsListComponent
   */
  public clearSelection(): void {
    this.assetsFacade.setSelectedRows([]);
    this.removeSelectedRows = true;
  }

  /**
   * Export data event
   *
   * @param {string} reportType
   * @return {void}
   * @memberof AssetsListComponent
   */
  public exportData(reportType: string): void {
    const filter = this.assetsFacade.getFilter(this.form, this.queryType);
    this.assetsFacade.exportFile(filter, reportType, this.queryType);
  }

  /**
   * Change status event
   *
   * @param {string} status
   * @return {void}
   * @memberof AssetsListComponent
   */
  public changeStatus(status: string): void {
    this.assetsFacade.commitMultipleTransactions(status);
  }

  /**
   * Helper method to rebuild the table for mobile size screens
   *
   * @private
   * @return {void}
   * @memberof AssetsListComponent
   */
  private detectScreenSize(): void {
    const selectedAsset = this.assetsFacade.selectedAssetSnapshot$;
    if ((window.innerWidth < 1200 && !!this.assetTable) || (selectedAsset && window.innerWidth < 1600)) {
      this.assetTable = AssetListTableBuilder.getMobileScreenTable();
    } else {
      this.assetTable = AssetListTableBuilder.getTable();
    }
  }

  /**
   * Gets the proper title depending on route
   *
   * @private
   * @return {string}
   * @memberof AssetsListComponent
   */
  private getTitleName(): string {
    return this.queryType === 'own'
      ? this.assetsFacade.getOrgPreferences().assetsTile
      : this.assetsFacade.getOrgPreferences().componentsTile;
  }
}
