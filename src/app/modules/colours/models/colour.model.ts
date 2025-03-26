import { z as zod } from 'zod';

export const ColourSchema = zod.object({
  id: zod.number(),
  name: zod.string(),
});

export const ColourArraySchema = zod.array(ColourSchema);

export type ColourType = zod.infer<typeof ColourSchema>;
