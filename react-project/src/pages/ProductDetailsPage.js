import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipLoader } from 'react-spinners';
import { Edit, Save, Trash2, ArrowLeft, Sparkles, Fish } from 'lucide-react';
import toast from 'react-hot-toast';

import Button from '../components/Button';
import Card from '../components/Card';
import InputField from '../components/InputField';
import { useAuth } from '../hooks/useAuth';
import { useFirestoreDoc } from '../hooks/useFirestore';
import { productService } from '../services/productService';
import { useFirebase } from '../contexts/FirebaseContext';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { db, projectId } = useFirebase();
  const { data: product, loading, error } = useFirestoreDoc('products', id);

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedPrice, setEditedPrice] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (product) {
      setEditedName(product.name);
      setEditedPrice(product.price.toString());
      setEditedDescription(product.description);
    }
  }, [product]);

  const handleUpdateProduct = async () => {
    if (!editedName.trim() || !editedPrice.trim() || !editedDescription.trim()) {
      toast.error('الرجاء ملء جميع الحقول.', { icon: '⚠️' });
      return;
    }
    if (isNaN(parseFloat(editedPrice))) {
      toast.error('السعر يجب أن يكون رقماً.', { icon: '🔢' });
      return;
    }

    setIsSaving(true);
    try {
      await productService.updateProduct(db, projectId, id, {
        name: editedName,
        price: parseFloat(editedPrice),
        description: editedDescription,
      });
      toast.success('تم تحديث المنتج بنجاح!', { icon: '✅' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(`فشل تحديث المنتج: ${error.message}`, { icon: '❌' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (window.confirm('هل أنت متأكد أنك تريد حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.')) {
      setIsDeleting(true);
      try {
        await productService.deleteProduct(db, projectId, id);
        toast.success('تم حذف المنتج بنجاح!', { icon: '🗑️' });
        navigate('/'); // Redirect to homepage after deletion
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error(`فشل حذف المنتج: ${error.message}`, { icon: '❌' });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className=\"flex justify-center items-center min-h-[calc(100vh-200px)]\">
        <ClipLoader color=\"#6366f1\" size={60} />
        <p className=\"text-lg text-gray-600 dark:text-gray-300 mr-4\">جاري تحميل تفاصيل المنتج...</p>
      </div>
    );
  }

  if (error) {
    return <p className=\"text-rose-500 text-center text-xl mt-10\">خطأ: {error}</p>;
  }

  if (!product) {
    return <p className=\"text-gray-600 dark:text-gray-400 text-center text-xl mt-10\">المنتج غير موجود.</p>;
  }

  // Check if current user is the creator of the product
  const isCreator = currentUser && product.createdBy === currentUser.uid;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className=\"max-w-4xl mx-auto\"
    >
      <Button onClick={() => navigate(-1)} icon={ArrowLeft} className=\"mb-6 !bg-gray-200 !from-gray-300 !to-gray-400 !text-gray-800 hover:!from-gray-400 hover:!to-gray-500\">
        العودة
      </Button>

      <Card className=\"p-8 md:p-10 lg:p-12 flex flex-col md:flex-row gap-8\">
        <motion.img
          src={product.imageUrl}
          alt={product.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className=\"w-full md:w-1/2 h-64 object-cover rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700\"
        />
        <div className=\"md:w-1/2\">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className=\"text-4xl font-extrabold text-gray-900 dark:text-white mb-4 flex items-center gap-3\"
          >
            <Fish className=\"w-9 h-9 text-indigo-500\" />
            {product.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className=\"mb-6\"
          >
            {isEditing ? (
              <InputField
                label=\"اسم المنتج\"
                id=\"editProductName\"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className=\"mb-4\"
              />
            ) : (
              <p className=\"text-gray-700 dark:text-gray-300 text-lg mb-2\">{product.name}</p>
            )}

            <p className=\"text-purple-600 dark:text-purple-400 font-bold text-3xl mb-4\">
              {editedPrice} ر.س
            </p>
            {isEditing ? (
              <InputField
                label=\"السعر (ر.س)\"
                id=\"editProductPrice\"
                type=\"number\"
                value={editedPrice}
                onChange={(e) => setEditedPrice(e.target.value)}
                className=\"mb-4\"
              />
            ) : null}

            <p className=\"text-gray-600 dark:text-gray-300 text-md leading-relaxed mb-6\">
              {editedDescription}
            </p>
            {isEditing ? (
              <InputField
                label=\"الوصف\"
                id=\"editProductDescription\"
                type=\"textarea\"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className=\"mb-4\"
              />
            ) : null}

            <p className=\"text-sm text-gray-500 dark:text-gray-400 mt-4\">
              تاريخ الإضافة: {new Date(product.createdAt.toDate()).toLocaleDateString('ar-EG')}
            </p>
          </motion.div>

          {isCreator && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className=\"flex flex-wrap gap-4 mt-6\"
            >
              {isEditing ? (
                <Button onClick={handleUpdateProduct} icon={Save} disabled={isSaving}>
                  {isSaving ? <ClipLoader color=\"#fff\" size={20} /> : 'حفظ التعديلات'}
                </Button>
              ) : (
                <Button onClick={() => setIsEditing(true)} icon={Edit} className=\"!from-cyan-500 !to-blue-600\">
                  تعديل المنتج
                </Button>
              )}
              <Button onClick={handleDeleteProduct} icon={Trash2} disabled={isDeleting} className=\"!bg-rose-500 !to-rose-600 hover:!from-rose-600 hover:!to-rose-700\">
                {isDeleting ? <ClipLoader color=\"#fff\" size={20} /> : 'حذف المنتج'}
              </Button>
              {isEditing && (
                <Button onClick={() => setIsEditing(false)} className=\"!bg-gray-400 !to-gray-500 hover:!from-gray-500 hover:!to-gray-600\" icon={ArrowLeft}>
                  إلغاء
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default ProductDetailsPage;
