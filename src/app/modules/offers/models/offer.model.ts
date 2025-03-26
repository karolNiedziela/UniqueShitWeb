export interface OfferModel {
  id: number;
  topic: string;
  brand: {
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
  model: {
    id: number;
    name: string;
  };
  quantity: number;
}
