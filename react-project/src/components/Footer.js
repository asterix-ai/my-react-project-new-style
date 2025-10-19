import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className=\"bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-6 md:py-8 text-center shadow-inner mt-12\"
    >
      <div className=\"container mx-auto px-4 sm:px-6 lg:px-8\">
        <p className=\"text-sm md:text-base flex items-center justify-center space-x-2\">
          <span>صنع بـ</span>
          <Heart className=\"w-4 h-4 text-rose-500 animate-pulse\" />
          <span>بواسطة فريق السفاريت للاسماك الطازجة</span>
          <Sparkles className=\"w-4 h-4 text-cyan-500\" />
        </p>
        <p className=\"mt-2 text-xs md:text-sm\">&copy; {new Date().getFullYear()} جميع الحقوق محفوظة.</p>
      </div>
    </motion.footer>
  );
};

export default Footer;
