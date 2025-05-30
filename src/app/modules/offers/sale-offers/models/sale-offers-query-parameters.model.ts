export interface OfferQueryParameters {
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

export const DefaultOfferQueryParameters: OfferQueryParameters = {
  pageNumber: 1,
  pageSize: 50,
};

export const OffersQueryParamMapping: Record<
  keyof OfferQueryParameters,
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
