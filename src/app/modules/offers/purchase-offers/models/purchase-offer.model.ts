import { z as zod } from 'zod';

export const PurchaseOfferSchema = zod.object({
  id: zod.number(),
  topic: zod.string(),
  description: zod.string(),
  model: zod.object({
    id: zod.number(),
    name: zod.string(),
  }),
});

export const SaleOfferArraySchema = zod.array(PurchaseOfferSchema)

export type PurchaseOfferType = zod.infer<typeof PurchaseOfferSchema>;

