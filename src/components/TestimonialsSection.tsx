import React from 'react';
import { motion } from 'motion/react';

const TestimonialsSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='py-24 px-6 text-center'
    >
      <h2 className='text-3xl font-bold'>Vad våra användare säger</h2>
      <div className='mt-6'>
        {/* Carousel or grid of testimonials */}
        <div className='p-6 bg-white rounded-lg shadow-md'>
          <img src='/path/to/profile.jpg' alt='User' className='w-16 h-16 rounded-full mx-auto' />
          <blockquote className='mt-4 italic'>
            &ldquo;PixAI har revolutionerat mitt arbetsflöde. Jag hittar rätt bilder på sekunder!&rdquo;
          </blockquote>
          <p className='mt-2'>– Maria Svensson, Fotograf</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialsSection;
