import { z } from 'zod';
import { zSlug, zImageUrl } from './common.ts';

export const BlogPostInput = z.object({
  title: z.string().min(1),
  slug: zSlug,
  excerpt: z.string().optional(),
  body: z.string().min(1),
  imageUrl: zImageUrl,
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published']).default('draft'),
  publishedAt: z.string().datetime().optional()
});

export type BlogPostInput = z.infer<typeof BlogPostInput>;
