import { collection, addDoc, getDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export const productService = {
  /**
   * Adds a new product to Firestore.
   * @param {import('firebase/firestore').Firestore} db The Firestore instance.
   * @param {string} projectId The project ID for tenant isolation.
   * @param {object} productData The product data to add.
   * @returns {Promise<import('firebase/firestore').DocumentReference>}
   */
  addProduct: async (db, projectId, productData) => {
    const productsCollectionRef = collection(db, `projects/${projectId}/products`);
    return await addDoc(productsCollectionRef, productData);
  },

  /**
   * Retrieves a single product by its ID.
   * @param {import('firebase/firestore').Firestore} db The Firestore instance.
   * @param {string} projectId The project ID for tenant isolation.
   * @param {string} productId The ID of the product to retrieve.
   * @returns {Promise<object | null>}
   */
  getProduct: async (db, projectId, productId) => {
    const productDocRef = doc(db, `projects/${projectId}/products`, productId);
    const docSnap = await getDoc(productDocRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  },

  /**
   * Updates an existing product.
   * @param {import('firebase/firestore').Firestore} db The Firestore instance.
   * @param {string} projectId The project ID for tenant isolation.
   * @param {string} productId The ID of the product to update.
   * @param {object} newData The new data for the product.
   * @returns {Promise<void>}
   */
  updateProduct: async (db, projectId, productId, newData) => {
    const productDocRef = doc(db, `projects/${projectId}/products`, productId);
    return await updateDoc(productDocRef, newData);
  },

  /**
   * Deletes a product by its ID.
   * @param {import('firebase/firestore').Firestore} db The Firestore instance.
   * @param {string} projectId The project ID for tenant isolation.
   * @param {string} productId The ID of the product to delete.
   * @returns {Promise<void>}
   */
  deleteProduct: async (db, projectId, productId) => {
    const productDocRef = doc(db, `projects/${projectId}/products`, productId);
    return await deleteDoc(productDocRef);
  }
};
