"use client";

import React, { useState, FormEvent, ChangeEvent, useMemo } from 'react';
import { searchImages as searchUnsplashImages } from '../services/unsplashService';
import { searchImages as searchPexelsImages } from '../services/pexelsService';
import { BadgeInfo, Check, Copy } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

type SuggestedQuery = {
  query?: string;
  orientation?: string;
  size?: string;
  color?: string;
  isInappropriate?: boolean;
  isIrrelevant?: boolean;
};

// Lägg till shuffleArray-funktionen
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const SearchForm: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [suggestedQuery, setSuggestedQuery] = useState<SuggestedQuery | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [unsplashPhotos, setUnsplashPhotos] = useState<NormalizedPhoto[]>([]);
  const [pexelsPhotos, setPexelsPhotos] = useState<NormalizedPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<NormalizedPhoto | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/generateSearchTerm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: query }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setSuggestedQuery(data);

      const [unsplashResults, pexelsResults] = await Promise.all([
        searchUnsplashImages({
          query: data.query!,
          orientation: data.orientation,
          color: data.color,
        }),
        searchPexelsImages({
          query: data.query!,
          orientation: data.orientation,
          color: data.color,
        }),
      ]);

      setUnsplashPhotos(unsplashResults);
      setPexelsPhotos(pexelsResults);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  };

  const allPhotos = useMemo(() => {
    const normalizedPhotos = [
      ...unsplashPhotos,
      ...pexelsPhotos,
    ];
    return shuffleArray(normalizedPhotos);
  }, [unsplashPhotos, pexelsPhotos]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Återställ efter 2 sekunder
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="p-4 w-full max-w-3xl mx-auto">
        <textarea
          value={query}
          onChange={handleChange}
          placeholder="Beskriv ditt bildbehov..."
          className="border p-2 w-full rounded-lg py-4 h-24 resize-none"
        />
        <button
          type="submit"
          className="mt-8 w-full rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        >
          {loading ? 'Söker...' : 'Sök'}
        </button>
      </form>

      {suggestedQuery?.isInappropriate && (
        <div className="py-20 px-12 flex justify-center">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="text-red-600">Innehållet är olämpligt</CardTitle>
              <CardDescription>
                Våra villkor godkänner inte bilder associerade med din sökning. Var vänlig och försök med en annan sökning.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Vi strävar efter att tillhandahålla säkert och respektfullt innehåll för alla användare.</p>
            </CardContent>
          </Card>
        </div>
      )}

      {suggestedQuery?.isIrrelevant && (
        <div className="py-20 px-12 flex justify-center">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="text-yellow-600">Texten är irrelevant</CardTitle>
              <CardDescription>
                Detta är ingen text som kan användas för att hitta relevanta bilder. Var vänlig och försök med en annan sökning.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Försök beskriva ditt bildbehov med mer specifika eller bildrelaterade termer.</p>
            </CardContent>
          </Card>
        </div>
      )}

      {allPhotos.length > 0 && (
        <div className="py-20 px-12">
          <div className="flex gap-2 items-center py-6">
            <h3 className="text-xl font-bold">Bilder</h3>
            {suggestedQuery && (
              <Sheet>
                <SheetTrigger asChild>
                  <BadgeInfo
                    className="text-gray-600 cursor-pointer hover:text-blue-600"
                    size={20}
                  />
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Sökparametrarna</SheetTitle>
                    <SheetDescription>
                      <div className="my-4">
                        <h4 className="font-semibold text-md">Sökterm:</h4>
                        <p className="text-gray-800">{suggestedQuery.query}</p>
                      </div>
                      <div className="mb-3">
                        <h4 className="font-semibold text-md">Orientering:</h4>
                        <p className="text-gray-800 capitalize">{suggestedQuery.orientation}</p>
                      </div>
                      <div className="mb-3">
                        <h4 className="font-semibold text-md">Storlek:</h4>
                        <p className="text-gray-800 capitalize">{suggestedQuery.size}</p>
                      </div>
                      <div className="mb-3">
                        <h4 className="font-semibold text-md">Färgtema:</h4>
                        <p className="text-gray-800 capitalize">{suggestedQuery.color}</p>
                      </div>
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allPhotos.map((photo) => (
              <Dialog key={photo.id}>
                <DialogTrigger asChild>
                  <div className="relative aspect-video group cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
                    <img
                      src={photo.url}
                      alt={photo.alt || 'Photo'}
                      className="object-cover w-full h-full rounded-lg"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Källa: {photo.source}
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-6xl mx-auto">
                  <DialogHeader>
                    <DialogTitle className='py-4'>Bildinformation</DialogTitle>
                    <DialogDescription>
                      <div className="flex flex-col sm:flex-row gap-8">
                        <img
                          src={photo.url}
                          alt={photo.alt || 'Photo'}
                          className="object-cover w-full sm:w-4/6 rounded-lg"
                        />
                        <div className="sm:ml-4 mt-4 sm:mt-0 w-full">
                          <div>
                            <h4 className="font-semibold text-md">Fotograf:</h4>
                            <p className="text-gray-800">
                              <a href={photo.photographer_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {photo.photographer}
                              </a>
                            </p>
                          </div>
                          <div className="mt-4">
                            <h4 className="font-semibold text-md">Referera till fotografen:</h4>
                            <div className="flex items-center gap-2">
                              <p className="text-gray-800">Foto av: {photo.photographer} från {photo.source}</p>
                              <button
                                onClick={() => copyToClipboard(`Foto av: ${photo.photographer} från ${photo.source}`)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                {copySuccess ? (
                                  <Check className="text-green-500" size={20}/>
                                ) : (
                                  <Copy className="text-gray-800" size={20} />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="mt-4">
                            <h4 className="font-semibold text-md">Källa:</h4>
                            <p className="text-gray-800 capitalize">{photo.source}</p>
                            <a href={photo.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              Visa på {photo.source}
                            </a>
                          </div>
                          <div className="mt-4">
                            <h4 className="font-semibold text-md">Nedladdningslänkar:</h4>
                            <div className="flex flex-col gap-2 mt-2">
                              {photo.downloadUrls?.original && (
                                <a href={photo.downloadUrls.original} download className="bg-blue-600 text-white py-2 px-4 rounded-lg text-center">
                                  Original
                                </a>
                              )}
                              {photo.downloadUrls?.large2x && (
                                <a href={photo.downloadUrls.large2x} download className="bg-blue-600 text-white py-2 px-4 rounded-lg text-center">
                                  Large 2x
                                </a>
                              )}
                              {photo.downloadUrls?.large && (
                                <a href={photo.downloadUrls.large} download className="bg-blue-600 text-white py-2 px-4 rounded-lg text-center">
                                  Large
                                </a>
                              )}
                              {photo.downloadUrls?.medium && (
                                <a href={photo.downloadUrls.medium} download className="bg-blue-600 text-white py-2 px-4 rounded-lg text-center">
                                  Medium
                                </a>
                              )}
                              {photo.downloadUrls?.small && (
                                <a href={photo.downloadUrls.small} download className="bg-blue-600 text-white py-2 px-4 rounded-lg text-center">
                                  Small
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchForm;
