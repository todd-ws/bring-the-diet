import { Router, Response } from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../db/mongo.js";
import { authMiddleware, requirePermission } from "../middleware/auth.js";
import type { AuthenticatedRequest, CollectionConfig } from "../types/index.js";

export function createCrudRouter(config: CollectionConfig): Router {
  const router = Router();
  const collectionName =
    process.env[config.envVar] || config.name.toLowerCase();

  // List all (with optional pagination)
  router.get(
    "/",
    authMiddleware,
    requirePermission(config.permissions.read),
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const db = getDb();
        const collection = db.collection(collectionName);

        const page = parseInt(req.query.page as string) || 1;
        const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
        const skip = (page - 1) * limit;

        const filter = { deletedAt: { $exists: false } };
        const [items, total] = await Promise.all([
          collection.find(filter).skip(skip).limit(limit).toArray(),
          collection.countDocuments(filter),
        ]);

        res.json({
          data: items,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        });
      } catch (error) {
        console.error(`Error listing ${config.name}:`, error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Get by ID
  router.get(
    "/:id",
    authMiddleware,
    requirePermission(config.permissions.read),
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const db = getDb();
        const collection = db.collection(collectionName);

        let filter: { _id: ObjectId | string; deletedAt?: { $exists: false } };
        try {
          filter = { _id: new ObjectId(req.params.id), deletedAt: { $exists: false } };
        } catch {
          filter = { _id: req.params.id, deletedAt: { $exists: false } };
        }

        const item = await collection.findOne(filter);
        if (!item) {
          res.status(404).json({ error: "Not found" });
          return;
        }

        res.json(item);
      } catch (error) {
        console.error(`Error getting ${config.name}:`, error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Create
  router.post(
    "/",
    authMiddleware,
    requirePermission(config.permissions.write),
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const db = getDb();
        const collection = db.collection(collectionName);

        const doc = {
          ...req.body,
          createdAt: new Date(),
          createdBy: req.user?.id,
          updatedAt: new Date(),
          updatedBy: req.user?.id,
        };

        const result = await collection.insertOne(doc);
        res.status(201).json({ _id: result.insertedId, ...doc });
      } catch (error) {
        console.error(`Error creating ${config.name}:`, error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Update
  router.put(
    "/:id",
    authMiddleware,
    requirePermission(config.permissions.write),
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const db = getDb();
        const collection = db.collection(collectionName);

        let filter: { _id: ObjectId | string; deletedAt?: { $exists: false } };
        try {
          filter = { _id: new ObjectId(req.params.id), deletedAt: { $exists: false } };
        } catch {
          filter = { _id: req.params.id, deletedAt: { $exists: false } };
        }

        const update = {
          $set: {
            ...req.body,
            updatedAt: new Date(),
            updatedBy: req.user?.id,
          },
        };

        const result = await collection.findOneAndUpdate(filter, update, {
          returnDocument: "after",
        });

        if (!result) {
          res.status(404).json({ error: "Not found" });
          return;
        }

        res.json(result);
      } catch (error) {
        console.error(`Error updating ${config.name}:`, error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Soft delete
  router.delete(
    "/:id",
    authMiddleware,
    requirePermission(config.permissions.delete),
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const db = getDb();
        const collection = db.collection(collectionName);

        let filter: { _id: ObjectId | string; deletedAt?: { $exists: false } };
        try {
          filter = { _id: new ObjectId(req.params.id), deletedAt: { $exists: false } };
        } catch {
          filter = { _id: req.params.id, deletedAt: { $exists: false } };
        }

        const update = {
          $set: {
            deletedAt: new Date(),
            deletedBy: req.user?.id,
          },
        };

        const result = await collection.findOneAndUpdate(filter, update, {
          returnDocument: "after",
        });

        if (!result) {
          res.status(404).json({ error: "Not found" });
          return;
        }

        res.status(204).send();
      } catch (error) {
        console.error(`Error deleting ${config.name}:`, error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  return router;
}

// Publish action for content that needs publishing workflow
export function addPublishRoute(
  router: Router,
  config: CollectionConfig
): void {
  const collectionName =
    process.env[config.envVar] || config.name.toLowerCase();

  router.post(
    "/:id/publish",
    authMiddleware,
    requirePermission(config.permissions.write),
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const db = getDb();
        const collection = db.collection(collectionName);

        let filter: { _id: ObjectId | string; deletedAt?: { $exists: false } };
        try {
          filter = { _id: new ObjectId(req.params.id), deletedAt: { $exists: false } };
        } catch {
          filter = { _id: req.params.id, deletedAt: { $exists: false } };
        }

        const update = {
          $set: {
            published: true,
            publishedAt: new Date(),
            publishedBy: req.user?.id,
            updatedAt: new Date(),
            updatedBy: req.user?.id,
          },
        };

        const result = await collection.findOneAndUpdate(filter, update, {
          returnDocument: "after",
        });

        if (!result) {
          res.status(404).json({ error: "Not found" });
          return;
        }

        res.json(result);
      } catch (error) {
        console.error(`Error publishing ${config.name}:`, error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );
}
