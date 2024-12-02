"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const MainMenu = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<boolean>(false);
  
  useEffect(() => {
    const supabase = createClient();
    
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const menuLinks = [
    { href: "/", label: "Hem", public: true },
    { href: "/search", label: "Tidigare sökningar", public: false },
    { href: "/upload", label: "Ladda upp bild", public: false },
    { href: "/feedback", label: "Feedback", public: false },
  ];

  const visibleLinks = menuLinks.filter(link => link.public || session);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push('/');
  };

  return (
    <div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="max-w-[25rem]">
          <SheetHeader>
            <SheetTitle>PixAI Meny</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-4">
            {visibleLinks.map((link) => (
              <Link key={link.href} href={link.href} className="w-full" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  {link.label}
                </Button>
              </Link>
            ))}
            {session && (
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500 hover:text-red-600" 
                onClick={handleSignOut}
              >
                Logga ut
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MainMenu;
