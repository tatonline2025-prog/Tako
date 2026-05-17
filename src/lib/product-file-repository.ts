import { ObjectId } from "mongodb";
import { getMongoDatabase } from "@/lib/mongodb";

type ProductFileDocument = {
  _id?: ObjectId;
  createdAt: Date;
  fileName: string;
  mimeType: string;
  size: number;
  content: Buffer;
};

async function getProductFilesCollection() {
  const database = await getMongoDatabase();
  return database.collection<ProductFileDocument>("product_files");
}

export async function createProductFile(input: {
  fileName: string;
  mimeType: string;
  content: Buffer;
}) {
  const collection = await getProductFilesCollection();
  const result = await collection.insertOne({
    createdAt: new Date(),
    fileName: input.fileName,
    mimeType: input.mimeType,
    size: input.content.byteLength,
    content: input.content,
  });

  return result.insertedId.toString();
}

export async function getProductFileById(id: string) {
  const collection = await getProductFilesCollection();
  const _id = new ObjectId(id);
  return collection.findOne({ _id });
}
