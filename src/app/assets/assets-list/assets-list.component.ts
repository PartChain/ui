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
import { AssetListTableBuilder } from './asset-list-table-builder';
import { AssetModel } from '../asset.model';
import { CustomsReportModel } from '../../vehicles/customs-report-modal/customs-report-model';
import { AssetService } from '../asset.service';
import { NotificationService } from '../../shared/notifications/notification.service';
import { FilterService } from '../../shared/assets-filter/filter.service';
import { AssetsFilterComponent } from '../../shared/assets-filter/assets-filter.component';
import { NotificationText } from '../../shared/notifications/notification-message/notification-text';
import { CustomsReportModalComponent } from '../../vehicles/customs-report-modal/customs-report-modal.component';
import { Table } from '../../shared/table/table';
import { AssetListResponseModel } from '../../core/api/api-response.model';
import { AssetFilterBodyModel } from '../../shared/assets-filter/asset-filter.model';
import { SharedService } from 'src/app/shared/shared.service';
import { Observable, Subject, EMPTY } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { UserModel } from 'src/app/core/user/user.model';
import { UserService } from 'src/app/core/user/user.service';

/**
 *
 *
 * @export
 * @class AssetsListComponent
 * @implements {OnInit}
 * @implements {AfterViewInit}
 * @implements {OnDestroy}
 * @implements {AfterViewChecked}
 */
@Component({
  selector: 'app-assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AssetsListComponent implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked {
  /**
   * Query type
   *
   * @type {string}
   * @memberof AssetsListComponent
   */
  @Input() queryType: string;

  /**
   * Fields required to get all the asset list information from the api
   *
   * @type {string[]}
   * @memberof AssetsListComponent
   */
  public assetFields = [
    'manufacturer',
    'partNameManufacturer',
    'partNumberCustomer',
    'partNumberManufacturer',
    'productionCountryCodeManufacturer',
    'productionDateGmt',
    'qualityHash',
    'qualityStatus',
    'serialNumberCustomer',
    'serialNumberManufacturer',
    'status',
    'manufacturerLine',
    'manufacturerPlant',
    'serialNumberType',
  ];

  /**
   * List of all assets
   *
   * @type {AssetModel[]}
   * @memberof AssetsListComponent
   */
  public assetsList: AssetModel[];

  /**
   * Customs Report data
   *
   * @type {CustomsReportModel}
   * @memberof AssetsListComponent
   */
  public customsReport: CustomsReportModel = {} as CustomsReportModel;

  /**
   * Filter form
   *
   * @type {FormGroup}
   * @memberof AssetsListComponent
   */
  public form: FormGroup;

  /**
   * Number of selected filters
   *
   * @type {*} []
   * @memberof AssetsListComponent
   */
  public selectedFilters = [];

  /**
   * Number of selected rows
   *
   * @type {AssetModel[]}
   * @memberof AssetsListComponent
   */
  public selectedRows: AssetModel[] = [];

  /**
   * Table selected asset
   *
   * @type {string}
   * @memberof AssetsListComponent
   */
  public selectedAsset = undefined;

  /**
   * Asset table
   *
   * @type {Table}
   * @memberof AssetsListComponent
   */
  public assetTable: Table;

  /**
   * Flag to clear the selected rows
   *
   * @type {boolean}
   * @memberof AssetsListComponent
   */
  public removeSelectedRows = false;

  /**
   * Current page
   *
   * @type {number}
   * @memberof AssetsListComponent
   */
  public currentPage = 1;

  /**
   * Page size
   *
   * @type {number}
   * @memberof AssetsListComponent
   */
  public pageSize = 0;

  /**
   * Total of assets
   *
   * @type {number}
   * @memberof AssetsListComponent
   */
  public totalOfAssets = 0;

  /**
   * Page index
   *
   * @type {number}
   * @memberof AssetsListComponent
   */
  public pageIndex = 0;

  /**
   * Number of assets on the current page
   *
   * @type {number}
   * @memberof AssetsListComponent
   */
  public pageLength = 0;

  /**
   * Org preferences
   *
   * @type {UserModel}
   * @memberof AssetsListComponent
   */
  public org: UserModel = {} as UserModel;

  /**
   * Page title
   *
   * @return {string}
   * @memberof AssetsListComponent
   */
  public title = '';

  /**
   * Page route
   *
   * @return {string}
   * @memberof AssetsListComponent
   */
  public route = '';

  /**
   * Asset List
   *
   * @type {Observable<AssetListResponseModel>}
   * @memberof AssetsListComponent
   */
  public assets$: Observable<AssetListResponseModel> = this.getAssets(
    this.assetService.getFilter(this.router),
    this.currentPage,
    this.assetFields,
  ).pipe(
    tap((assets: AssetListResponseModel) => {
      this.paginationInit(assets);
    }),
  );

  /**
   * Total of assets loading state
   *
   * @type {boolean}
   * @memberof AssetsListComponent
   */
  public isTotalLoading = false;

  /**
   * Error message handler
   *
   * @private
   * @type {Subject<string>}
   * @memberof AssetsListComponent
   */
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  /**
   * @constructor AssetsListComponent.
   * @param {AssetService} assetService
   * @param {NotificationService} notificationService
   * @param {MatDialog} dialog
   * @param {FilterService} filterService
   * @param {SharedService} sharedService
   * @param {ChangeDetectorRef} changeDetector
   * @param {Router} router
   * @param {UserService} userService
   * @memberof AssetsListComponent
   */
  constructor(
    private assetService: AssetService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private filterService: FilterService,
    private sharedService: SharedService,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private userService: UserService,
  ) {
    this.form = this.filterService.getDefaultForm();
    this.subscribeToRowClick();
    this.org = this.userService.getOrgPreferences();
    this.route = this.router.url
      .split('/')
      .slice(-1)
      .toString();
  }

  /**
   * Angular lifecycle method - On Init
   *
   * @return {void}
   * @memberof AssetsListComponent
   */
  ngOnInit(): void {
    this.isTotalLoading = true;
    this.title = this.getTitleName();
    this.clearChips();
    this.form.controls.productionDateFrom.setValue(this.sharedService.getPastDays(31));
    this.form.controls.productionDateTo.setValue(this.sharedService.setTodayDate());
    this.addFilterChips(this.filterService.getModalFilters(this.form, this.queryType));
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
   * Angular lifecycle method - After view init
   *
   * @return {void}
   * @memberof AssetsListComponent
   */
  ngAfterViewInit(): void {
    this.detectScreenSize();
  }

  /**
   * Angular lifecycle method - On Destroy
   *
   * @return {void}
   * @memberof AssetsListComponent
   */
  ngOnDestroy(): void {
    this.form.reset(this.filterService.getDefaultForm());
    this.selectedRows = [];
  }

  /**
   * Window resize listener
   *
   * @return {void}
   * @memberof AssetsListComponent
   */
  @HostListener('window:resize', [])
  private onResize(): void {
    this.detectScreenSize();
  }

  /**
   * Close sidebar
   *
   * @return {void}
   * @memberof AssetsListComponent
   */
  public closeSideBar(): void {
    this.selectedAsset = undefined;
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
          this.filterService.isEndDateMissing(form);
          this.clearChips();
          this.addFilterChips(this.filterService.getModalFilters(this.form, this.queryType));
          this.isTotalLoading = true;
          this.assets$ = this.getAssets(
            this.filterService.getModalFilters(this.form, this.queryType),
            this.currentPage,
            this.assetFields,
          ).pipe(
            tap((assets: AssetListResponseModel) => {
              this.paginationInit(assets);
            }),
          );
        },
        clear: () => {
          this.clearChips();
          form.reset(this.filterService.getDefaultForm().value);
        },
      },
      panelClass: 'custom-dialog-container',
    });
  }

  /**
   * Row click subscription
   *
   * @return {void}
   * @memberof AssetsListComponent
   */
  public subscribeToRowClick(): void {
    this.assetService.selectedAssetUUID$.subscribe((serialNumber: any) => {
      serialNumber ? (this.selectedAsset = serialNumber) : (this.selectedAsset = undefined);
    });
  }

  /**
   * Load next page request
   *
   * @param {boolean} event
   * @return {void}
   * @memberof AssetsListComponent
   */
  public loadNextPage(event: boolean): void {
    this.currentPage++;
    if (event) {
      this.assets$ = this.getAssets(
        this.filterService.getModalFilters(this.form, this.queryType),
        this.currentPage,
        this.assetFields,
      );
      this.nextPage();
    }
  }

  /**
   * Load previous page request
   *
   * @param {boolean} event
   * @return {void}
   * @memberof AssetsListComponent
   */
  public loadPreviousPage(event: boolean): void {
    if (event) {
      this.currentPage--;
      this.assets$ = this.getAssets(
        this.filterService.getModalFilters(this.form, this.queryType),
        this.currentPage,
        this.assetFields,
      );
      this.previousPage();
    }
  }

  /**
   * Selected rows event
   *
   * @param {AssetModel[]} event
   * @return {void}
   * @memberof AssetsListComponent
   */
  public getSelectedRows(event: AssetModel[]): void {
    this.selectedRows = event;
  }

  /**
   * Header selected output - Gets the total of assets filtered
   *
   * @param {AssetModel[]} event
   * @return {void}
   * @memberof AssetsListComponent
   */
  public getSelectedAssets(event: AssetModel[]): void {
    this.assetsList = event;
  }

  /**
   * Clears row selection
   *
   * @return {void}
   * @memberof AssetsListComponent
   */
  public clearSelection(): void {
    this.selectedRows = [];
    this.removeSelectedRows = true;
  }

  /**
   * Customs report modal
   *
   * @return {void}
   * @memberof AssetsListComponent
   */
  public openModal(): void {
    this.customsReport.filter = this.filterService.getModalFilters(this.form, this.queryType);
    this.customsReport.numberOfValues = this.totalOfAssets;
    this.dialog.open(CustomsReportModalComponent, {
      height: '270px',
      width: '400px',
      data: this.customsReport,
      panelClass: 'custom-dialog-container',
    });
  }

  /**
   * Export data event
   *
   * @param {string} reportType
   * @return {void}
   * @memberof AssetsListComponent
   */
  public exportData(reportType: string): void {
    const filter = this.filterService.getModalFilters(this.form, this.queryType);
    this.notificationService.info(NotificationText.PreparingToDownload);
    this.assetService.exportData(filter, reportType, this.queryType);
  }

  /**
   * Change multiple assets event
   *
   * @param {AssetModel[]} selected
   * @param {string} status
   * @return {void}
   * @memberof AssetsListComponent
   */
  public changeStatus(selected: AssetModel[], status: string): void {
    if (!!this.assetsList && this.assetsList.length > 25) {
      selected = this.assetsList;
    }
    this.assetService.setTransactionsToCommit(selected, status, true);
  }

  /**
   * Get assets request
   *
   * @private
   * @param {*} filter
   * @param {number} pagination
   * @param {string[]} fields
   * @return {Observable<AssetListResponseModel>}
   * @memberof AssetsListComponent
   */
  private getAssets(filter: any, pagination: number, fields: string[]): Observable<AssetListResponseModel> {
    return this.assetService.getAssets(filter, pagination, fields).pipe(
      tap(() => {
        this.detectScreenSize();
        this.isTotalLoading = false;
      }),
      catchError(err => {
        this.errorMessageSubject.next(err);
        this.notificationService.error(err);
        this.isTotalLoading = false;
        return EMPTY;
      }),
    );
  }

  /**
   * On init page setter
   *
   * @private
   * @param {AssetListResponseModel} assets
   * @return {void}
   * @memberof AssetsListComponent
   */
  private paginationInit(assets: AssetListResponseModel): void {
    this.pageIndex = 1;
    this.pageSize = assets.data.length;
    typeof assets.resultLength === 'undefined' ? (this.totalOfAssets = 0) : (this.totalOfAssets = assets.resultLength);
    this.pageLength = assets.data.length;
  }

  /**
   * Next page setter
   *
   * @private
   * @return {void}
   * @memberof AssetsListComponent
   */
  private nextPage(): void {
    if (this.totalOfAssets - this.pageSize < this.pageLength) {
      this.pageSize = this.totalOfAssets;
      this.pageIndex = this.pageIndex + this.pageLength;
    } else {
      this.pageIndex = this.pageSize + 1;
      this.pageSize = this.pageSize + this.pageLength;
    }
  }

  /**
   * Previous page setter
   *
   * @private
   * @return {void}
   * @memberof AssetsListComponent
   */
  private previousPage(): void {
    if (this.pageSize === this.totalOfAssets) {
      this.pageSize = this.pageIndex - 1;
      this.pageIndex = this.pageIndex - this.pageLength;
    } else {
      this.pageSize = this.pageSize - this.pageLength;
      this.pageIndex = this.pageIndex - this.pageLength;
    }
  }

  /**
   * Detects screen resize
   *
   * @private
   * @return {void}
   * @memberof AssetsListComponent
   */
  private detectScreenSize(): void {
    if ((window.innerWidth < 1200 && !!this.assetTable) || (this.selectedAsset && window.innerWidth < 1600)) {
      this.assetTable = AssetListTableBuilder.getMobileScreenTable();
    } else {
      this.assetTable = AssetListTableBuilder.getTable();
    }
  }

  /**
   * Filters displayed
   *
   * @private
   * @param {AssetFilterBodyModel} filters
   * @return {void}
   * @memberof AssetsListComponent
   */
  private addFilterChips(filters: AssetFilterBodyModel): void {
    delete filters.type;
    filters.productionDateTo.value = this.sharedService.formatDate(filters.productionDateTo.value);
    filters.productionDateFrom.value = this.sharedService.formatDate(filters.productionDateFrom.value);
    filters.productionDateTo.value = `${filters.productionDateFrom.value} to ${filters.productionDateTo.value}`;
    delete filters.productionDateFrom;
    Object.values(filters).forEach((filter: { key: string; value: string }) => {
      this.selectedFilters.push(filter.value);
    });
  }

  /**
   * Clear filters
   *
   * @private
   * @return {void}
   * @memberof AssetsListComponent
   */
  private clearChips(): void {
    this.selectedFilters.splice(0, this.selectedFilters.length);
  }

  /**
   * Gets page title
   *
   * @private
   * @return {string}
   * @memberof AssetsListComponent
   */
  private getTitleName(): string {
    return this.queryType === 'own'
      ? this.userService.getOrgPreferences().assetsTile
      : this.userService.getOrgPreferences().componentsTile;
  }
}
