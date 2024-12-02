import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/theme-provider"
import FooterSection from "@/components/FooterSection";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PixAI - AI-driven bildshantering",
  description: "PixAI använder AI för att hjälpa dig hitta den perfekta bilden från Pexels, Unsplash och vår egen bildbank. Klistra bara in din text – resten sköter vi!",
  keywords: ["PixAI", "bildsökning", "AI", "Pexels", "Unsplash", "bildbank"],
  authors: [{ name: "Cookify Media" }],
  creator: "Cookify Media",
  publisher: "Cookify Media",
  robots: "index, follow",
  openGraph: {
    type: "website",
    title: "PixAI - AI-driven bildhanterin",
    description: "PixAI använder AI för att hjälpa dig hitta den perfekta bilden från Pexels, Unsplash och vår egen bildbank. Klistra bara in din text – resten sköter vi!",
    siteName: "PixAI",
    url: "https://pixai-search.netlify.app",
    images: [
      {
        url: "/pixailogo.png",
        width: 800,
        height: 600,
        alt: "PixAI Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PixAI - AI-driven bildhantering",
    description: "PixAI använder AI för att hjälpa dig hitta den perfekta bilden från Pexels, Unsplash och vår egen bildbank. Klistra bara in din text – resten sköter vi!",
    images: ["/pixailogo.png"],
    creator: "@cookifymedia",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-screen relative`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
          <FooterSection />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
