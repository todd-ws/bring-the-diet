import { z } from "zod";
import { BaseDoc, Unit } from "./base.js";

export const NutrientValue = z.object({
  key: z.string().min(2), // e.g. "calories", "protein"
  label: z.string().min(2),
  amount: z.number(),
  unit: Unit
});

export const NutritionFactsInput = z.object({
  foodId: z.string().min(3),
  servingSize: z.number().positive(),
  servingUnit: Unit,
  nutrients: z.array(NutrientValue).default([]),
  source: z.string().optional(),
  version: z.number().int().min(1).default(1)
});

export const NutritionFactsDoc = BaseDoc.merge(NutritionFactsInput).extend({
  _id: z.any().optional()
});

export type NutritionFactsInput = z.infer<typeof NutritionFactsInput>;
export type NutritionFactsDoc = z.infer<typeof NutritionFactsDoc>;
