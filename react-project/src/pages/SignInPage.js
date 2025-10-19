import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipLoader } from 'react-spinners';
import { LogIn, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

import Button from '../components/Button';
import Card from '../components/Card';
import InputField from '../components/InputField';
import { authService } from '../services/authService';
import { isValidEmail } from '../utils/helpers';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    let valid = true;
    if (!email.trim()) {
      setEmailError('البريد الإلكتروني مطلوب.');
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('البريد الإلكتروني غير صالح.');
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError('كلمة المرور مطلوبة.');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('كلمة المرور يجب أن لا تقل عن 6 أحرف.');
      valid = false;
    }

    if (!valid) {
      toast.error('الرجاء تصحيح الأخطاء في النموذج.', { icon: '⚠️' });
      return;
    }

    setLoading(true);
    try {
      await authService.login(email, password);
      toast.success('تم تسجيل الدخول بنجاح!', { icon: '👋' });
      navigate('/');
    } catch (error) {
      console.error('Sign In Error:', error);
      let errorMessage = 'فشل تسجيل الدخول. الرجاء المحاولة مرة أخرى.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'تم حظر هذا الحساب بسبب كثرة محاولات تسجيل الدخول الفاشلة. حاول لاحقًا.';
      }
      toast.error(errorMessage, { icon: '❌' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className=\"flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4\"
    >
      <Card className=\"w-full max-w-md p-8 md:p-10 lg:p-12 text-center\">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className=\"text-4xl font-extrabold text-gray-900 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center gap-3\"
        >
          <LogIn className=\"w-8 h-8 text-cyan-500\" />
          تسجيل الدخول
        </motion.h1>
        <form onSubmit={handleSubmit}>
          <InputField
            label=\"البريد الإلكتروني\"
            id=\"email\"
            type=\"email\"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=\"ادخل بريدك الإلكتروني\"
            error={emailError}
            required
          />
          <InputField
            label=\"كلمة المرور\"
            id=\"password\"
            type=\"password\"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=\"ادخل كلمة المرور\"
            error={passwordError}
            required
          />
          <Button type=\"submit\" icon={Sparkles} disabled={loading} className=\"w-full mt-6\">
            {loading ? <ClipLoader color=\"#fff\" size={20} /> : 'تسجيل الدخول'}
          </Button>
        </form>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className=\"mt-6 text-gray-700 dark:text-gray-300\"
        >
          ليس لديك حساب؟{' '}
          <Link to=\"/signup\" className=\"text-indigo-600 dark:text-indigo-400 hover:underline font-medium\">
            سجل حساب جديد
          </Link>
        </motion.p>
      </Card>
    </motion.div>
  );
};

export default SignInPage;
