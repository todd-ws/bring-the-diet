import { z } from "zod";

export const BaseDoc = z.object({
  _id: z.any().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  archivedAt: z.date().optional()
});

export const Slug = z
  .string()
  .min(3)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case");

export const DietTag = z.enum(["keto", "paleo", "mediterranean", "vegan", "vegetarian", "low_fodmap", "dash", "gluten_free", "diabetic_friendly", "low_carb", "high_protein"]);
export type DietTag = z.infer<typeof DietTag>;

export const Unit = z.enum(["g", "mg", "mcg", "oz", "lb", "ml", "l", "tsp", "tbsp", "cup", "piece", "serving"]);
export type Unit = z.infer<typeof Unit>;
