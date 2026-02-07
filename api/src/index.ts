import dotenv from "dotenv";
import path from "path";

// Load .env from monorepo root (parent of api folder)
dotenv.config({ path: path.resolve(process.cwd(), "..", ".env") });
import express from "express";
import cors from "cors";
import { connectToMongo, closeMongo } from "./db/mongo.js";
import { createCrudRouter, addPublishRoute } from "./routes/crud-factory.js";
import type { CollectionConfig } from "./types/index.js";

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

// Middleware
app.use(cors());
app.use(express.json());

// Health check (no auth required)
app.get("/api/health", (_, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Collection configurations
const collections: CollectionConfig[] = [
  {
    name: "foods",
    envVar: "DB_FOODS_COLLECTION",
    permissions: { read: "foods:read", write: "foods:write", delete: "foods:delete" },
  },
  {
    name: "nutrition-facts",
    envVar: "DB_NUTRITION_COLLECTION",
    permissions: { read: "nutrition:read", write: "nutrition:write", delete: "nutrition:delete" },
  },
  {
    name: "recipes",
    envVar: "DB_RECIPES_COLLECTION",
    permissions: { read: "recipes:read", write: "recipes:write", delete: "recipes:delete" },
  },
  {
    name: "diets",
    envVar: "DB_DIETS_COLLECTION",
    permissions: { read: "diets:read", write: "diets:write", delete: "diets:delete" },
  },
  {
    name: "blog-posts",
    envVar: "DB_BLOG_COLLECTION",
    permissions: { read: "blog:read", write: "blog:write", delete: "blog:delete" },
  },
  {
    name: "meal-plans",
    envVar: "DB_MEALPLANS_COLLECTION",
    permissions: { read: "mealplans:read", write: "mealplans:write", delete: "mealplans:delete" },
  },
];

// Mount CRUD routers
for (const config of collections) {
  const router = createCrudRouter(config);

  // Add publish route for recipes and blog posts
  if (config.name === "recipes" || config.name === "blog-posts") {
    addPublishRoute(router, config);
  }

  app.use(`/api/${config.name}`, router);
}

// Error handling
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

// Graceful shutdown
async function shutdown() {
  console.log("Shutting down...");
  await closeMongo();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Start server
async function start() {
  try {
    await connectToMongo();
    app.listen(PORT, () => {
      console.log(`API server running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
