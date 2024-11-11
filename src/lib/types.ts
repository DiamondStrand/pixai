type DownloadUrls = {
  original?: string;
  large2x?: string;
  large?: string;
  medium?: string;
  small?: string;
};

type NormalizedPhoto = {
  id: string;
  url: string;
  alt: string | null;
  photographer: string;
  photographer_url: string;
  source: 'Unsplash' | 'Pexels';
  downloadUrls: DownloadUrls;
};