import { z } from 'zod';

export const FoodInput = z.object({
  name: z.string().min(1),
  brand: z.string().optional(),
  categories: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
  synonyms: z.array(z.string()).default([]),
  notes: z.string().optional()
});

export type FoodInput = z.infer<typeof FoodInput>;
