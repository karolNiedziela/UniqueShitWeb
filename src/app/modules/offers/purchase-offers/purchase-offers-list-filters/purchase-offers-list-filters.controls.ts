export const PurchaseOffersListFiltersControlName = {
  Brand: 'brand',
  Model: 'model',
} as const;


export type ControlNameType =
  (typeof PurchaseOffersListFiltersControlName)[keyof typeof PurchaseOffersListFiltersControlName];
