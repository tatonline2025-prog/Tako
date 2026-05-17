import { MongoClient } from "mongodb";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(relativePath) {
  const filePath = resolve(process.cwd(), relativePath);
  if (!existsSync(filePath)) {
    return;
  }

  const content = readFileSync(filePath, "utf-8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const delimiterIndex = line.indexOf("=");
    if (delimiterIndex <= 0) {
      continue;
    }

    const key = line.slice(0, delimiterIndex).trim();
    let value = line.slice(delimiterIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

async function main() {
  loadEnvFile(".env");
  loadEnvFile(".env.local");

  const uri = getRequiredEnv("MONGODB_URI");
  const dbName = process.env.MONGODB_DB || "tako_vietnam";

  const client = new MongoClient(uri);
  await client.connect();

  try {
    const db = client.db(dbName);

    await Promise.all([
      db.collection("products").createIndexes([
        { key: { slug: 1 }, name: "products_slug_uq", unique: true },
        { key: { featured: -1, updatedAt: -1 }, name: "products_featured_updatedAt" },
        { key: { category: 1 }, name: "products_category" },
        { key: { manufacturer: 1 }, name: "products_manufacturer" },
        { key: { applications: 1 }, name: "products_applications" },
        { key: { category: 1, featured: -1, updatedAt: -1 }, name: "products_category_featured_updatedAt" },
        { key: { manufacturer: 1, featured: -1, updatedAt: -1 }, name: "products_manufacturer_featured_updatedAt" },
        { key: { applications: 1, featured: -1, updatedAt: -1 }, name: "products_applications_featured_updatedAt" },
      ]),
      db.collection("news_articles").createIndexes([
        { key: { slug: 1 }, name: "news_slug_uq", unique: true },
        { key: { date: -1, updatedAt: -1 }, name: "news_date_updatedAt" },
      ]),
      db.collection("contacts").createIndexes([
        { key: { createdAt: -1 }, name: "contacts_createdAt" },
        { key: { email: 1 }, name: "contacts_email" },
      ]),
      db.collection("admin_users").createIndexes([
        { key: { username: 1 }, name: "admin_users_username_uq", unique: true },
        { key: { role: 1, createdAt: 1 }, name: "admin_users_role_createdAt" },
      ]),
      db.collection("site_content").createIndexes([
        { key: { updatedAt: -1 }, name: "site_content_updatedAt" },
      ]),
    ]);

    console.log("MongoDB indexes ensured successfully.");
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error("Failed to ensure MongoDB indexes:", error);
  process.exit(1);
});
