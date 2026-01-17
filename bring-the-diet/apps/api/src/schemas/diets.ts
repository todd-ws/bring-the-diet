import { z } from 'zod';
import { zSlug, zImageUrl } from './common.js';

export const DietInput = z.object({
  name: z.string().min(1),
  slug: zSlug,
  description: z.string().optional(),
  rules: z.array(z.string()).default([]),
  allowedFoods: z.array(z.string()).default([]),
  avoidFoods: z.array(z.string()).default([]),
  macroTargets: z.object({
    proteinPct: z.number().min(0).max(100).optional(),
    carbsPct: z.number().min(0).max(100).optional(),
    fatPct: z.number().min(0).max(100).optional()
  }).optional(),
  imageUrl: zImageUrl,
  status: z.enum(['draft','published','archived']).default('draft')
});

export type DietInput = z.infer<typeof DietInput>;
