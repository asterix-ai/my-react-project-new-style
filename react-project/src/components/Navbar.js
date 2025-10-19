import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fish, Sun, Moon, LogIn, UserPlus, LogOut, LayoutDashboard, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const Navbar = ({ toggleDarkMode, isDarkMode }) => {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('تم تسجيل الخروج بنجاح!', { icon: '👋' });
    } catch (error) {
      toast.error(`فشل تسجيل الخروج: ${error.message}`);
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=\"bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-md dark:shadow-xl sticky top-0 z-50 transition-colors duration-300\"
    >
      <div className=\"container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center\">
        <Link to=\"/\" className=\"flex items-center space-x-3 text-2xl font-bold text-indigo-600 dark:text-indigo-400\">
          <Fish className=\"w-8 h-8 text-purple-600\" />
          <span className=\"hidden sm:inline\">السفاريت للاسماك الطازجة</span>
        </Link>

        <div className=\"flex items-center space-x-4\">
          {currentUser ? (
            <>
              <Link to=\"/dashboard\" className=\"p-2 rounded-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors duration-200 group\">
                <LayoutDashboard className=\"w-6 h-6\" />
                <span className=\"sr-only\">لوحة التحكم</span>
              </Link>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className=\"flex items-center justify-center p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 group\"
              >
                <LogOut className=\"w-6 h-6\" />
                <span className=\"sr-only\">تسجيل الخروج</span>
              </motion.button>
            </>
          ) : (
            <>
              <Link to=\"/signin\" className=\"p-2 rounded-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors duration-200 group\">
                <LogIn className=\"w-6 h-6\" />
                <span className=\"sr-only\">تسجيل الدخول</span>
              </Link>
              <Link to=\"/signup\" className=\"p-2 rounded-full text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors duration-200 group\">
                <UserPlus className=\"w-6 h-6\" />
                <span className=\"sr-only\">تسجيل حساب</span>
              </Link>
            </>
          )}

          <motion.button
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className=\"p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200\"
            aria-label=\"تبديل الوضع الليلي\"
          >
            {isDarkMode ? (
              <Sun className=\"w-6 h-6 text-yellow-500\" />
            ) : (
              <Moon className=\"w-6 h-6 text-gray-700\" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
