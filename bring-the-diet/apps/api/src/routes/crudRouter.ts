import { Router } from 'express';
import { z } from 'zod';
import { MongoRepository } from '../repositories/mongoRepository.js';
import { requirePermission } from '../middleware/rbac.js';

export function createCrudRouter<T extends object>(opts: {
  collection: string;
  schema: z.ZodSchema<T>;
  readPermission: string;
  writePermission: string;
}) {
  const r = Router();
  const repo = new MongoRepository<any>(opts.collection);

  r.get('/', requirePermission(opts.readPermission), async (req, res) => {
    const limit = Number(req.query.limit ?? 25);
    const skip = Number(req.query.skip ?? 0);
    const result = await repo.list({}, limit, skip);
    res.json(result);
  });

  r.get('/:id', requirePermission(opts.readPermission), async (req, res) => {
    const item = await repo.get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  });

  r.post('/', requirePermission(opts.writePermission), async (req, res) => {
    const parsed = opts.schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Validation failed', issues: parsed.error.issues });
    const created = await repo.create(parsed.data as any);
    res.status(201).json(created);
  });

  r.put('/:id', requirePermission(opts.writePermission), async (req, res) => {
    const parsed = opts.schema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Validation failed', issues: parsed.error.issues });
    const updated = await repo.update(req.params.id, parsed.data as any);
    res.json(updated);
  });

  r.delete('/:id', requirePermission(opts.writePermission), async (req, res) => {
    const result = await repo.archive(req.params.id);
    res.json(result);
  });

  return r;
}
