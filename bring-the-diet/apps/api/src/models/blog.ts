import { z } from "zod";
import { BaseDoc, Slug } from "./base.js";

export const BlogPostInput = z.object({
  title: z.string().min(3),
  slug: Slug,
  excerpt: z.string().optional(),
  body: z.string().min(10),
  authorName: z.string().optional(),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional()
});

export const BlogPostDoc = BaseDoc.merge(BlogPostInput).extend({
  _id: z.any().optional(),
  publishedAt: z.date().optional()
});

export type BlogPostInput = z.infer<typeof BlogPostInput>;
export type BlogPostDoc = z.infer<typeof BlogPostDoc>;
