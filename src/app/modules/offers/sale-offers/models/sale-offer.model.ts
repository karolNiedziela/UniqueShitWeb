import { z as zod } from 'zod';

export const SaleOfferSchema = zod.object({
  id: zod.number(),
  topic: zod.string(),
  brand: zod.object({
    id: zod.number(),
    name: zod.string(),
  }),
  price: zod.object({
    value: zod.string(),
    currency: zod.string(),
  }),
  itemCondition: zod.object({
    id: zod.number(),
    name: zod.string(),
  }),
  model: zod.object({
    id: zod.number(),
    name: zod.string(),
  }),
  quantity: zod.number(),
});

export const SaleOfferArraySchema = zod.array(SaleOfferSchema);

export type SaleOfferType = zod.infer<typeof SaleOfferSchema>;
