import React from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='py-24 px-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-center text-white'
    >
      <h1 className='text-5xl font-bold'>
        Vi revolutionerar bildsökning med AI.
      </h1>
      <p className='mt-4 text-lg'>
        PixAI kombinerar kraften av artificiell intelligens och avancerad bildanalys för att skapa en enkel, snabb och intuitiv upplevelse för alla dina bildbehov.
      </p>
      <Button color="primary" className='mt-6'>
        Lär känna oss
      </Button>
    </motion.div>
  );
};

export default HeroSection;
