import { MongoClient } from "mongodb";

declare global {
  var __takoMongoClientPromise: Promise<MongoClient> | undefined;
  var __takoMongoIndexesPromise: Promise<void> | undefined;
}

function getMongoUri() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  return uri;
}

function getMongoDbName() {
  return process.env.MONGODB_DB || "tako_vietnam";
}

export function getMongoClient() {
  if (!global.__takoMongoClientPromise) {
    const client = new MongoClient(getMongoUri());

    global.__takoMongoClientPromise = client.connect();
  }

  return global.__takoMongoClientPromise;
}

export async function getMongoDatabase() {
  const client = await getMongoClient();
  return client.db(getMongoDbName());
}

export async function ensureMongoIndexes() {
  if (!global.__takoMongoIndexesPromise) {
    global.__takoMongoIndexesPromise = (async () => {
      const database = await getMongoDatabase();

      await Promise.all([
        database.collection("products").createIndexes([
          { key: { slug: 1 }, name: "products_slug_uq", unique: true },
          { key: { featured: -1, updatedAt: -1 }, name: "products_featured_updatedAt" },
          { key: { category: 1 }, name: "products_category" },
          { key: { manufacturer: 1 }, name: "products_manufacturer" },
          { key: { applications: 1 }, name: "products_applications" },
          { key: { category: 1, featured: -1, updatedAt: -1 }, name: "products_category_featured_updatedAt" },
          { key: { manufacturer: 1, featured: -1, updatedAt: -1 }, name: "products_manufacturer_featured_updatedAt" },
          { key: { applications: 1, featured: -1, updatedAt: -1 }, name: "products_applications_featured_updatedAt" },
        ]),
        database.collection("news_articles").createIndexes([
          { key: { slug: 1 }, name: "news_slug_uq", unique: true },
          { key: { date: -1, updatedAt: -1 }, name: "news_date_updatedAt" },
        ]),
        database.collection("contacts").createIndexes([
          { key: { createdAt: -1 }, name: "contacts_createdAt" },
          { key: { email: 1 }, name: "contacts_email" },
        ]),
        database.collection("admin_users").createIndexes([
          { key: { username: 1 }, name: "admin_users_username_uq", unique: true },
          { key: { role: 1, createdAt: 1 }, name: "admin_users_role_createdAt" },
        ]),
        database.collection("site_content").createIndexes([
          { key: { updatedAt: -1 }, name: "site_content_updatedAt" },
        ]),
      ]);
    })();
  }

  await global.__takoMongoIndexesPromise;
}