import React from 'react';
import { motion } from 'motion/react';

const NumbersSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='py-24 px-6 text-center bg-gray-100'
    >
      <h2 className='text-3xl font-bold'>PixAI i siffror</h2>
      <div className='flex justify-around mt-6'>
        <div>
          <h3 className='text-4xl font-bold'>1000+</h3>
          <p>Användare världen över.</p>
        </div>
        <div>
          <h3 className='text-4xl font-bold'>10 miljoner</h3>
          <p>Bilder analyserade.</p>
        </div>
        <div>
          <h3 className='text-4xl font-bold'>99.9%</h3>
          <p>Nöjdhetsgrad.</p>
        </div>
        <div>
          <h3 className='text-4xl font-bold'>24/7</h3>
          <p>Tillgänglig support.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default NumbersSection;
