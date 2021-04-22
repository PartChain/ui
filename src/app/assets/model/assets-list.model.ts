import { Asset } from '../../shared/model/asset.model';

/**
 *
 *
 * @export
 * @interface AssetsList
 */
export interface AssetsList {
  nextPage?: boolean;
  resultLength?: number;
  data: Asset[];
}

export /** @type {*} */
const fields = [
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
  'mspid',
  'customFields',
];
