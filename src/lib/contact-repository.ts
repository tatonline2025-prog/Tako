import { ObjectId } from "mongodb";
import type { ContactSubmissionInput } from "@/lib/contact-schema";
import { ensureMongoIndexes, getMongoDatabase } from "@/lib/mongodb";

type ContactDocument = ContactSubmissionInput & {
  _id?: ObjectId;
  createdAt: Date;
  status: "new";
};

export type StoredContact = ContactSubmissionInput & {
  id: string;
  createdAt: string;
  status: "new";
};

async function getContactsCollection() {
  await ensureMongoIndexes();
  const database = await getMongoDatabase();
  return database.collection<ContactDocument>("contacts");
}

export async function createContact(payload: ContactSubmissionInput) {
  const collection = await getContactsCollection();
  const document: ContactDocument = {
    ...payload,
    createdAt: new Date(),
    status: "new",
  };

  const result = await collection.insertOne(document);
  return result.insertedId.toString();
}

export async function listContacts(limit = 50): Promise<StoredContact[]> {
  const collection = await getContactsCollection();
  const records = await collection
    .find({}, { sort: { createdAt: -1 }, limit })
    .toArray();

  return records.map((record) => ({
    id: record._id?.toString() || "",
    fullName: record.fullName,
    email: record.email,
    phone: record.phone,
    company: record.company,
    interest: record.interest,
    message: record.message,
    createdAt: record.createdAt.toISOString(),
    status: record.status,
  }));
}

export async function getContactCount(): Promise<number> {
  const collection = await getContactsCollection();
  return await collection.countDocuments();
}