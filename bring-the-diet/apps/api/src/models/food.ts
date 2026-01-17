import { z } from "zod";
import { BaseDoc, Slug } from "./base.js";

export const FoodInput = z.object({
  name: z.string().min(2),
  slug: Slug,
  brand: z.string().optional(),
  categories: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
  notes: z.string().optional()
});

export const FoodDoc = BaseDoc.merge(FoodInput).extend({
  _id: z.any().optional()
});

export type FoodInput = z.infer<typeof FoodInput>;
export type FoodDoc = z.infer<typeof FoodDoc>;
