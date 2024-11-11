import { createApi } from 'unsplash-js';

type Photo = {
  id: string;
  width: number;
  height: number;
  urls: { 
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  color: string | null;
  user: {
    username: string;
    name: string;
    links: {
      html: string;
    }
  };
  alt_description: string | null;
};


const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_API_KEY!
});

type SearchParams = {
  query: string;
  orientation?: string;
  color?: string;
};

export const searchImages = async ({ query, orientation, color }: SearchParams) => {
  try {
    const result = await unsplash.search.getPhotos({
      query,
      perPage: 8,
      orientation: orientation?.toLowerCase() as 'landscape' | 'portrait' | 'squarish',
    });
    
    if (result.errors) {
      throw new Error(result.errors[0]);
    }
    
    return result.response?.results.map(normalizeUnsplashPhoto) || [];
  } catch (error) {
    console.error('Error searching images:', error);
    throw error;
  }
};

const normalizeUnsplashPhoto = (photo: Photo): NormalizedPhoto => ({
  id: photo.id,
  url: photo.urls.regular,
  alt: photo.alt_description,
  photographer: photo.user.name,
  photographer_url: photo.user.links.html,
  source: 'Unsplash',
  downloadUrls: {
    original: photo.urls.raw,
    large2x: photo.urls.full,
    large: photo.urls.regular,
    medium: photo.urls.small,
    small: photo.urls.thumb
  }
});