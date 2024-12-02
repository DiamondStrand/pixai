import React from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

const CallToActionSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='py-24 px-6 text-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white'
    >
      <h2 className='text-3xl font-bold'>Redo att uppleva kraften i PixAI?</h2>
      <Button color="primary" className='mt-6'>
        Kom igång nu
      </Button>
    </motion.div>
  );
};

export default CallToActionSection;
