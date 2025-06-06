import { z as zod } from 'zod';

export const PurchaseOfferSchema = zod.object({
  id: zod.number(),
  description: zod.string(),
  model: zod.object({
    id: zod.number(),
    name: zod.string(),
  }),
  user: zod.object({
    id: zod.string(),
    displayName: zod.string(),
  }),
});

export const SaleOfferArraySchema = zod.array(PurchaseOfferSchema);

export type PurchaseOfferType = zod.infer<typeof PurchaseOfferSchema>;
