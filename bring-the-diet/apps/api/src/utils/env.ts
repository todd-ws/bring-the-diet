import path from 'node:path';
import dotenv from 'dotenv';

// Load monorepo root .env first, then allow apps/api/.env to override.
const rootEnvPath = path.resolve(process.cwd(), '../../.env');
const apiEnvPath = path.resolve(process.cwd(), '.env');

dotenv.config({ path: rootEnvPath });
dotenv.config({ path: apiEnvPath, override: true });

export function env(key: string, fallback?: string): string {
  const val = process.env[key] ?? fallback;
  if (val === undefined) throw new Error(`Missing required env var: ${key}`);
  return val;
}

export function envBool(key: string, fallback = 'false'): boolean {
  const v = (process.env[key] ?? fallback).toString().toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
}
