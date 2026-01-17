import { z } from 'zod';

export const DietSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().default(''),
  allowed: z.array(z.string()).default([]),
  avoid: z.array(z.string()).default([]),
  macroTargets: z
    .object({
      proteinPct: z.number().min(0).max(100).optional(),
      carbsPct: z.number().min(0).max(100).optional(),
      fatPct: z.number().min(0).max(100).optional()
    })
    .optional(),
  status: z.enum(['draft', 'published']).default('draft')
});

export type Diet = z.infer<typeof DietSchema>;
