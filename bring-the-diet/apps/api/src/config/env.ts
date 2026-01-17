import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  MONGO_URI: z.string().min(10),
  DB_NAME: z.string().min(1).default("foods"),
  DB_FOODS_COLLECTION: z.string().min(1).default("foundationfoods"),
  DB_NUTRITION_COLLECTION: z.string().min(1).default("nutritionfacts"),
  OIDC_AUTHORITY: z.string().optional(),
  OIDC_AUDIENCE: z.string().optional(),
  DEV_MODE: z.coerce.boolean().default(true)
});

export const env = EnvSchema.parse({
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  DB_NAME: process.env.DB_NAME,
  DB_FOODS_COLLECTION: process.env.DB_FOODS_COLLECTION,
  DB_NUTRITION_COLLECTION: process.env.DB_NUTRITION_COLLECTION,
  OIDC_AUTHORITY: process.env.OIDC_AUTHORITY,
  OIDC_AUDIENCE: process.env.OIDC_AUDIENCE,
  DEV_MODE: process.env.DEV_MODE
});
