// src/pages/api/images.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { title, description, tags, imageUrl, publicId } = req.body;

  try {
    // Här kan du lägga till logik för att spara bilddata i din databas
    // För nu, returnerar vi bara success
    res.status(200).json({ 
      message: 'Image saved successfully',
      data: { title, description, tags, imageUrl, publicId }
    });
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).json({ message: 'Failed to save image' });
  }
}