import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipLoader } from 'react-spinners';
import { Plus, Fish, Search, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

import Button from '../components/Button';
import Card from '../components/Card';
import InputField from '../components/InputField';
import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../hooks/useFirestore';
import { productService } from '../services/productService';
import { useFirebase } from '../contexts/FirebaseContext';

const HomePage = () => {
  const { currentUser } = useAuth();
  const { db, projectId } = useFirebase();
  const { data: products, loading: productsLoading, error: productsError } = useFirestore('products', [], 'createdAt');
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProductName.trim() || !newProductPrice.trim() || !newProductDescription.trim()) {
      toast.error('الرجاء ملء جميع حقول المنتج.', { icon: '⚠️' });
      return;
    }
    if (isNaN(parseFloat(newProductPrice))) {
      toast.error('السعر يجب أن يكون رقماً.', { icon: '🔢' });
      return;
    }

    setIsAddingProduct(true);
    try {
      await productService.addProduct(db, projectId, {
        name: newProductName,
        price: parseFloat(newProductPrice),
        description: newProductDescription,
        imageUrl: 'https://source.unsplash.com/random/400x300?fish&' + Math.random(), // Placeholder image
        createdAt: new Date(),
        createdBy: currentUser.uid,
      });
      toast.success('تم إضافة المنتج بنجاح!', { icon: '🎉' });
      setNewProductName('');
      setNewProductPrice('');
      setNewProductDescription('');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(`فشل إضافة المنتج: ${error.message}`, { icon: '❌' });
    } finally {
      setIsAddingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('هل أنت متأكد أنك تريد حذف هذا المنتج؟')) {
      try {
        await productService.deleteProduct(db, projectId, productId);
        toast.success('تم حذف المنتج بنجاح!', { icon: '🗑️' });
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error(`فشل حذف المنتج: ${error.message}`, { icon: '❌' });
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className=\"min-h-screen\">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className=\"text-4xl md:text-5xl font-extrabold text-center mb-10 md:mb-16 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500\"
      >
        <Sparkles className=\"inline-block w-8 h-8 md:w-10 md:h-10 text-cyan-500 mr-2\" />
        منتجات السفاريت للاسماك الطازجة
      </motion.h1>

      {currentUser && ( // Show add product form only if logged in
        <Card className=\"mb-10 p-6 md:p-8 lg:p-10\">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className=\"text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2\"
          >
            <Plus className=\"w-7 h-7 text-green-500\" />
            إضافة منتج جديد
          </motion.h2>
          <form onSubmit={handleAddProduct}>
            <InputField
              label=\"اسم المنتج\"
              id=\"productName\"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              placeholder=\"ادخل اسم المنتج (مثال: سمك بلطي)\"
            />
            <InputField
              label=\"السعر\"
              id=\"productPrice\"
              type=\"number\"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
              placeholder=\"ادخل سعر المنتج (مثال: 50.00)\"
            />
            <InputField
              label=\"الوصف\"
              id=\"productDescription\"
              value={newProductDescription}
              onChange={(e) => setNewProductDescription(e.target.value)}
              placeholder=\"وصف قصير للمنتج\"
            />
            <Button type=\"submit\" icon={Sparkles} disabled={isAddingProduct} className=\"w-full mt-4\">
              {isAddingProduct ? <ClipLoader color=\"#fff\" size={20} /> : 'إضافة المنتج'}
            </Button>
          </form>
        </Card>
      )}

      <Card className=\"mb-10 p-6 md:p-8 lg:p-10\">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className=\"text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2\"
        >
          <Fish className=\"w-7 h-7 text-indigo-500\" />
          جميع المنتجات المتوفرة
        </motion.h2>
        <InputField
          label=\"بحث عن منتج\"
          id=\"searchProduct\"
          type=\"text\"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder=\"ابحث بالاسم...\"
          icon={Search}
          className=\"mb-6\"
        />

        {productsLoading ? (
          <div className=\"flex justify-center items-center py-10\">
            <ClipLoader color=\"#6366f1\" size={50} />
            <p className=\"text-lg text-gray-600 dark:text-gray-300 mr-4\">جاري تحميل المنتجات...</p>
          </div>
        ) : productsError ? (
          <p className=\"text-rose-500 text-center text-lg\">خطأ في جلب المنتجات: {productsError}</p>
        ) : filteredProducts.length === 0 ? (
          <p className=\"text-gray-600 dark:text-gray-400 text-center text-lg\">لا توجد منتجات حالياً.</p>
        ) : (
          <div className=\"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6\">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 * filteredProducts.indexOf(product) }}
              >
                <Card className=\"!p-4 flex flex-col items-center text-center\">
                  <img src={product.imageUrl} alt={product.name} className=\"w-full h-40 object-cover rounded-2xl mb-4 shadow-md\" />
                  <h3 className=\"text-xl font-semibold text-gray-900 dark:text-white mb-2\">{product.name}</h3>
                  <p className=\"text-gray-700 dark:text-gray-300 text-sm flex-grow mb-3\">{product.description}</p>
                  <p className=\"text-purple-600 dark:text-purple-400 font-bold text-lg mb-4\">{product.price.toFixed(2)} ر.س</p>
                  <div className=\"flex gap-2 w-full\">
                    <Link to={`/product/${product.id}`} className=\"flex-1\">
                      <Button icon={Sparkles} className=\"!px-4 !py-2 !text-sm !rounded-xl w-full\">عرض التفاصيل</Button>
                    </Link>
                    {currentUser && (currentUser.uid === product.createdBy) && (
                      <Button
                        onClick={() => handleDeleteProduct(product.id)}
                        icon={Sparkles}
                        className=\"!px-4 !py-2 !text-sm !rounded-xl w-full !bg-rose-500 !to-rose-600 hover:!from-rose-600 hover:!to-rose-700\"
                      >
                        حذف
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default HomePage;
