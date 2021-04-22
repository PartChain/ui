import { AssetsToPatch } from '../model/assets-to-patch.model';
import { Asset } from '../../shared/model/asset.model';
import { Export } from '../model/export.model';
import { Pagination } from '../model/pagination.model';
import { AssetFilter } from '../model/asset-filter.model';
import { AssetsList } from '../model/assets-list.model';

/**
 *
 *
 * @export
 * @class AssetsListAssembler
 */
export class AssetsListAssembler {
  /**
   * Creating a proper file to be exported
   *
   * @static
   * @param {Export} exportData
   * @return {File}
   * @memberof AssetsListAssembler
   */
  public static getFile(exportData: Export): File {
    const report = {
      listDataExcel: {
        TYPE: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
        EXTENSION: '.xlsx',
      },
      customsReportExcel: {
        TYPE: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
        EXTENSION: '.xlsx',
      },
      listDataPlainCSV: {
        TYPE: 'application/zip',
        EXTENSION: '.zip',
      },
      customsReportCSV: {
        TYPE: 'application/zip',
        EXTENSION: '.zip',
      },
    };
    const { buffer, reportType, fileName } = exportData;
    const parts: Uint8Array = new Uint8Array(buffer);
    const data: Blob = new Blob([parts], { type: report[reportType].TYPE });
    return new File([data], fileName + '_export_' + new Date().getTime() + report[reportType].EXTENSION);
  }

  /**
   * The data needs to be sliced due to the limit of assets which we can commit
   *
   * @static
   * @param {Asset[]} selected
   * @param {string} status
   * @return {{ slicedTransactions: Array<AssetsToPatch[]>; size: number }}
   * @memberof AssetsListAssembler
   */
  public static getTransactionsToCommit(
    selected: Asset[],
    status: string,
  ): { slicedTransactions: Array<AssetsToPatch[]>; size: number } {
    const limit = 900;
    const size: number = Math.ceil(selected.length / limit);
    const chunkedArray: Array<AssetsToPatch[]> = selected.reduce((acc, asset: Asset, length: number) => {
      const chunkIndex: number = Math.floor(length / limit);
      if (!acc[chunkIndex]) {
        acc[chunkIndex] = [];
      }
      const committedAssets: AssetsToPatch = this.createTransactionObject(asset, status);
      acc[chunkIndex].push(committedAssets);
      return acc;
    }, []);
    return { slicedTransactions: chunkedArray, size };
  }

  /**
   * Assembling the initial value for the pagination
   *
   * @static
   * @param {number} currentPage
   * @param {AssetsList} assets
   * @return {Pagination}
   * @memberof AssetsListAssembler
   */
  public static setInitialPagination(currentPage: number, assets: AssetsList): Pagination {
    return {
      currentPage,
      pageIndex: currentPage,
      pageSize: assets.data.length,
      pageLength: assets.data.length,
      total: typeof assets.resultLength === 'undefined' ? 0 : assets.resultLength,
    };
  }

  /**
   * We need to increase by the page limit unless the total value is smaller
   *
   * @static
   * @param {number} currentPage
   * @param {Pagination} pagination
   * @return {Pagination}
   * @memberof AssetsListAssembler
   */
  public static nextPage(currentPage: number, pagination: Pagination): Pagination {
    const { pageIndex, pageSize, pageLength, total } = pagination;
    return {
      currentPage,
      pageIndex: total - pageSize < pageLength ? pageIndex + pageLength : pageSize + 1,
      pageSize: total - pageSize < pageLength ? total : pageSize + pageLength,
      total,
      pageLength,
    };
  }

  /**
   * We need to decrease by the page limit unless the total value equals the page size
   *
   * @static
   * @param {number} currentPage
   * @param {Pagination} pagination
   * @return {Pagination}
   * @memberof AssetsListAssembler
   */
  public static previousPage(currentPage: number, pagination: Pagination): Pagination {
    const { pageIndex, pageSize, pageLength, total } = pagination;
    return {
      currentPage,
      pageIndex: pageIndex - pageLength,
      pageSize: pageSize === total ? pageIndex - 1 : pageSize - pageLength,
      total,
      pageLength,
    };
  }

  /**
   * Creating a key value pair filter for the table tags
   *
   * @static
   * @param {AssetFilter} filters
   * @param {{ dateFrom: string; dateTo: string }} dateRange
   * @return {Array<{ key: string; value: string }>}
   * @memberof AssetsListAssembler
   */
  public static assembleFilters(
    filters: AssetFilter,
    dateRange: { dateFrom: string; dateTo: string },
  ): Array<{ key: string; value: string }> {
    const selectedFilters: Array<{ key: string; value: string }> = [];
    delete filters.type;
    filters.productionDateTo.value = dateRange.dateTo;
    filters.productionDateFrom.value = dateRange.dateFrom;
    for (const filter in filters) {
      if (filters[filter].value !== '') {
        selectedFilters.push({ key: filter, value: filters[filter].value });
      }
    }
    return selectedFilters;
  }

  /**
   * Before committing multiple assets we must define the proper object schema
   *
   * @private
   * @static
   * @param {Asset} asset
   * @param {string} status
   * @return {AssetsToPatch}
   * @memberof AssetsListAssembler
   */
  private static createTransactionObject(asset: Asset, status: string): AssetsToPatch {
    return {
      propertyName: 'qualityStatus',
      propertyOldValue: asset.qualityStatus,
      serialNumberCustomer: asset.serialNumberCustomer,
      propertyNewValue: status,
    };
  }
}
