export type CreateSaleOfferDto = {
  topic: string;
  description: string;
  price: { amount: number; currency: string };
  itemConditionId: number;
  modelId: number;
  sizeId: number;
  quantity: number;
};
