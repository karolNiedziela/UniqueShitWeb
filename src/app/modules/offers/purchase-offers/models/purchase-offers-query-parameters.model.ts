export interface OfferQueryParameters {
  pageNumber: number;
  pageSize: number;
  modelId?: number;
  brandId?: number;
   userId?: string;
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
  modelId: 'mid',
  brandId: 'bid',
  userId: 'uid',
};
