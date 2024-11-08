import { createClient, PhotosWithTotalResults, ErrorResponse } from 'pexels';

const client = createClient(process.env.NEXT_PUBLIC_PEXELS_API_KEY!);

type SearchParams = {
  query: string;
  orientation?: string;
  color?: string;
};

export const searchImages = async ({ query, orientation, color }: SearchParams) => {
  try {
    const result = await client.photos.search({
      query,
      per_page: 8,
      orientation: orientation?.toLowerCase(),
      color: color?.toLowerCase()
    });

    if ('error' in result) {
      throw new Error((result as ErrorResponse).error);
    }

    return (result as PhotosWithTotalResults).photos.map(photo => ({
      ...photo,
      alt_description: photo.alt // Lägg till denna rad
    }));
  } catch (error) {
    console.error('Error searching Pexels images:', error);
    throw error;
  }
};

