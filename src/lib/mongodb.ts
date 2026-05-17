import { MongoClient, ServerApiVersion } from "mongodb";

declare global {
  var __takoMongoClientPromise: Promise<MongoClient> | undefined;
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
    const client = new MongoClient(getMongoUri(), {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    global.__takoMongoClientPromise = client.connect();
  }

  return global.__takoMongoClientPromise;
}

export async function getMongoDatabase() {
  const client = await getMongoClient();
  return client.db(getMongoDbName());
}