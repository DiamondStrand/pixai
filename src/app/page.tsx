import Image from "next/image";
import SearchForm from "../components/SearchForm";
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>PixAI - AI-driven bildsökning</title>
        <meta name="description" content="PixAI använder AI för att hjälpa dig hitta den perfekta bilden från Pexels, Unsplash och vår egen bildbank. Klistra bara in din text – resten sköter vi!" />
        <meta name="keywords" content="PixAI, bildsökning, AI, Pexels, Unsplash, bildbank" />
        <meta name="author" content="Cookify Media" />
        <meta property="og:title" content="PixAI - AI-driven bildsökning" />
        <meta property="og:description" content="PixAI använder AI för att hjälpa dig hitta den perfekta bilden från Pexels, Unsplash och vår egen bildbank. Klistra bara in din text – resten sköter vi!" />
        <meta property="og:image" content="/pixailogo.png" />
        <meta property="og:url" content="https://www.pixai.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PixAI - AI-driven bildsökning" />
        <meta name="twitter:description" content="PixAI använder AI för att hjälpa dig hitta den perfekta bilden från Pexels, Unsplash och vår egen bildbank. Klistra bara in din text – resten sköter vi!" />
        <meta name="twitter:image" content="/pixailogo.png" />
      </Head>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
        <header className="flex flex-col items-center mb-16 p-8 sm:p-20">
          <Image
            className="dark:invert"
            src="/pixailogo.png"
            alt="PixAI logo"
            width={180}
            height={38}
            priority
          />
          <h1 className="text-5xl font-bold mt-8 text-center">
            Välkommen till PixAI
          </h1>
          <p className="text-lg mt-4 text-center max-w-2xl">
            PixAI använder AI för att hjälpa dig hitta den perfekta bilden från Pexels, Unsplash och vår egen bildbank. Klistra bara in din text – resten sköter vi!
          </p>
          {/* Lägg till Läs mer-knappen här */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="default" className="mt-4">
                Läs mer om PixAI
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Vad är PixAI?</SheetTitle>
                <SheetDescription>
                  Här är en mer detaljerad beskrivning av vad PixAI kan erbjuda.
                </SheetDescription>
              </SheetHeader>
              <div className="my-4">
                <p className="mb-4 text-gray-800">
                  PixAI är en innovativ bildsökningsapp som använder kraften i AI för att hjälpa dig hitta exakt de bilder du behöver – snabbt och enkelt. Genom att analysera den text du klistrar in, oavsett om det handlar om en bloggartikel, ett event, en produkt eller en tjänst, genererar vår AI automatiskt de bästa sökparametrarna för att hitta de mest passande bilderna. 
                </p>
                <p className="mb-4 text-gray-800">
                  Vi söker genom Pexels, Unsplash och vår egen bildbank för att ge dig tillgång till ett stort urval av högkvalitativa bilder som fångar rätt känsla och stämning för ditt projekt. PixAI är utformad för att göra bildsökningen enkel, effektiv och träffsäker – så att du kan fokusera på att skapa engagerande innehåll.
                </p>
                <p className="text-gray-800">
                  Med PixAI kan du ta din kreativa process till nästa nivå, oavsett om du skapar marknadsföringsmaterial, uppdaterar din blogg, arrangerar ett event eller presenterar en ny produkt. Låt vår AI göra jobbet åt dig och få förslag på bilder som är skräddarsydda för dina behov – alltid redo att användas med ett klick.
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        <main className="w-full mx-auto flex-grow">
          <SearchForm />
        </main>
        <footer className="w-full bg-gray-800 text-gray-200 py-4 px-4 mt-auto">
          <div className="flex flex-col items-center">
            <p className="text-sm text-center">
              &copy; {new Date().getFullYear()} PixAI. All rights reserved. Ägs och underhålls av 
              <span className="font-bold"> Cookify</span><span className="text-[#FF9A04]">Media</span>.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
