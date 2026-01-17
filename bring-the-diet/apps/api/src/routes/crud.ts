import { Router } from 'express';
import { z, ZodTypeAny } from 'zod';
import { getDb } from '../lib/mongo.js';
import { MongoRepository } from '../repositories/mongoRepository.js';
import { requirePermission } from '../middleware/rbac.js';

export function buildCrudRouter(opts: {
  basePermission: string;
  collectionName: string;
  inputSchema: ZodTypeAny;
  searchFields?: string[];
}) {
  const router = Router();

  router.get('/', requirePermission(`${opts.basePermission}.read`), async (req, res) => {
    const db = await getDb();
    const repo = new MongoRepository<any>(db.collection(opts.collectionName), opts.searchFields as any);

    const params = {
      q: req.query.q as string | undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      skip: req.query.skip ? Number(req.query.skip) : undefined,
      sort: req.query.sort as string | undefined,
    };

    const result = await repo.list(params);
    return res.json(result);
  });

  router.get('/:id', requirePermission(`${opts.basePermission}.read`), async (req, res) => {
    const db = await getDb();
    const repo = new MongoRepository<any>(db.collection(opts.collectionName), opts.searchFields as any);
    const doc = await repo.get(req.params.id);
    if (!doc) return res.status(404).json({ error: 'not_found' });
    return res.json(doc);
  });

  router.post('/', requirePermission(`${opts.basePermission}.create`), async (req, res) => {
    const input = opts.inputSchema.parse(req.body);
    const db = await getDb();
    const repo = new MongoRepository<any>(db.collection(opts.collectionName), opts.searchFields as any);
    const created = await repo.create(input);
    return res.status(201).json(created);
  });

  router.put('/:id', requirePermission(`${opts.basePermission}.edit`), async (req, res) => {
    const patch = opts.inputSchema.partial().parse(req.body);
    const db = await getDb();
    const repo = new MongoRepository<any>(db.collection(opts.collectionName), opts.searchFields as any);
    const updated = await repo.update(req.params.id, patch);
    if (!updated) return res.status(404).json({ error: 'not_found' });
    return res.json(updated);
  });

  router.delete('/:id', requirePermission(`${opts.basePermission}.archive`), async (req, res) => {
    const db = await getDb();
    const repo = new MongoRepository<any>(db.collection(opts.collectionName), opts.searchFields as any);
    await repo.archive(req.params.id);
    return res.json({ ok: true });
  });

  return router;
}

export const seedPermissions = () => {
  // Convenience for docs; actual seeding should be done in a migration/seed script.
  return [
    'read',
    'create',
    'edit',
    'archive'
  ];
};
