import React from 'react';
import { motion } from 'motion/react';

const VisionMissionSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='py-24 px-6 flex flex-col md:flex-row items-center'
    >
      <div className='md:w-1/2'>
        <img src='/path/to/inspiring-image.jpg' alt='Inspiring' />
      </div>
      <div className='md:w-1/2 mt-6 md:mt-0'>
        <h2 className='text-3xl font-bold'>Vår vision och mission</h2>
        <p className='mt-4'>
          <strong>Vision:</strong> Att bli den ledande plattformen för AI-driven bildhantering och hjälpa kreatörer världen över.
        </p>
        <p className='mt-2'>
          <strong>Mission:</strong> Vi gör avancerad AI-teknologi tillgänglig för alla – från fotografer till marknadsförare – för att effektivisera deras arbete.
        </p>
      </div>
    </motion.div>
  );
};

export default VisionMissionSection;
