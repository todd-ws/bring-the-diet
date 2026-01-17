import { z } from 'zod';

export const zId = z.string().min(1);

export const zSlug = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be kebab-case');

export const zImageUrl = z.string().url().optional();
