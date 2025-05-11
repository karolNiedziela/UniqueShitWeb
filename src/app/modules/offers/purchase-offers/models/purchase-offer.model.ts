/** preparation for purchase offers
import { z as zod } from 'zod';

export const PurchaseOfferSchema = zod.object({
  id: zod.number(),
  topic: zod.string(),
  description: zod.string(),
  modelId: zod.number(),
});

export const PurchaseOfferArraySchema = zod.array(PurchaseOfferSchema);

export type PurchaseOfferType = zod.infer<typeof PurchaseOfferSchema>; 
**/
