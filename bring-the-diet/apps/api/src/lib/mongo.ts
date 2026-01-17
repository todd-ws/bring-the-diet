import { MongoClient, Db } from 'mongodb';
import { env } from './env.js';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (db) return db;
  client = new MongoClient(env.MONGO_URI);
  await client.connect();
  db = client.db(env.DB_NAME);
  return db;
}

export async function closeDb() {
  if (client) {
    await client.close();
  }
  client = null;
  db = null;
}
