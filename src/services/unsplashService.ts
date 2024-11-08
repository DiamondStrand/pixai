import { createApi } from 'unsplash-js';

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
    //   color: color?.toLowerCase(),
    });
    
    if (result.errors) {
      throw new Error(result.errors[0]);
    }
    
    return result.response?.results || [];
  } catch (error) {
    console.error('Error searching images:', error);
    throw error;
  }
};