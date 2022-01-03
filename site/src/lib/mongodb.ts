import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside site/.env.local",
  );
}

if (!MONGODB_DB_NAME) {
  throw new Error(
    "Please define the MONGODB_DB_NAME environment variable inside site/.env.local",
  );
}

export const connectToDatabase = async () => {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client: MongoClient = await MongoClient.connect(MONGODB_URI, {});

  const db = await client.db(MONGODB_DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
};
