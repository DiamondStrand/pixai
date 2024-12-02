"use client";

import React from 'react';
import { motion } from 'motion/react'; // Updated import path

const FooterSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='py-3 px-6 text-center bg-gray-800 text-white fixed bottom-0 w-full z-10'
    >
      <p className='text-xs'>© PixAI 2024. Alla rättigheter reserverade.</p>
    </motion.div>
  );
};

export default FooterSection;
