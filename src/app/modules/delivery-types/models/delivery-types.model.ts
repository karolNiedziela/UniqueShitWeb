import { z as zod } from 'zod';

export const DeliveryTypeSchema = zod.object({
  id: zod.number(),
  name: zod.string(),
});

export const DeliveryTypeArraySchema = zod.array(DeliveryTypeSchema);

export type DeliveryType = zod.infer<typeof DeliveryTypeSchema>;