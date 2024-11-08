"use client";

import React, { useState, FormEvent, ChangeEvent, useMemo } from 'react';
import { searchImages as searchUnsplashImages } from '../services/unsplashService';
import { searchImages as searchPexelsImages } from '../services/pexelsService';
import { BadgeInfo } from 'lucide-react'; // Importera informationsikonen från Lucid-icons
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'; // Importera card-komponenten från shadcn

// Lägg till en hjälpfunktion för att blanda array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

type SuggestedQuery = {
  query?: string;
  orientation?: string;
  size?: string;
  color?: string;
  isInappropriate?: boolean;
  isIrrelevant?: boolean;
};

type Photo = {
  id: string;
  urls?: {
    regular: string;
    small: string;
  };
  src?: {
    medium: string;
    small: string;
  };
  alt_description: string | null;
};

const SearchForm: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [suggestedQuery, setSuggestedQuery] = useState<SuggestedQuery | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [unsplashPhotos, setUnsplashPhotos] = useState<Photo[]>([]);
  const [pexelsPhotos, setPexelsPhotos] = useState<Photo[]>([]);

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

      const data: SuggestedQuery = await response.json();
      setSuggestedQuery(data);

      // Om texten är olämplig eller irrelevant, visa ett meddelande och avbryt bildsökningen
      if (data.isInappropriate || data.isIrrelevant) {
        setLoading(false);
        return;
      }

      // Annars sök efter bilder
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

  // Beräkna blandade bilder
  const allPhotos = useMemo(() => {
    const normalizedPhotos = [
      ...unsplashPhotos.map((photo) => ({
        id: photo.id,
        url: photo.urls?.regular || '',
        alt: photo.alt_description,
        source: 'Unsplash',
      })),
      ...pexelsPhotos.map((photo) => ({
        id: photo.id,
        url: photo.src?.medium || '',
        alt: photo.alt_description,
        source: 'Pexels',
      })),
    ];
    return shuffleArray(normalizedPhotos);
  }, [unsplashPhotos, pexelsPhotos]);

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

      {/* Om texten är olämplig, visa ett varningsmeddelande */}
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

      {/* Om texten är irrelevant, visa ett annat meddelande */}
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

      {/* Combined Images */}
      {allPhotos.length > 0 && !suggestedQuery?.isInappropriate && !suggestedQuery?.isIrrelevant && (
        <div className="py-20 px-12">
          <div className="flex gap-2 items-center py-6">
            <h3 className="text-xl font-bold">Bilder</h3>
            {suggestedQuery && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost">
                    <BadgeInfo
                      className="text-gray-600 cursor-pointer hover:text-blue-600"
                      size={20}
                    />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Sökparametrarna</SheetTitle>
                    <SheetDescription>
                      Här är informationen om AI-genererade sökparametrar för att hjälpa dig hitta rätt bilder.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="my-4">
                    <div className="mb-3">
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
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {allPhotos.map((photo) => (
              <div key={photo.id} className="relative group rounded-lg overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.alt || 'Photo'}
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Källa: {photo.source}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchForm;
