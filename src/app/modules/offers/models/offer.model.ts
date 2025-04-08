import { z as zod } from 'zod';

export const OfferSchema = zod.object({
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

export const OffeArraySchema = zod.array(OfferSchema);

export type OfferType = zod.infer<typeof OfferSchema>;
