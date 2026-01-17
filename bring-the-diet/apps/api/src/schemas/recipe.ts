import { z } from 'zod';

export const RecipeSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  dietTags: z.array(z.string()).default([]),
  cookTimeMinutes: z.number().int().nonnegative().default(0),
  servings: z.number().int().positive().default(1),
  ingredients: z.array(
    z.object({
      foodId: z.string().min(1),
      quantity: z.number().positive(),
      unit: z.string().min(1)
    })
  ).default([]),
  steps: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published']).default('draft'),
  nutritionSnapshot: z
    .object({
      calories: z.number().optional(),
      proteinG: z.number().optional(),
      carbsG: z.number().optional(),
      fatG: z.number().optional(),
      computedAt: z.string().optional()
    })
    .optional()
});

export type Recipe = z.infer<typeof RecipeSchema>;
