'use client';

import { CreateUserData } from '@/lib/types';
import { useState, useRef } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

export default function Register() {
  const [userData, setUserData] = useState<CreateUserData>({
    firstname: '',
    lastname: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData.email.toLowerCase().endsWith('@gmail.com')) {
      toast.error('Vi kan endast ta emot ...@gmail.com adresser just nu.');
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Ett fel uppstod');
      }

      toast.success('Registreringen lyckades!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Ett fel uppstod');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center text-gray-900 dark:text-gray-50">
      <div className="mb-8 max-w-2xl mx-auto text-center gap-4 flex flex-col">
        <h1 className="text-4xl font-bold">Få förtur till Pixai</h1>
        <p>
          Genom att anmäla dig får du tidig tillgång till exklusiva funktioner,
          uppdateringar och specialerbjudanden. Missa inte chansen att vara en
          av de första som upplever det bästa vi har att erbjuda!
        </p>
        <Alert variant="warning" className="mb-4 text-xs">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="uppercase">Observera</AlertTitle>
          <AlertDescription>
            Vi tar endast emot ...@gmail.com adresser just nu.
          </AlertDescription>
        </Alert>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl mx-auto flex flex-col gap-4 p-4 bg-transparent"
      >
        <div className="flex gap-4">
          <Input
            ref={inputRef}
            type="text"
            value={userData.firstname}
            onChange={(e) =>
              setUserData({ ...userData, firstname: e.target.value })
            }
            className="h-12"
            placeholder="Förnamn"
            required
          />
          <Input
            type="text"
            value={userData.lastname}
            onChange={(e) =>
              setUserData({ ...userData, lastname: e.target.value })
            }
            className="h-12"
            placeholder="Efternamn"
            required
          />
        </div>
        <Input
          type="email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          className="h-12"
          placeholder="E-post"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="p-3 px-6 mt-4 bg-[#10a37f] text-white rounded cursor-pointer text-base hover:bg-[#0e916f] disabled:opacity-50"
        >
          {isLoading ? 'Skickar in...' : 'Anmäl dig'}
        </button>
      </form>
    </div>
  );
}
