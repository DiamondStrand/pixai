'use client';

import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

export function BetaCTASection() {
  const router = useRouter();

  return (
    <>
      <div className="relative overflow-hidden py-24 lg:py-32">
        {/* Gradients */}
        <div
          aria-hidden="true"
          className="flex absolute -bottom-96 start-1/2 transform -translate-x-1/2"
        >
          <div className="bg-gradient-to-r from-background/50 to-background blur-3xl w-[13rem] h-[20rem] rotate-[-60deg] transform -translate-x-[10rem]" />
          <div className="bg-gradient-to-tl blur-3xl w-[90rem] h-[40rem] rounded-full origin-top-left -rotate-12 -translate-x-[15rem] from-primary-foreground via-primary-foreground to-background" />
        </div>
        {/* End Gradients */}
        <div className="relative z-10">
          <div className="py-10 lg:py-16">
            <div className="max-w-2xl text-center mx-auto">
              {/* Title */}
              <div className="mt-5 max-w-2xl">
                <h2 className="scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-6xl">
                  Var först med att uppleva framtidens AI tjänster!
                </h2>
              </div>
              {/* End Title */}
              <div className="mt-5 max-w-5xl">
                <p className="text-xl text-muted-foreground">
                  Bli en del av framtiden! Anmäl ditt intresse för att bli en betatestare. Din feedback hjälper oss att finslipa och förbättra PixAI.
                </p>
              </div>
              <div className="mt-8">
                <Button onClick={() => router.push('/register')}>
                  Anmäl ditt intresse
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
