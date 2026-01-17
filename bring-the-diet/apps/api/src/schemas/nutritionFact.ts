import { z } from 'zod';

export const NutritionFactSchema = z.object({
  foodId: z.string().min(1),
  servingSize: z.number().positive(),
  servingUnit: z.string().min(1),
  nutrients: z.array(
    z.object({
      code: z.string().min(1),
      name: z.string().min(1),
      unit: z.string().min(1),
      value: z.number()
    })
  ).default([])
});

export type NutritionFact = z.infer<typeof NutritionFactSchema>;
