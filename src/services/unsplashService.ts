import { createApi } from 'unsplash-js';
import { SearchParams, Photo, NormalizedPhoto } from '@/lib/types';

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_API_KEY!,
});

// Sökning på Unsplash med specifik orientering
export const searchUnsplashImages = async ({ query, color, orientation }: SearchParams) => {
  try {
    const result = await unsplash.search.getPhotos({
      query,
      perPage: 12,
      orientation: orientation?.toLowerCase() as 'landscape' | 'portrait' | 'squarish',
    });
    
    if (result.errors) {
      throw new Error(result.errors[0]);
    }

    return result.response?.results.map(normalizeUnsplashPhoto) || [];
  } catch (error) {
    console.error('Error searching Unsplash images:', error);
    throw error;
  }
};

// Normaliserar UnsplashPhoto till vårt NormalizedPhoto-format
const normalizeUnsplashPhoto = (photo: Photo): NormalizedPhoto => ({
  id: photo.id,
  url: photo.urls.regular,
  alt: photo.alt_description || 'No description',
  photographer: photo.user.name,
  photographer_url: photo.user.links.html,
  source: 'Unsplash',
  orientation: photo.width > photo.height ? 'landscape' : 'portrait',
  downloadUrls: {
    original: photo.urls.raw,
    large2x: photo.urls.full,
    large: photo.urls.regular,
    medium: photo.urls.small,
    small: photo.urls.thumb,
  }
});

// Anropar Unsplash för både landskap och porträttsökningar
export const searchUnsplashLandscapeAndPortrait = async (query: string, color?: string) => {
  const landscapeImages = await searchUnsplashImages({ query, color, orientation: 'landscape' });
  const portraitImages = await searchUnsplashImages({ query, color, orientation: 'portrait' });
  
  return {
    landscape: landscapeImages,
    portrait: portraitImages,
  };
};
