import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

// Fetch all products for a given cafe
export const getProducts = async (cafeId) => {
  try {
    const q = query(collection(db, 'Products'), where('cafe_id', '==', cafeId));
    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products;
  } catch (error) {
    console.error("Error fetching products: ", error);
    return [];
  }
};

// Fetch a single product by ID
export const getProductById = async (productId) => {
  try {
    const docRef = doc(db, 'Products', productId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching product: ", error);
    return null;
  }
};

// Create a new request (Garson or Hesap)
export const createRequest = async (cafeId, tableNumber, requestType, paymentMethod = null) => {
  try {
    const docRef = await addDoc(collection(db, 'Requests'), {
      cafe_id: cafeId,
      table_number: tableNumber,
      request_type: requestType,
      payment_method: paymentMethod,
      status: 'bekliyor',
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding request: ", error);
    throw error;
  }
};
