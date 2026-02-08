import { z } from "zod";

export const ObjectIdString = z.string().min(1);

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(25),
  q: z.string().optional()
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
