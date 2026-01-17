import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load repo-root .env first (preferred), then local apps/api/.env
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const schema = z.object({
  NODE_ENV: z.string().optional().default("development"),
  PORT: z.coerce.number().optional().default(3000),

  MONGO_URI: z.string().min(1),
  DB_NAME: z.string().min(1).default("foods"),
  DB_FOODS_COLLECTION: z.string().min(1).default("foundationfoods"),
  DB_NUTRITION_COLLECTION: z.string().min(1).default("nutritionfacts"),
  DB_RECIPES_COLLECTION: z.string().min(1).default("recipes"),
  DB_DIETS_COLLECTION: z.string().min(1).default("diettypes"),
  DB_BLOG_COLLECTION: z.string().min(1).default("blogposts"),
  DB_MEALPLANS_COLLECTION: z.string().min(1).default("mealplans"),

  OIDC_AUTHORITY: z.string().optional(),
  OIDC_AUDIENCE: z.string().optional(),
  ALLOW_DEV_USER_HEADER: z.coerce.boolean().optional().default(true),
});

export const env = schema.parse(process.env);
