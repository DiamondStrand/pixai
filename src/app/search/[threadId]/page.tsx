"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect, FormEvent, useRef, RefObject, useCallback } from "react";
import { useParams } from 'next/navigation';
import { AssistantMessage } from "@/components/AssistantMessage";
import { UserMessage } from "@/components/UserMessage";
import { searchPexelsImages } from "@/services/pexelsService";
import { searchUnsplashImages } from "@/services/unsplashService";
import { AIResponseContent, AssistantResponse, ChatMessage, NormalizedPhoto } from "@/lib/types";
import { ChevronsLeftRight, ChevronsUpDown, Filter, LayoutDashboard, LoaderPinwheel } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface ImageBank {
  id: string;
  label: string;
}

const IMAGE_BANKS: ImageBank[] = [
  { id: 'unsplash', label: 'Unsplash' },
  { id: 'pexels', label: 'Pexels' },
];

const SearchResultsPage = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userMessage, setUserMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [imagesLoading, setImagesLoading] = useState<boolean>(true);
  const [images, setImages] = useState<NormalizedPhoto[]>([]);
  const [searchTitle, setSearchTitle] = useState<string>(""); // För att visa titeln från databasen
  const params = useParams();
  const threadId = params?.threadId as string;
  const chatContainerRef: RefObject<HTMLDivElement> = useRef(null);
  const [titleNotFound, setTitleNotFound] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'landscape' | 'portrait'>('all');

  const [selectedBanks, setSelectedBanks] = useState<string[]>(['unsplash', 'pexels']);

  const toggleBank = (bankId: string, checked: boolean) => {
    setSelectedBanks(prev =>
      checked
        ? [...prev, bankId]
        : prev.filter(bank => bank !== bankId)
    );
  };

  const toggleAllBanks = (checked: boolean) => {
    setSelectedBanks(checked ? IMAGE_BANKS.map(bank => bank.id) : []);
  };

  // Scroll to the bottom of the chat container
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isSheetOpen) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [isSheetOpen]);

  // Fetch images using AI's latest search parameters
  const fetchImages = useCallback(async (query: string, color?: string) => {
    try {
      setImagesLoading(true);

      // Fetch landscape images
      const pexelsLandscapeImages = await searchPexelsImages({ query, orientation: "landscape", color });
      const unsplashLandscapeImages = await searchUnsplashImages({ query, orientation: "landscape", color });

      // Fetch portrait images
      const pexelsPortraitImages = await searchPexelsImages({ query, orientation: "portrait", color });
      const unsplashPortraitImages = await searchUnsplashImages({ query, orientation: "portrait", color });

      // Combine all images and shuffle
      const allImages = [
        ...pexelsLandscapeImages,
        ...unsplashLandscapeImages,
        ...pexelsPortraitImages,
        ...unsplashPortraitImages,
      ];

      // Randomize the order of images
      const shuffledImages = shuffleArray(allImages);
      setImages(shuffledImages);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setImagesLoading(false);
    }
  }, []);

  // Uppdatera fetchSearchData med extra felhantering
  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        const response = await fetch(`/api/searches/${threadId}`);
        if (response.ok) {
          const data = await response.json();
          setSearchTitle(data.title);

          // Kontrollera om current_query är definierad innan du använder den
          if (data.current_query && data.current_query.query) {
            await fetchImages(data.current_query.query, data.current_query.color);
          } else {
            console.warn("current_query saknas eller är ofullständig.");
          }
        } else if (response.status === 404) {
          setTitleNotFound(true);
          console.warn("No title found for threadId:", threadId);
        } else {
          console.error("Failed to fetch search data");
        }
      } catch (error) {
        console.error("Error fetching search data:", error);
      }
    };

    if (threadId) {
      fetchSearchData();
    }
  }, [threadId, fetchImages]);


// Uppdatera fetchMessages med extra felhantering
useEffect(() => {
  const fetchMessages = async () => {
    try {
      console.log("Fetching messages...");
      const response = await fetch(`/api/assistants/threads/${threadId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setChatMessages(data.messages);
        scrollToBottom();
      } else {
        console.error("Failed to fetch messages, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  if (threadId) {
    fetchMessages();
  }
}, [threadId]);


  const extractQueryParameters = (assistantResponse: string | AssistantResponse | AssistantResponse[]): AIResponseContent => {
    let parsedContent;
    try {
      if (typeof assistantResponse === "string") {
        parsedContent = JSON.parse(assistantResponse);
      } else if (Array.isArray(assistantResponse) && assistantResponse[0]?.text?.value) {
        parsedContent = JSON.parse(assistantResponse[0].text.value);
      }
    } catch (error) {
      console.error("Error parsing AI response for search parameters:", error);
    }
    return parsedContent || { query: "default search" };
  };

  // Helper function to shuffle an array randomly
  const shuffleArray = (array: NormalizedPhoto[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const getFilteredImages = () => {
    // Debug logging
    console.log('Selected banks:', selectedBanks);
    console.log('Sample image:', images[0]); // Check first image structure
  
    return images.filter(image => {
      // Debug logging for each image
      console.log('Checking image:', {
        source: image.source,
        isSourceIncluded: selectedBanks.includes(image.source?.toLowerCase()),
        orientation: image.orientation
      });
  
      // Convert sources to lowercase for comparison
      const imageSource = image.source?.toLowerCase();
      const isSourceSelected = selectedBanks.map(bank => bank.toLowerCase()).includes(imageSource);
  
      if (!isSourceSelected) {
        return false;
      }
  
      // Then apply orientation filter
      switch (activeFilter) {
        case 'landscape':
          return image.orientation === 'landscape';
        case 'portrait':
          return image.orientation === 'portrait';
        case 'all':
        default:
          return true;
      }
    });
  };

  const handleChatSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userMessage) return;

    setChatMessages((prevMessages) => [...prevMessages, { role: "user", content: userMessage }]);
    setUserMessage("");
    setLoading(true);

    try {
      const response = await fetch(`/api/assistants/threads/${threadId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantResponse = data.response.content;

        setChatMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content: assistantResponse },
        ]);

        const { query, color } = extractQueryParameters(assistantResponse);

        await fetchImages(query, color);
      } else {
        console.error("Failed to send message to AI.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMessageContent = (content: string | AssistantResponse | AssistantResponse[]): string => {
    if (typeof content === "string") {
      return content;
    } 
    if (Array.isArray(content)) {
      return content[0]?.text?.value || "Meddelandeformat kunde inte tolkas";
    }
    if ('text' in content) {
      return content.text.value;
    }
    return "Meddelandeformat kunde inte tolkas";
  };

  return (
    <div className="py-20">
      <div className="flex justify-between items-center px-6 py-2 fixed top-16 right-0 w-full bg-white z-40 border-b">
        <h3 className="text-lg">
          {searchTitle ? `${searchTitle}` : titleNotFound ? " (Titel ej hittad)" : ""}
        </h3>

        <div className="flex justify-end items-center gap-2">
          <Sheet onOpenChange={(open) => setIsSheetOpen(open)}>
            <SheetTrigger asChild>
              <Button className="py-1 rounded-lg text-sm">Förbättra Sökningen</Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col h-full p-0 w-1/3">
              <div className="flex flex-col h-full">
                <div className="px-4 py-2 border-b">
                  <SheetTitle>Förbättra din sökning</SheetTitle>
                </div>
                 {/* Chat message rendering inside <SheetContent> */}
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 p-4 scroll-smooth">
                  {chatMessages.map((msg, index) => {
                    const messageContent = getMessageContent(msg.content);
                    return msg.role === "assistant" ? (
                      <AssistantMessage key={index} content={messageContent} />
                    ) : (
                      <UserMessage key={index} content={messageContent} />
                    );
                  })}
                </div>
                <div className="sticky bottom-0 bg-white p-4 border-t">
                  <form onSubmit={handleChatSubmit} className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50">
                    <input
                      type="text"
                      placeholder="Skriv ditt meddelande..."
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      className="flex-grow p-2 rounded-lg bg-transparent focus:outline-none"
                      disabled={loading}
                    />
                    <Button type="submit" disabled={loading || !userMessage}>
                      {loading ? "Skickar..." : "Skicka"}
                    </Button>
                  </form>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {imagesLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <LoaderPinwheel className="h-8 w-8 animate-spin text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold">Bilder hämtas</h2>
          <p>Ha tålamod, vi hämtar bilder för den här sökningen.</p>
        </div>
      ) : (
        <div className="px-6 py-16">
          <h3 className="text-xl font-bold mb-4">
            Sökresultat:
          </h3>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">

              <Button
                variant={activeFilter === 'all' ? "default" : "outline"}
                onClick={() => setActiveFilter('all')}
                >
                <LayoutDashboard className="h-4 w-4 mr-1" />
                Alla
              </Button>
              <Button
                variant={activeFilter === 'landscape' ? "default" : "outline"}
                onClick={() => setActiveFilter('landscape')}
                >
                <ChevronsLeftRight className="h-4 w-4 mr-1" />
                Landskap
              </Button>
              <Button
                variant={activeFilter === 'portrait' ? "default" : "outline"}
                onClick={() => setActiveFilter('portrait')}
                >
                <ChevronsUpDown className="h-4 w-4 mr-1" />
                Porträtt
              </Button>
              </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Bildbanker</DropdownMenuLabel>
                {IMAGE_BANKS.map(bank => (
                  <DropdownMenuCheckboxItem
                    key={bank.id}
                    checked={selectedBanks.includes(bank.id)}
                    onCheckedChange={(checked) => toggleBank(bank.id, checked)}
                  >
                    {bank.label}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={selectedBanks.length === IMAGE_BANKS.length}
                  onCheckedChange={toggleAllBanks}
                >
                  Visa från alla
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 py-6">
            {getFilteredImages().map((image) => (
              <div key={image.id} className="relative mb-4 overflow-hidden rounded-lg group">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-auto object-cover transition-transform duration-300 ease-in-out transform rounded-lg"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                  {image.photographer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
