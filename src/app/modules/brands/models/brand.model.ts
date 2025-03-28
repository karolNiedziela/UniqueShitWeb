import { z as zod } from 'zod';

export const BrandSchema = zod.object({
  id: zod.number(),
  name: zod.string(),
});

export const BrandArraySchema = zod.array(BrandSchema);

export type BrandType = zod.infer<typeof BrandSchema>;
