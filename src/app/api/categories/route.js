// pages/api/update-category.js or app/api/categories/route.js (depending on your Next.js version)

import { Client, Databases, Storage, ID } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY); // This only works in node-appwrite

const databases = new Databases(client);
const storage = new Storage(client);

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).end('Method Not Allowed');

  const { categoryId, categoryName, imageBase64, imageName } = req.body;

  try {
    let imageUrl = '';

    if (imageBase64 && imageName) {
      const buffer = Buffer.from(imageBase64.split(',')[1], 'base64');

      const file = await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
        ID.unique(),
        buffer, // `node-appwrite` accepts Buffer directly
        imageName,
        'image/jpeg'
      );

      imageUrl = storage.getFileView(
        process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
        file.$id
      ).href;
    }

    const updated = await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_CATEGORY_ID,
      categoryId,
      {
        category: categoryName,
        ...(imageUrl && { image: imageUrl }),
      }
    );

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
