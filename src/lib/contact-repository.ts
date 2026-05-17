import { ObjectId } from "mongodb";
import type { ContactSubmissionInput } from "@/lib/contact-schema";
import { getMongoDatabase } from "@/lib/mongodb";

type ContactDocument = ContactSubmissionInput & {
  _id?: ObjectId;
  createdAt: Date;
  status: "new" | "handled";
};

export type StoredContact = ContactSubmissionInput & {
  id: string;
  createdAt: string;
  status: "new" | "handled";
};

async function getContactsCollection() {
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

export async function updateContact(
  id: string,
  payload: Partial<ContactSubmissionInput> & { status?: "new" | "handled" },
) {
  const collection = await getContactsCollection();
  const _id = new ObjectId(id);

  await collection.updateOne(
    { _id },
    {
      $set: {
        ...payload,
      },
    },
  );
}

export async function deleteContact(id: string) {
  const collection = await getContactsCollection();
  const _id = new ObjectId(id);
  await collection.deleteOne({ _id });
}

export async function deleteContacts(ids: string[]) {
  if (ids.length === 0) {
    return;
  }

  const collection = await getContactsCollection();
  const objectIds = ids.map((id) => new ObjectId(id));
  await collection.deleteMany({ _id: { $in: objectIds } });
}