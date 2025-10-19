import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../contexts/FirebaseContext'; // Import auth from the initialized context

export const authService = {
  /**
   * Registers a new user with email and password.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<import('firebase/auth').UserCredential>}
   */
  register: async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  },

  /**
   * Logs in an existing user with email and password.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<import('firebase/auth').UserCredential>}
   */
  login: async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  },

  /**
   * Logs out the current user.
   * @returns {Promise<void>}
   */
  logout: async () => {
    return await signOut(auth);
  }
};
