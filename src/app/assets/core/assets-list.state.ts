import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { State } from 'src/app/shared/model/state';
import { View } from 'src/app/shared/model/view.model';
import { AssetFilter } from '../model/asset-filter.model';
import { Asset } from '../../shared/model/asset.model';
import { AssetsList } from '../model/assets-list.model';
import { AssetsToPatch } from '../model/assets-to-patch.model';
import { Export } from '../model/export.model';
import { Pagination } from '../model/pagination.model';
import { AssetsListAssembler } from './assets-list.assembler';

/**
 * Asset list state management
 *
 * @export
 * @class AssetsListState
 */
@Injectable()
export class AssetsListState {
  /**
   * Asset list state
   *
   * @private
   * @readonly
   * @type {State<View<AssetsList>>}
   * @memberof AssetsListState
   */
  private readonly assetsList$: State<View<AssetsList>> = new State<View<AssetsList>>({ loader: true });

  /**
   * Assets with no pagination state
   *
   * @private
   * @readonly
   * @type {State<AssetsList>}
   * @memberof AssetsListState
   */
  private readonly fullAssets$: State<AssetsList> = new State<AssetsList>(undefined);

  /**
   * Pagination state
   *
   * @private
   * @readonly
   * @type {State<Pagination>}
   * @memberof AssetsListState
   */
  private readonly pagination$: State<Pagination> = new State<Pagination>(undefined);

  /**
   * Selected rows state
   *
   * @private
   * @readonly
   * @type {State<Asset[]>}
   * @memberof AssetsListState
   */
  private readonly selectedRows$: State<Asset[]> = new State<Asset[]>([]);

  /**
   * Selected asset state
   *
   * @private
   * @readonly
   * @type {State<string>}
   * @memberof AssetsListState
   */
  private readonly selectedAsset$: State<string> = new State<string>('');

  /**
   * Total of assets state
   *
   * @private
   * @readonly
   * @type {State<number>}
   * @memberof AssetsListState
   */
  private readonly totalOfAssets$: State<number> = new State<number>(0);

  /**
   * Filters state
   *
   * @private
   * @readonly
   * @type {State<Array<{ key: string; value: string }>>}
   * @memberof AssetsListState
   */
  private readonly filters$: State<Array<{ key: string; value: string }>> = new State<
    Array<{ key: string; value: string }>
  >([]);

  /**
   * Loading state
   *
   * @private
   * @readonly
   * @type {State<boolean>}
   * @memberof AssetsListState
   */
  private readonly loading$: State<boolean> = new State<boolean>(false);

  /**
   * Assets list getter
   *
   * @readonly
   * @type {Observable<View<AssetsList>>}
   * @memberof AssetsListState
   */
  get getAssets$(): Observable<View<AssetsList>> {
    return this.assetsList$.observable;
  }

  /**
   *Full assets getter
   *
   * @readonly
   * @type {Observable<AssetsList>}
   * @memberof AssetsListState
   */
  get getFullAssets$(): Observable<AssetsList> {
    return this.fullAssets$.observable;
  }

  /**
   * Pagination getter
   *
   * @readonly
   * @type {Observable<Pagination>}
   * @memberof AssetsListState
   */
  get getPagination$(): Observable<Pagination> {
    return this.pagination$.observable;
  }

  /**
   * Selected rows getter
   *
   * @readonly
   * @type {Observable<Asset[]>}
   * @memberof AssetsListState
   */
  get getSelectedRows$(): Observable<Asset[]> {
    return this.selectedRows$.observable;
  }

  /**
   * Total of assets getter
   *
   * @readonly
   * @type {Observable<number>}
   * @memberof AssetsListState
   */
  get getTotalOfAssets$(): Observable<number> {
    return this.totalOfAssets$.observable;
  }

  /**
   * Selected asset getter
   *
   * @readonly
   * @type {Observable<string>}
   * @memberof AssetsListState
   */
  get getSelectedAsset$(): Observable<string> {
    return this.selectedAsset$.observable;
  }

  /**
   * Selected asset snapshot getter
   *
   * @readonly
   * @type {string}
   * @memberof AssetsListState
   */
  get getSelectedAssetSnapshot(): string {
    return this.selectedAsset$.snapshot;
  }

  /**
   * Filters getter
   *
   * @readonly
   * @type {Observable<Array<{ key: string; value: string }>>}
   * @memberof AssetsListState
   */
  get getFilters$(): Observable<Array<{ key: string; value: string }>> {
    return this.filters$.observable;
  }

  /**
   * Loading getter
   *
   * @readonly
   * @type {Observable<boolean>}
   * @memberof AssetsListState
   */
  get getLoading$(): Observable<boolean> {
    return this.loading$.observable;
  }

  /**
   * Assemble file to be exported
   *
   * @param {Export} exportData
   * @return {File}
   * @memberof AssetsListState
   */
  public getFileToExport(exportData: Export): File {
    return AssetsListAssembler.getFile(exportData);
  }

  /**
   * Assemble transactions to be committed
   *
   * @param {string} status
   * @return {{ slicedTransactions: Array<Transaction[]>; size: number }}
   * @memberof AssetsListState
   */
  public getTransactionsToCommit(status: string): { slicedTransactions: Array<AssetsToPatch[]>; size: number } {
    const selected: Asset[] = this.selectedRows$.snapshot;
    return AssetsListAssembler.getTransactionsToCommit(selected, status);
  }

  /**
   * Updates the assets list state
   *
   * @param {View<AssetsList>} assets
   * @return {void}
   * @memberof AssetsListState
   */
  public setAssets(assets: View<AssetsList>): void {
    this.assetsList$.update(assets);
  }

  /**
   * Updates the full assets list state
   *
   * @param {AssetsList} assets
   * @return {void}
   * @memberof AssetsListState
   */
  public setFullAssets(assets: AssetsList): void {
    this.fullAssets$.update(assets);
  }

  /**
   * Updates the pagination state
   *
   * @param {number} currentPage
   * @param {AssetsList} assets
   * @param {string} page
   * @return {void}
   * @memberof AssetsListState
   */
  public setPagination(currentPage: number, assets: AssetsList, page: string): void {
    const pagination: Pagination = this.pagination$.snapshot;
    const currentPagination = {
      firstPage: this.setInitialPage(currentPage, assets),
      nextPage: this.setNextPage(currentPage, pagination),
      previousPage: this.setPreviousPage(currentPage, pagination),
    };
    this.pagination$.update(currentPagination[page]);
  }

  /**
   * Updates the selected rows state
   *
   * @param {Asset[]} selectedRows
   * @return {void}
   * @memberof AssetsListState
   */
  public setSelectedRows(selectedRows: Asset[]): void {
    this.selectedRows$.update(selectedRows);
  }

  /**
   * Updates the total of assets state
   *
   * @param {number} total
   * @return {void}
   * @memberof AssetsListState
   */
  public setTotalOfAssets(total: number): void {
    this.totalOfAssets$.update(total);
  }

  /**
   * Updates the filters state
   *
   * @param {AssetFilter} filters
   * @param {{ dateFrom: string; dateTo: string }} dateRange
   * @return {void}
   * @memberof AssetsListState
   */
  public setFilters(filters: AssetFilter, dateRange: { dateFrom: string; dateTo: string }): void {
    const selectedFilters: { key: string; value: string }[] = AssetsListAssembler.assembleFilters(filters, dateRange);
    this.filters$.update(selectedFilters);
  }

  /**
   * Updates the selected asset state
   *
   * @param {string} selectedAsset
   * @return {void}
   * @memberof AssetsListState
   */
  public setSelectedAsset(selectedAsset: string): void {
    const previousValue: string = this.selectedAsset$.snapshot;
    if (selectedAsset !== previousValue) {
      this.selectedAsset$.update(selectedAsset);
    }
  }

  /**
   * Updates the loading state
   *
   * @param {boolean} loading
   * @return {void}
   * @memberof AssetsListState
   */
  public setLoading(loading: boolean): void {
    this.loading$.update(loading);
  }

  /**
   * Resets the assets list state to the initial value
   *
   * @return {void}
   * @memberof AssetsListState
   */
  public resetAssets(): void {
    this.assetsList$.reset();
  }

  /**
   * Resets the filters state to the initial value
   *
   * @return {void}
   * @memberof AssetsListState
   */
  public resetFilters(): void {
    this.filters$.reset();
  }

  /**
   * Resets the selected rows state to the initial value
   *
   * @return {void}
   * @memberof AssetsListState
   */
  public resetSelectedRows(): void {
    this.selectedRows$.reset();
  }

  /**
   * Assembles the initial page values
   *
   * @private
   * @param {number} currentPage
   * @param {AssetsList} assets
   * @return {Pagination}
   * @memberof AssetsListState
   */
  private setInitialPage(currentPage: number, assets: AssetsList): Pagination {
    return AssetsListAssembler.setInitialPagination(currentPage, assets);
  }

  /**
   * Assembles the next page values
   *
   * @private
   * @param {number} currentPage
   * @param {Pagination} pagination
   * @return {Pagination}
   * @memberof AssetsListState
   */
  private setNextPage(currentPage: number, pagination: Pagination): Pagination {
    if (pagination) {
      return AssetsListAssembler.nextPage(currentPage, pagination);
    }
  }

  /**
   * Assembles the previous page values
   *
   * @private
   * @param {number} currentPage
   * @param {Pagination} pagination
   * @return {Pagination}
   * @memberof AssetsListState
   */
  private setPreviousPage(currentPage: number, pagination: Pagination): Pagination {
    if (pagination) {
      return AssetsListAssembler.previousPage(currentPage, pagination);
    }
  }
}
