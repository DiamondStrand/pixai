"use client";

import React from 'react';
import HeroSection from '@/components/HeroSection';
import VisionMissionSection from '@/components/VisionMissionSection';
import TeamSection from '@/components/TeamSection';
import NumbersSection from '@/components/NumbersSection';
import TimelineSection from '@/components/TimelineSection';
import WhyWeDoItSection from '@/components/WhyWeDoItSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CallToActionSection from '@/components/CallToActionSection';
import FooterSection from '@/components/FooterSection';

const AboutPage = () => {
  return (
    <div className='min-h-screen'>
      <HeroSection />
      <VisionMissionSection />
      <TeamSection />
      <NumbersSection />
      <TimelineSection />
      <WhyWeDoItSection />
      <TestimonialsSection />
      <CallToActionSection />
      <FooterSection />
    </div>
  );
};

export default AboutPage;
