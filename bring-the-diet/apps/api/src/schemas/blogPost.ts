import { z } from 'zod';

export const BlogPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().default(''),
  body: z.string().default(''),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published']).default('draft')
});

export type BlogPost = z.infer<typeof BlogPostSchema>;
