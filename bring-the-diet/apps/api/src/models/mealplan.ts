import { z } from "zod";
import { BaseDoc } from "./base.js";

export const MealEntry = z.object({
  date: z.string().min(10), // YYYY-MM-DD
  slot: z.enum(["breakfast", "lunch", "dinner", "snack"]).default("dinner"),
  recipeId: z.string().optional(),
  note: z.string().optional()
});

export const MealPlanInput = z.object({
  userId: z.string().min(3),
  weekStart: z.string().min(10),
  entries: z.array(MealEntry).default([])
});

export const MealPlanDoc = BaseDoc.merge(MealPlanInput).extend({
  _id: z.any().optional()
});

export type MealPlanInput = z.infer<typeof MealPlanInput>;
export type MealPlanDoc = z.infer<typeof MealPlanDoc>;
