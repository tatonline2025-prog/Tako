import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { ObjectId } from "mongodb";
import type { AdminRole } from "@/lib/admin-auth";
import { getMongoDatabase } from "@/lib/mongodb";

type AdminUserDocument = {
  _id: ObjectId;
  createdAt: Date;
  passwordHash: string;
  role: AdminRole;
  updatedAt: Date;
  username: string;
};

export type AdminUser = {
  createdAt: string;
  id: string;
  role: AdminRole;
  updatedAt: string;
  username: string;
};

async function getUsersCollection() {
  const database = await getMongoDatabase();
  return database.collection<AdminUserDocument>("admin_users");
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, hash] = storedHash.split(":");
  if (algorithm !== "scrypt" || !salt || !hash) {
    return false;
  }

  const candidateHash = scryptSync(password, salt, 64).toString("hex");
  const candidateBuffer = Buffer.from(candidateHash, "hex");
  const hashBuffer = Buffer.from(hash, "hex");

  if (candidateBuffer.length !== hashBuffer.length) {
    return false;
  }

  return timingSafeEqual(candidateBuffer, hashBuffer);
}

async function ensureSeedAdminUser() {
  const collection = await getUsersCollection();
  const count = await collection.estimatedDocumentCount();

  if (count > 0) {
    return;
  }

  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin";

  await collection.insertOne({
    _id: new ObjectId(),
    createdAt: new Date(),
    passwordHash: hashPassword(password),
    role: "admin",
    updatedAt: new Date(),
    username,
  });
}

function toAdminUser(doc: AdminUserDocument): AdminUser {
  return {
    createdAt: doc.createdAt.toISOString(),
    id: doc._id.toHexString(),
    role: doc.role,
    updatedAt: doc.updatedAt.toISOString(),
    username: doc.username,
  };
}

export async function listAdminUsers(): Promise<AdminUser[]> {
  try {
    await ensureSeedAdminUser();
    const collection = await getUsersCollection();
    const users = await collection.find({}).sort({ createdAt: 1 }).toArray();
    return users.map(toAdminUser);
  } catch {
    return [];
  }
}

export async function createAdminUser(payload: {
  password: string;
  role: AdminRole;
  username: string;
}) {
  await ensureSeedAdminUser();
  const collection = await getUsersCollection();

  const existing = await collection.findOne({ username: payload.username });
  if (existing) {
    throw new Error("Tên đăng nhập đã tồn tại.");
  }

  await collection.insertOne({
    _id: new ObjectId(),
    createdAt: new Date(),
    passwordHash: hashPassword(payload.password),
    role: payload.role,
    updatedAt: new Date(),
    username: payload.username,
  });
}

export async function updateAdminUser(
  id: string,
  payload: {
    password?: string;
    role: AdminRole;
    username: string;
  },
) {
  await ensureSeedAdminUser();
  const collection = await getUsersCollection();
  const _id = new ObjectId(id);

  const existingByName = await collection.findOne({ username: payload.username, _id: { $ne: _id } });
  if (existingByName) {
    throw new Error("Tên đăng nhập đã tồn tại.");
  }

  const nextSet: Partial<AdminUserDocument> = {
    role: payload.role,
    updatedAt: new Date(),
    username: payload.username,
  };

  if (payload.password) {
    nextSet.passwordHash = hashPassword(payload.password);
  }

  await collection.updateOne({ _id }, { $set: nextSet });
}

export async function deleteAdminUser(id: string) {
  await ensureSeedAdminUser();
  const collection = await getUsersCollection();
  const _id = new ObjectId(id);

  const target = await collection.findOne({ _id });
  if (!target) {
    return;
  }

  if (target.role === "admin") {
    const adminCount = await collection.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      throw new Error("Phải giữ lại ít nhất 1 tài khoản admin.");
    }
  }

  await collection.deleteOne({ _id });
}

export async function verifyAdminUserCredentials(username: string, password: string) {
  try {
    await ensureSeedAdminUser();
    const collection = await getUsersCollection();
    const user = await collection.findOne({ username });

    if (!user) {
      return null;
    }

    if (!verifyPassword(password, user.passwordHash)) {
      return null;
    }

    return {
      role: user.role,
      username: user.username,
    } as const;
  } catch {
    return null;
  }
}
