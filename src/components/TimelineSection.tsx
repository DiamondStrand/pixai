import React from 'react';
import { motion } from 'motion/react';

const TimelineSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='py-24 px-6'
    >
      <h2 className='text-3xl font-bold text-center'>Vår resa</h2>
      <div className='mt-6'>
        <div className='border-l-2 border-gray-300 pl-6'>
          <div className='mb-6'>
            <h3 className='text-xl font-bold'>2022</h3>
            <p>PixAI grundades med målet att göra bildsökning enklare.</p>
          </div>
          <div className='mb-6'>
            <h3 className='text-xl font-bold'>2023</h3>
            <p>Lansering av vår första AI-drivna plattform.</p>
          </div>
          <div className='mb-6'>
            <h3 className='text-xl font-bold'>2024</h3>
            <p>1000+ användare världen över.</p>
          </div>
          <div>
            <h3 className='text-xl font-bold'>Framtiden</h3>
            <p>Expansion och fler funktioner för att stödja kreatörer globalt.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TimelineSection;
