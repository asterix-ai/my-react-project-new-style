import { useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FirebaseContext } from '../contexts/FirebaseContext';

export const useAuth = () => {
  const { auth, db, projectId } = useContext(FirebaseContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        // You might want to fetch additional user data from Firestore here
        // For example, user roles or profile information stored in the members subcollection
        console.log('Firebase auth state changed: User logged in', user.uid);
        setCurrentUser(user);
      } else {
        console.log('Firebase auth state changed: User logged out');
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db, projectId]);

  return { currentUser, loading, error };
};
