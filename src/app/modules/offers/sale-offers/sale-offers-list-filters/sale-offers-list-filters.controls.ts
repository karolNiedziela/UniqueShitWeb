export const SaleOfferListFiltersControlName = {
  ProductCategory: 'productCategory',
  Model: 'model',
  Brand: 'brand',
  Size: 'size',
  Colour: 'colour',
  ItemCondition: 'itemCondition',
} as const;

export type ControlNameType =
  (typeof SaleOfferListFiltersControlName)[keyof typeof SaleOfferListFiltersControlName];
