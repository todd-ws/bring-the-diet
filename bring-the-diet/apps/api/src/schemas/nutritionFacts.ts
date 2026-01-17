import { z } from 'zod';

export const NutrientValue = z.object({
  nutrient: z.string().min(1),
  unit: z.string().min(1),
  value: z.number()
});

export const NutritionFactsInput = z.object({
  foodId: z.string().min(1),
  servingSize: z.number().positive(),
  servingUnit: z.string().min(1),
  calories: z.number().nonnegative().optional(),
  nutrients: z.array(NutrientValue).default([]),
  source: z.string().optional(),
  version: z.string().optional()
});

export type NutritionFactsInput = z.infer<typeof NutritionFactsInput>;
