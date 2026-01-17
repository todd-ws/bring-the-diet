import { z } from 'zod';

export const MealPlanSchema = z.object({
  userId: z.string().min(1),
  weekStartIso: z.string().min(10),
  entries: z.array(
    z.object({
      dateIso: z.string().min(10),
      meal: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
      recipeId: z.string().optional(),
      notes: z.string().optional()
    })
  ).default([])
});

export type MealPlan = z.infer<typeof MealPlanSchema>;
