import type { Request } from "express";

export function getPaging(req: Request) {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize ?? 25)));
  const skip = (page - 1) * pageSize;
  return { page, pageSize, skip };
}

export function getSort(req: Request) {
  const sort = String(req.query.sort ?? "-updatedAt");
  // Example: "-updatedAt" or "title"
  const direction = sort.startsWith("-") ? -1 : 1;
  const field = sort.replace(/^-/, "");
  return { [field]: direction } as Record<string, 1 | -1>;
}
