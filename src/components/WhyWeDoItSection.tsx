import React from 'react';
import { motion } from 'motion/react';
import type { QuoteProps } from '../lib/types';

const WhyWeDoItSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-24 px-6 text-center bg-gray-100"
    >
      <h2 className="text-3xl font-bold">Varför vi gör det vi gör</h2>
      <blockquote className="mt-6 text-xl italic">
        &ldquo;Vi tror på kraften av bilder och att rätt verktyg kan förändra hur vi ser på världen.&rdquo;
      </blockquote>
      <p className="mt-4">PixAI startades för att förenkla livet för kreatörer och ge dem verktyg att nå nya höjder.</p>
    </motion.div>
  );
};

export default WhyWeDoItSection;
