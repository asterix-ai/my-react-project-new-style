import { useState, useEffect, useContext } from 'react';
import { collection, onSnapshot, query, where, orderBy, getDoc, doc } from 'firebase/firestore';
import { FirebaseContext } from '../contexts/FirebaseContext';
import toast from 'react-hot-toast';

export const useFirestore = (collectionName, conditions = [], orderByField = null) => {
  const { db, projectId, auth } = useContext(FirebaseContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = auth.currentUser; // Get current user directly from auth instance

  useEffect(() => {
    if (!db || !currentUser) {
      setLoading(false);
      // setError(\"المستخدم غير مسجل الدخول أو Firebase غير مهيأ.\");
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    let qRef = collection(db, `projects/${projectId}/${collectionName}`);

    // Apply conditions (where clauses)
    conditions.forEach(cond => {
      qRef = query(qRef, where(cond.field, cond.operator, cond.value));
    });

    // Apply orderBy
    if (orderByField) {
      qRef = query(qRef, orderBy(orderByField));
    }

    const unsubscribe = onSnapshot(qRef,
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error(\"Firestore error: \", err);
        toast.error(`خطأ في جلب البيانات: ${err.message}`, { icon: '❌' });
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, collectionName, JSON.stringify(conditions), orderByField, currentUser, projectId]); // currentUser as dependency to re-fetch when auth state changes

  return { data, loading, error };
};

export const useFirestoreDoc = (collectionName, docId) => {
  const { db, projectId, auth } = useContext(FirebaseContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!db || !docId || !currentUser) {
      setLoading(false);
      // setError(\"المستخدم غير مسجل الدخول أو معرف المستند غير صالح.\");
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    const docRef = doc(db, `projects/${projectId}/${collectionName}`, docId);

    const unsubscribe = onSnapshot(docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setData(null);
          toast.error(\"المستند غير موجود.\", { icon: '🔍' });
        }
        setLoading(false);
      },
      (err) => {
        console.error(\"Firestore doc error: \", err);
        toast.error(`خطأ في جلب المستند: ${err.message}`, { icon: '❌' });
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, collectionName, docId, currentUser, projectId]);

  return { data, loading, error };
};
