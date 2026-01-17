import { z } from 'zod';

export const FoodSchema = z.object({
  name: z.string().min(1),
  brand: z.string().optional(),
  categories: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([])
});

export type Food = z.infer<typeof FoodSchema>;
