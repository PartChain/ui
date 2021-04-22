import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api/api.service';
import { ApiServiceProperties } from '../../core/api/api.service.properties';
import { Transaction } from '../../transactions/model/transaction.model';
import { map, share, timeout } from 'rxjs/operators';
import { AssetFilter } from '../model/asset-filter.model';
import { Observable } from 'rxjs';
import { AssetsList } from '../model/assets-list.model';
import { ExportResponse } from '../model/export.model';
import { AssetsToPatch } from '../model/assets-to-patch.model';

/**
 *
 *
 * @export
 * @class AssetsListService
 */
@Injectable({
  providedIn: 'root',
})
export class AssetsListService {
  /**
   * @constructor AssetsListService DI.
   * @param {ApiService} apiService
   * @memberof AssetsListService
   */
  constructor(private apiService: ApiService) {}

  /**
   * Get all assets request
   *
   * @param {AssetFilter} filter
   * @param {number} pagination
   * @param {string[]} fields
   * @return {Observable<AssetsList>}
   * @memberof AssetsListService
   */
  public getAssets(filter: AssetFilter, pagination: number, fields: string[]): Observable<AssetsList> {
    return this.apiService
      .post<AssetsList>(ApiServiceProperties.laapi + 'off-hlf-db/get-asset-list', {
        filter,
        pagination,
        fields,
      })
      .pipe(share(), timeout(5 * 60 * 1000));
  }

  /**
   * Export data request
   *
   * @param {AssetFilter} filter
   * @param {string} reportType
   * @return {Observable<ExportResponse>}
   * @memberof AssetsListService
   */
  public exportData(filter: AssetFilter, reportType: string): Observable<ExportResponse> {
    return this.apiService.post<ExportResponse>(ApiServiceProperties.laapi + 'off-hlf-db/get-customs-report', {
      filter,
      reportType,
    });
  }

  /**
   * Commit all transactions request
   *
   * @param {Transaction[]} transactions
   * @return {Observable<Transaction[]>}
   * @memberof AssetsListService
   */
  public commitMultipleTransactions(
    transactions: AssetsToPatch[],
  ): Observable<{ failedList: Transaction[]; sucessList: Transaction[] }> {
    return this.apiService
      .post<{ data: { failedList: Transaction[]; sucessList: Transaction[] } }>(
        ApiServiceProperties.aems + 'transaction/CreateMultiple',
        transactions,
      )
      .pipe(map(transactions => transactions.data));
  }
}
