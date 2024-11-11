import { createClient, PhotosWithTotalResults, ErrorResponse, Photo as PexelsPhoto } from 'pexels';

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

    return (result as PhotosWithTotalResults).photos.map(normalizePexelsPhoto);
  } catch (error) {
    console.error('Error searching Pexels images:', error);
    throw error;
  }
};

const normalizePexelsPhoto = (photo: PexelsPhoto): NormalizedPhoto => ({
  id: photo.id.toString(),
  url: photo.src.large,
  alt: photo.alt || '',
  photographer: photo.photographer,
  photographer_url: photo.photographer_url,
  source: 'Pexels',
  downloadUrls: {
    original: photo.src.original,
    large2x: photo.src.large2x,
    large: photo.src.large,
    medium: photo.src.medium,
    small: photo.src.small
  }
});

