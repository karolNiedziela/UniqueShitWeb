import { z as zod } from 'zod';

export const ModelSchema = zod.object({
  id: zod.number(),
  name: zod.string(),
  productCategoryId: zod.number(),
  brandId: zod.number(),
});

export const ModelArraySchema = zod.array(ModelSchema);

export type ModelType = zod.infer<typeof ModelSchema>;
