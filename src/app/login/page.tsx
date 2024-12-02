'use client';

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "../../components/user-auth-form"

export default function LoginPage() {
  return (
    <div className="h-screen w-full overflow-hidden">
      <div className="md:hidden">
        <Image
          src="/pixailogo.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
      </div>
      <div className="container relative hidden h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Login
        </Link>
        <div className="relative hidden h-full flex-col bg-muted px-10 py-24 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;PixAI har hjälpt oss att skapa fantastiska upplevelser för våra användare.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Välkommen tillbaka
              </h1>
              <p className="text-sm text-muted-foreground">
                Logga in med Google för att fortsätta
              </p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              Genom att fortsätta godkänner du våra{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                användarvillkor
              </Link>{" "}
              och{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                integritetspolicy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
