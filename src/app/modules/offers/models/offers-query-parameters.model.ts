export interface OfferQueryParameters {
  offerTypeId: number;
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
  offerTypeId: 1,
  pageNumber: 1,
  pageSize: 50,
};

export const OffersQueryParamMapping: Record<
  keyof OfferQueryParameters,
  string
> = {
  offerTypeId: 'otid',
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
