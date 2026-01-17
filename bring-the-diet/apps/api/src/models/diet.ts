import { z } from "zod";
import { BaseDoc, DietTag, Slug } from "./base.js";

export const MacroTargets = z.object({
  caloriesMin: z.number().nonnegative().optional(),
  caloriesMax: z.number().nonnegative().optional(),
  proteinPercent: z.number().min(0).max(100).optional(),
  carbsPercent: z.number().min(0).max(100).optional(),
  fatPercent: z.number().min(0).max(100).optional()
});

export const DietTypeInput = z.object({
  name: z.string().min(2),
  slug: Slug,
  tag: DietTag,
  overview: z.string().optional(),
  rules: z.array(z.string()).default([]),
  allowed: z.array(z.string()).default([]),
  avoid: z.array(z.string()).default([]),
  contraindications: z.array(z.string()).default([]),
  macroTargets: MacroTargets.default({})
});

export const DietTypeDoc = BaseDoc.merge(DietTypeInput).extend({
  _id: z.any().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  publishedAt: z.date().optional()
});

export type DietTypeInput = z.infer<typeof DietTypeInput>;
export type DietTypeDoc = z.infer<typeof DietTypeDoc>;
