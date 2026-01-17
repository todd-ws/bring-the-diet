import { z } from "zod";
import { BaseDoc, DietTag, Slug, Unit } from "./base.js";

export const RecipeIngredient = z.object({
  foodId: z.string().min(3),
  quantity: z.number().positive(),
  unit: Unit,
  note: z.string().optional()
});

export const NutritionSnapshot = z.object({
  calories: z.number().nonnegative().default(0),
  protein: z.number().nonnegative().default(0),
  carbs: z.number().nonnegative().default(0),
  fat: z.number().nonnegative().default(0),
  nutrients: z.array(z.object({
    key: z.string().min(2),
    label: z.string().min(2),
    amount: z.number(),
    unit: Unit
  })).default([])
});

export const RecipeInput = z.object({
  title: z.string().min(3),
  slug: Slug,
  summary: z.string().optional(),
  dietTags: z.array(DietTag).default([]),
  cuisine: z.string().optional(),
  prepMinutes: z.number().int().min(0).default(0),
  cookMinutes: z.number().int().min(0).default(0),
  servings: z.number().int().min(1).default(1),
  difficulty: z.enum(["easy", "medium", "hard"]).default("easy"),
  ingredients: z.array(RecipeIngredient).default([]),
  steps: z.array(z.string().min(2)).default([]),
  images: z.array(z.string().url()).default([]),
  status: z.enum(["draft", "review", "published"]).default("draft"),
  nutrition: NutritionSnapshot.default({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    nutrients: []
  })
});

export const RecipeDoc = BaseDoc.merge(RecipeInput).extend({
  _id: z.any().optional(),
  publishedAt: z.date().optional()
});

export type RecipeInput = z.infer<typeof RecipeInput>;
export type RecipeDoc = z.infer<typeof RecipeDoc>;
