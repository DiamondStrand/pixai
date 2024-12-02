'use client';

import { HeroSection } from '@/components/sections/hero-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { HowItWorksSection } from '@/components/sections/how-it-works-section';
import { BetaCTASection } from '@/components/sections/beta-cta-section';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#343541] text-gray-900 dark:text-gray-50">
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <BetaCTASection />
    </div>
  );
}
