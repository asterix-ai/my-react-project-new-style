import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react'; // Default icon, can be overridden

const Button = ({ children, onClick, icon: Icon = Sparkles, className = '', ...props }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 font-medium ${className}`}
      {...props}
    >
      <Icon className=\"w-5 h-5\" />
      <span>{children}</span>
    </motion.button>
  );
};

export default Button;
