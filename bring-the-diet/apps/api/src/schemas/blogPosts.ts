import { z } from 'zod';
import { zSlug, zImageUrl } from './common.js';

export const BlogPostInput = z.object({
  title: z.string().min(1),
  slug: zSlug,
  excerpt: z.string().optional(),
  body: z.string().min(1),
  author: z.string().optional(),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
  imageUrl: zImageUrl,
  status: z.enum(['draft','published','archived']).default('draft'),
  publishedAt: z.string().optional()
});

export type BlogPostInput = z.infer<typeof BlogPostInput>;
