import { z as zod } from 'zod';

export const SizeSchema = zod.object({
  id: zod.number(),
  value: zod.string(),
});

export const SizeArraySchema = zod.array(SizeSchema);

export type SizeType = zod.infer<typeof SizeSchema>;
