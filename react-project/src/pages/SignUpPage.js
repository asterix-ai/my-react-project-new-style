import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipLoader } from 'react-spinners';
import { UserPlus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { doc, setDoc } from 'firebase/firestore';

import Button from '../components/Button';
import Card from '../components/Card';
import InputField from '../components/InputField';
import { authService } from '../services/authService';
import { isValidEmail } from '../utils/helpers';
import { useFirebase } from '../contexts/FirebaseContext';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const navigate = useNavigate();
  const { db, projectId } = useFirebase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

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

    if (password !== confirmPassword) {
      setConfirmPasswordError('كلمتا المرور غير متطابقتين.');
      valid = false;
    }

    if (!valid) {
      toast.error('الرجاء تصحيح الأخطاء في النموذج.', { icon: '⚠️' });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await authService.register(email, password);
      const user = userCredential.user;

      // Add user to the members subcollection for tenant isolation
      await setDoc(doc(db, `projects/${projectId}/members`, user.uid), {
        email: user.email,
        roles: ['member'], // Default role
        createdAt: new Date(),
      });

      toast.success('تم إنشاء الحساب بنجاح! مرحبًا بك.', { icon: '🎉' });
      navigate('/');
    } catch (error) {
      console.error('Sign Up Error:', error);
      let errorMessage = 'فشل إنشاء الحساب. الرجاء المحاولة مرة أخرى.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'البريد الإلكتروني مستخدم بالفعل.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'كلمة المرور ضعيفة جداً. الرجاء استخدام كلمة مرور أقوى.';
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
          className=\"text-4xl font-extrabold text-gray-900 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center gap-3\"
        >
          <UserPlus className=\"w-8 h-8 text-cyan-500\" />
          إنشاء حساب جديد
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
            placeholder=\"ادخل كلمة المرور (6 أحرف على الأقل)\"
            error={passwordError}
            required
          />
          <InputField
            label=\"تأكيد كلمة المرور\"
            id=\"confirmPassword\"
            type=\"password\"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder=\"أعد إدخال كلمة المرور\"
            error={confirmPasswordError}
            required
          />
          <Button type=\"submit\" icon={Sparkles} disabled={loading} className=\"w-full mt-6\">
            {loading ? <ClipLoader color=\"#fff\" size={20} /> : 'تسجيل حساب جديد'}
          </Button>
        </form>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className=\"mt-6 text-gray-700 dark:text-gray-300\"
        >
          لديك حساب بالفعل؟{' '}
          <Link to=\"/signin\" className=\"text-purple-600 dark:text-purple-400 hover:underline font-medium\">
            سجل الدخول هنا
          </Link>
        </motion.p>
      </Card>
    </motion.div>
  );
};

export default SignUpPage;
