import { z as zod } from 'zod';

export const ProductCategorySchema = zod.object({
  id: zod.number(),
  name: zod.string(),
});

export const ProductCategoryArraySchema = zod.array(ProductCategorySchema);

export type ProductCategoryType = zod.infer<typeof ProductCategorySchema>;
