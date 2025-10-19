import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Frown, Sparkles } from 'lucide-react';
import Button from '../components/Button';

const NotFoundPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className=\"flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4\"
    >
      <Frown className=\"w-24 h-24 text-indigo-500 mb-8 animate-bounce\" />
      <h1 className=\"text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-4\">
        404
      </h1>
      <p className=\"text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-md\">
        عذرًا، الصفحة التي تبحث عنها غير موجودة.
      </p>
      <Link to=\"/\">
        <Button icon={Sparkles} className=\"mt-6\">
          العودة للصفحة الرئيسية
        </Button>
      </Link>
    </motion.div>
  );
};

export default NotFoundPage;
