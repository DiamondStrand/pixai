'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { UserAuthForm } from '../user-auth-form';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Alert, AlertDescription } from '../ui/alert';

export function HeroSection() {
  const [isLocal, setIsLocal] = useState<boolean | null>(null);

  useEffect(() => {
    setIsLocal(
      window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
    );
  }, []);

  const variants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1], // nice ease curve
        type: 'spring',
        damping: 20,
      },
    },
  };

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden py-24">
        {/* Gradients */}
        <div
          aria-hidden="true"
          className="flex absolute -top-96 start-1/2 transform -translate-x-1/2"
        >
          <div className="bg-gradient-to-r from-background/50 to-background blur-3xl w-[25rem] h-[44rem] rotate-[-60deg] transform -translate-x-[10rem]" />
          <div className="bg-gradient-to-tl blur-3xl w-[90rem] h-[50rem] rounded-full origin-top-left -rotate-12 -translate-x-[15rem] from-primary-foreground via-primary-foreground to-background" />
        </div>
        {/* End Gradients */}
        <div className="relative z-10">
          <div className="w-full flex justify-center">
            <Alert className="max-w-lg text-center mx-auto" variant="warning">
              <AlertDescription className="uppercase">
                PixAI är för närvarande i beta-version
              </AlertDescription>
            </Alert>
          </div>
          <div className="py-10 lg:py-16">
            <div className="max-w-2xl text-center mx-auto">
              <p>Kraftfull bildhantering med AI</p>
              {/* Title */}
              <div className="mt-5 max-w-2xl">
                <h1 className="box scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-6xl">
                  Välkommen till PixAI
                </h1>
              </div>
              {/* End Title */}
              <div className="mt-5 max-w-3xl">
                <p className="text-xl text-muted-foreground">
                  PixAI hjälper dig att söka, hitta och organisera bilder med
                  hjälp av AI för event, artiklar och projekt.
                </p>
              </div>
              {/* Inloggningsformulär */}
              <div className="mt-8 space-y-4">
                {isLocal === null ? null : isLocal ? (
                  <motion.div
                    variants={variants}
                    initial="hidden"
                    animate="visible"
                  >
                    <UserAuthForm />
                    <p className="text-sm text-gray-400 pt-2">
                      Endast för inbjudna användare
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={variants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Button
                      variant="link"
                      className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      <Link href="/register">Skriv upp dig på väntelistan</Link>
                    </Button>
                    <p className="text-sm text-gray-400 pt-2">
                      Kommer snart...
                    </p>
                  </motion.div>
                )}
              </div>
              {/* Slut på Inloggningsformulär */}
            </div>
          </div>
        </div>
      </div>
      {/* End Hero */}
    </>
  );
}
