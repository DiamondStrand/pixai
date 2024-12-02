'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from "lucide-react";
import { Button } from '@/components/ui/button';
import ThreadsGrid from '@/components/ThreadsGrid';
import { createClient } from '@/utils/supabase/client';

export type CurrentQuery = {
  query: string;
  color?: string;
  isInappropriate: boolean;
  isIrrelevant: boolean;
};

// Updated Thread type to match Supabase naming convention
export type Thread = {
  id: number;
  title: string;
  description: string | null;
  thread_id: string; // Changed from threadId to thread_id
  current_query: CurrentQuery | null;
  created_at: string; // Changed from createdAt to created_at and type to string
  updated_at: string; // Changed from updatedAt to updated_at and type to string
};

// Add this type before the function
type UnknownCurrentQuery = {
  query?: unknown;
  color?: unknown;
  isInappropriate?: unknown;
  isIrrelevant?: unknown;
};

function isValidCurrentQuery(data: UnknownCurrentQuery): data is CurrentQuery {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.query === 'string' &&
    typeof data.isInappropriate === 'boolean' &&
    typeof data.isIrrelevant === 'boolean'
  );
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThreads = async () => {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('search_logs')  // Changed from 'pixai_searches' to 'search_logs'
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching threads:', error);
        setFetchError(error.message);
        return;
      }
      
      if (data) {
        const validThreads = data.map(row => ({
          ...row,
          current_query: isValidCurrentQuery(row.current_query) ? row.current_query : null,
        }));
        setThreads(validThreads);
      }
    };

    fetchThreads();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!query.trim()) {
      console.error('Query cannot be empty');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/assistants/threads", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: query }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create thread');
      }

      if (!data.threadId) {
        throw new Error("ThreadId missing in response");
      }

      router.push(`/search/${data.threadId}`);

    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="px-8 sm:px-6 lg:px-8 py-16">
        {/* Search Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sök Bilder
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Beskriv vad du letar efter så hjälper vi dig hitta den perfekta bilden
          </p>

          {!loading ? (
            <form onSubmit={handleSubmit} className='max-w-2xl mx-auto'>
              <textarea 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder="Beskriv ditt bildbehov..." 
                className="border p-2 w-full rounded-lg py-4 h-24 resize-none"
              />
              <Button
                type="submit"
                className="mt-8 w-full rounded-xl border border-solid border-transparent 
                         transition-colors flex items-center justify-center bg-[#6CA774] 
                         text-white gap-2 hover:bg-[#90CD8F] text-sm sm:text-base h-10"
              >
                Sök
              </Button>
            </form>
          ) : (
            <div className="max-w-2xl mx-auto text-center">
              <LoaderCircle className="w-16 h-16 mx-auto animate-spin text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Vi genererar din sökning...
              </h2>
              <p className="text-gray-600 text-lg">
                Ha lite tålamod medan vår AI analyserar din text och hittar de perfekta bilderna. 
                Detta kan ta några sekunder.
              </p>
            </div>
          )}
        </div>

        {/* Previous Searches Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tidigare Sökningar
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Här hittar du alla tidigare sökningar och relaterade bildresultat
          </p>
          {fetchError ? (
            <p className="text-red-500">Error loading threads: {fetchError}</p>
          ) : (
            <ThreadsGrid initialThreads={threads} />
          )}
        </div>
      </div>
    </div>
  );
}
