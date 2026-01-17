import { z } from 'zod';

export const MealPlanEntry = z.object({
  date: z.string().min(1), // YYYY-MM-DD
  slot: z.enum(['breakfast','lunch','dinner','snack']).default('dinner'),
  recipeId: z.string().optional(),
  notes: z.string().optional()
});

export const MealPlanInput = z.object({
  userId: z.string().min(1),
  weekStart: z.string().min(1), // YYYY-MM-DD
  entries: z.array(MealPlanEntry).default([]),
  groceryList: z.array(z.string()).default([]),
  totals: z.object({
    calories: z.number().nonnegative().optional(),
    protein: z.number().nonnegative().optional(),
    carbs: z.number().nonnegative().optional(),
    fat: z.number().nonnegative().optional()
  }).optional()
});

export type MealPlanInput = z.infer<typeof MealPlanInput>;
