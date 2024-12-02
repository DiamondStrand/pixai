"use client";

import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'
import { Moon, Sun } from 'lucide-react'
import MainMenu  from './MainMenu'

export function Header() {
  const { setTheme } = useTheme()

  return (
    <header className="w-full border-b fixed top-0 right-0 bg-white z-50">
      <div className="px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image 
            src="/pixailogo.png"
            alt="PixAI Logo"
            width={120}
            height={40}
            className="object-contain"
          />
        </Link>
        <div className='flex gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" size="icon"

              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 " />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 " />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 cursor-pointer"
            >
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <MainMenu />
        </div>
      </div>
    </header>
  )
}