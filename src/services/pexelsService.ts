import { NormalizedPhoto, SearchParams } from '@/lib/types';
import { createClient, PhotosWithTotalResults, ErrorResponse, Photo as PexelsPhoto } from 'pexels';

const client = createClient(process.env.NEXT_PUBLIC_PEXELS_API_KEY!);

// Funktion för att söka Pexels-bilder med specifik orientering
export const searchPexelsImages = async ({ query, color, orientation }: SearchParams) => {
  try {
    const result = await client.photos.search({
      query,
      per_page: 12,
      ...(color ? { color: color.toLowerCase() } : {}),
      ...(orientation ? { orientation: orientation.toLowerCase() } : {}),
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

// Normalisering av PexelsPhoto till vårt NormalizedPhoto-format
const normalizePexelsPhoto = (photo: PexelsPhoto): NormalizedPhoto => ({
  id: photo.id.toString(),
  url: photo.src.large,
  alt: photo.alt || 'No description',
  photographer: photo.photographer,
  photographer_url: photo.photographer_url,
  source: 'Pexels',
  orientation: photo.width > photo.height ? 'landscape' : 'portrait',
  downloadUrls: {
    original: photo.src.original,
    large2x: photo.src.large2x,
    large: photo.src.large,
    medium: photo.src.medium,
    small: photo.src.small,
  }
});

// Funktionen anropar både landskap och porträttsökningar och returnerar resultaten
export const searchPexelsLandscapeAndPortrait = async (query: string, color?: string) => {
  const landscapeImages = await searchPexelsImages({ query, color, orientation: 'landscape' });
  const portraitImages = await searchPexelsImages({ query, color, orientation: 'portrait' });
  
  return {
    landscape: landscapeImages,
    portrait: portraitImages,
  };
};
