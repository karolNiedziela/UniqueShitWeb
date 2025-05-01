export type CreateOfferDto = {
    topic: string;
    description: string;
    price: { amount: number; currency: string };
    offerTypeId: number;
    itemConditionId: number;
    modelId: number;
    sizeId: number;
    quantity: number;
  };
  
  export type OfferType = CreateOfferDto & { id: number };
  