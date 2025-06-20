export interface SaleOfferQueryParameters {
  pageNumber: number;
  pageSize: number;
  minimalPrice?: number;
  maximumPrice?: number;
  itemConditionId?: number;
  modelId?: number;
  sizeId?: number;
  brandId?: number;
  productCategoryId?: number;
}

export const DefaultSaleOfferQueryParameters: SaleOfferQueryParameters = {
  pageNumber: 1,
  pageSize: 50,
};

export const SaleOffersQueryParamMapping: Record<
  keyof SaleOfferQueryParameters,
  string
> = {
  pageNumber: 'pn',
  pageSize: 'ps',
  minimalPrice: 'minp',
  maximumPrice: 'maxp',
  itemConditionId: 'icid',
  modelId: 'mid',
  sizeId: 'sid',
  brandId: 'bid',
  productCategoryId: 'pcid',
};
