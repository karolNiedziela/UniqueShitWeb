import { z as zod } from 'zod';

export const PaymentTypeSchema = zod.object({
  id: zod.number(),
  name: zod.string(),
});

export const PaymentTypeArraySchema = zod.array(PaymentTypeSchema);

export type PaymentType = zod.infer<typeof PaymentTypeSchema>;