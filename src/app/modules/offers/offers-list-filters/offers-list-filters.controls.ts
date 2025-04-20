export const OfferListFiltersControlName = {
  ProductCategory: 'productCategory',
  Model: 'model',
  Brand: 'brand',
  Size: 'size',
  Colour: 'colour',
  ItemCondition: 'itemCondition',
} as const;

export type ControlNameType =
  (typeof OfferListFiltersControlName)[keyof typeof OfferListFiltersControlName];
