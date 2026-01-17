import { Router } from 'express';
import { env } from '../lib/env.js';
import { buildCrudRouter } from './crud.js';
import { FoodInput } from '../schemas/foods.js';
import { NutritionFactsInput } from '../schemas/nutritionFacts.js';
import { RecipeInput } from '../schemas/recipes.js';
import { DietInput } from '../schemas/diets.js';
import { BlogPostInput } from '../schemas/blogPosts.js';
import { MealPlanInput } from '../schemas/mealPlans.js';
import { requirePermission } from '../middleware/rbac.js';
import { getDb } from '../lib/mongo.js';
import { MongoRepository } from '../repositories/mongoRepository.js';

export function buildApiRouter() {
  const router = Router();

  router.get('/health', (req, res) => res.json({ ok: true, service: 'nutri-api' }));

  router.use('/foods', buildCrudRouter({
    basePermission: 'foods',
    collectionName: env.DB_FOODS_COLLECTION,
    inputSchema: FoodInput,
    searchFields: ['name', 'brand']
  }));

  router.use('/nutrition-facts', buildCrudRouter({
    basePermission: 'nutrition',
    collectionName: env.DB_NUTRITION_COLLECTION,
    inputSchema: NutritionFactsInput,
    searchFields: ['source', 'version']
  }));

  router.use('/recipes', buildCrudRouter({
    basePermission: 'recipes',
    collectionName: env.DB_RECIPES_COLLECTION,
    inputSchema: RecipeInput,
    searchFields: ['title', 'slug']
  }));

  // Workflow action: publish recipe
  router.post('/recipes/:id/publish', requirePermission('recipes.publish'), async (req, res) => {
    const db = await getDb();
    const repo = new MongoRepository<any>(db.collection(env.DB_RECIPES_COLLECTION), ['title', 'slug'] as any);
    const updated = await repo.update(req.params.id, {
      status: 'published',
      nutritionSnapshot: {
        ...(req.body?.nutritionSnapshot || {}),
        updatedAt: new Date().toISOString()
      }
    });
    if (!updated) return res.status(404).json({ error: 'not_found' });
    return res.json(updated);
  });

  router.use('/diets', buildCrudRouter({
    basePermission: 'diets',
    collectionName: env.DB_DIETS_COLLECTION,
    inputSchema: DietInput,
    searchFields: ['name', 'slug']
  }));

  router.use('/blog-posts', buildCrudRouter({
    basePermission: 'blog',
    collectionName: env.DB_BLOG_COLLECTION,
    inputSchema: BlogPostInput,
    searchFields: ['title', 'slug']
  }));

  router.post('/blog-posts/:id/publish', requirePermission('blog.publish'), async (req, res) => {
    const db = await getDb();
    const repo = new MongoRepository<any>(db.collection(env.DB_BLOG_COLLECTION), ['title', 'slug'] as any);
    const updated = await repo.update(req.params.id, {
      status: 'published',
      publishedAt: new Date().toISOString()
    });
    if (!updated) return res.status(404).json({ error: 'not_found' });
    return res.json(updated);
  });

  router.use('/meal-plans', buildCrudRouter({
    basePermission: 'mealplans',
    collectionName: env.DB_MEALPLANS_COLLECTION,
    inputSchema: MealPlanInput,
    searchFields: ['userId', 'weekStart']
  }));

  return router;
}
