import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToMongo(): Promise<Db> {
  if (db) return db;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI environment variable is not set");
  }

  const dbName = process.env.DB_NAME || "foods-test";

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);

  console.log(`Connected to MongoDB database: ${dbName}`);
  return db;
}

export function getDb(): Db {
  if (!db) {
    throw new Error("Database not connected. Call connectToMongo first.");
  }
  return db;
}

export async function closeMongo(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log("MongoDB connection closed");
  }
}
