import { z as zod } from 'zod';

export const ItemCondtionSchema = zod.object({
  id: zod.number(),
  name: zod.string(),
});

export const ItemCondtionArraySchema = zod.array(ItemCondtionSchema);

export type ItemConditionType = zod.infer<typeof ItemCondtionSchema>;
