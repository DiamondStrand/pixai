"use client";

import * as React from "react";
import { useSearchParams } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserAuthFormProps } from "@/lib/types";

// Wrappa komponenten som använder useSearchParams i en separat komponent som kan ligga inom Suspense
function SearchParamsHandler({ onGoogleLogin }: { onGoogleLogin: (next: string) => void }) {
  const searchParams = useSearchParams();
  const next = searchParams?.get('next') || '/search';

  return (
    <Button
      variant="outline"
      type="button"
      size="lg"
      onClick={() => onGoogleLogin(next)}
      className="w-full"
    >
      Fortsätt med Google
    </Button>
  );
}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleGoogleLogin = async (next: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ next }),
      });

      const { url, error } = await response.json();
      if (error) throw new Error(error);
      if (url) window.location.href = url;

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <React.Suspense fallback={<div>Laddar...</div>}>
        <SearchParamsHandler onGoogleLogin={handleGoogleLogin} />
      </React.Suspense>
      {isLoading && (
        <div className="w-full flex justify-center">
          <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
      )}
    </div>
  );
}
