export interface SaleOfferDetails {
  id: number;
  topic: string;
  description: string;
  brand: {
    id: number;
    name: string;
  };
  model: {
    id: number;
    name: string;
  };
  productCategory: {
    id: number;
    name: string;
  };
  price: {
    value: number;
    currency: string;
  };
  itemCondition: {
    id: number;
    name: string;
  };
  size: {
    id: number;
    value: string;
  };
  paymentType: {
    id: number;
    name: string;
  };
  deliveryType: {
    id: number;
    name: string;
  };
  quantity: number;
  user: {
    id: string;
    displayName: string;
  };
}
