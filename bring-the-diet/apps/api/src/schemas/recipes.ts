import { z } from 'zod';
import { zSlug, zImageUrl } from './common.js';

export const RecipeIngredient = z.object({
  foodId: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  notes: z.string().optional()
});

export const RecipeNutritionSnapshot = z.object({
  calories: z.number().nonnegative().optional(),
  protein: z.number().nonnegative().optional(),
  carbs: z.number().nonnegative().optional(),
  fat: z.number().nonnegative().optional(),
  updatedAt: z.string().optional()
}).optional();

export const RecipeInput = z.object({
  title: z.string().min(1),
  slug: zSlug,
  summary: z.string().optional(),
  dietTags: z.array(z.string()).default([]),
  cuisine: z.string().optional(),
  difficulty: z.enum(['easy','medium','hard']).default('easy'),
  prepMinutes: z.number().nonnegative().default(0),
  cookMinutes: z.number().nonnegative().default(0),
  servings: z.number().positive().default(1),
  imageUrl: zImageUrl,
  ingredients: z.array(RecipeIngredient).default([]),
  steps: z.array(z.string()).default([]),
  status: z.enum(['draft','review','published','archived']).default('draft'),
  nutritionSnapshot: RecipeNutritionSnapshot
});

export type RecipeInput = z.infer<typeof RecipeInput>;
