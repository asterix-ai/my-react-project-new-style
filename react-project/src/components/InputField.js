import React from 'react';
import { motion } from 'framer-motion';

const InputField = ({ label, id, type = 'text', value, onChange, placeholder, error, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className=\"mb-4\"
    >
      {label && (
        <label htmlFor={id} className=\"block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2\">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none ${error ? 'border-rose-500' : ''}`}
        {...props}
      />
      {error && <p className=\"text-rose-500 text-xs mt-1 mr-1\">{error}</p>}
    </motion.div>
  );
};

export default InputField;
