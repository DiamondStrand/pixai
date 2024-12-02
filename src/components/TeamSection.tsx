import React from 'react';
import { motion } from 'motion/react';

const TeamSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='py-24 px-6 text-center'
    >
      <h2 className='text-3xl font-bold'>Möt vårt team</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6'>
        {/* Repeat this block for each team member */}
        <div className='p-6 bg-white rounded-lg shadow-md'>
          <img src='/path/to/profile.jpg' alt='Team Member' className='w-24 h-24 rounded-full mx-auto' />
          <h3 className='mt-4 text-xl font-bold'>Namn</h3>
          <p className='text-gray-600'>Grundare & CEO</p>
          <p className='mt-2'>Passionerad teknolog med erfarenhet inom AI och innovation.</p>
          <div className='mt-4'>
            {/* Social media icons */}
          </div>
        </div>
        {/* End of team member block */}
      </div>
    </motion.div>
  );
};

export default TeamSection;
