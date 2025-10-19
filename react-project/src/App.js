import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { useAuth } from './hooks/useAuth';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import NotFoundPage from './pages/NotFoundPage';

import './styles/globals.css';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  return (
    <FirebaseProvider>
      <Router>
        <div className=\"min-h-screen bg-gray-50 dark:bg-gray-950 font-sans antialiased text-gray-900 dark:text-gray-100 transition-colors duration-300\">
          <Toaster position=\"top-center\" reverseOrder={false} />
          <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />

          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className=\"container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-grow\"
          >
            <Routes>
              <Route path=\"/\" element={<HomePage />} />
              <Route path=\"/signin\" element={<SignInPage />} />
              <Route path=\"/signup\" element={<SignUpPage />} />
              <Route path=\"/product/:id\" element={<ProductDetailsPage />} />
              <Route path=\"*\" element={<NotFoundPage />} />
            </Routes>
          </motion.main>

          <Footer />
        </div>
      </Router>
    </FirebaseProvider>
  );
};

export default App;
