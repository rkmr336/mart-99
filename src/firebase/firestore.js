import { collection, getDocs, doc, getDoc, query, where, addDoc, updateDoc, deleteDoc, serverTimestamp, setDoc, orderBy, onSnapshot, arrayUnion } from 'firebase/firestore';
import { db } from './config';
import { GROCERY_DATA } from '../data/mockProducts';

// --- PRODUCTS ---
export const getProducts = async (filters = {}) => {
  let localData = GROCERY_DATA;
  if (filters.category) {
    localData = localData.filter(d => d.category === filters.category);
  }
  return localData;
};

export const getProductById = async (id) => {
  return GROCERY_DATA.find(p => p.id === id) || null;
};

export const addProduct = async (productData) => {
  try {
    if (productData.id) {
      const docRef = doc(db, 'products', productData.id);
      await setDoc(docRef, { ...productData, createdAt: serverTimestamp() });
      return productData.id;
    } else {
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    }
  } catch (err) {
    console.error('addProduct error:', err);
    return productData.id || null;
  }
};

export const updateProduct = async (id, updateData) => {
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, updateData);
  } catch (err) {
    console.error('updateProduct error:', err);
  }
};

export const deleteProduct = async (id) => {
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (err) {
    console.error('deleteProduct error:', err);
  }
};


// --- ORDERS ---
export const createOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (err) {
    console.error('createOrder error:', err);
    // Offline fallback — generate local ID
    const localId = 'local_' + Date.now();
    localStorage.setItem('pendingOrder_' + localId, JSON.stringify(orderData));
    return localId;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const docRef = doc(db, 'orders', orderId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
  } catch (err) {
    console.error('getOrderById error:', err);
    return null;
  }
};

export const listenToOrder = (orderId, callback) => {
  try {
    const docRef = doc(db, 'orders', orderId);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback({ id: snapshot.id, ...snapshot.data() });
      } else {
        callback(null);
      }
    }, (err) => {
      console.error('listenToOrder error:', err);
      callback(null);
    });
  } catch (err) {
    console.error('listenToOrder setup error:', err);
    return () => {};
  }
};

export const getUserOrders = async (uid) => {
  try {
    const q = query(collection(db, 'orders'), where('userId', '==', uid));
    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort in memory to avoid Firestore composite index requirement
    return orders.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return timeB - timeA;
    });
  } catch (err) {
    console.error('getUserOrders error:', err);
    return [];
  }
};

export const getAllOrdersAdmin = async () => {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error('getAllOrdersAdmin error:', err);
    return [];
  }
};

export const updateOrderStatus = async (orderId, status, note = '', updatedBy = 'admin') => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      orderStatus: status,
      updatedAt: serverTimestamp(),
      statusHistory: arrayUnion({
        status,
        timestamp: new Date(),
        note,
        updatedBy
      })
    });
  } catch (err) {
    console.error('updateOrderStatus error:', err);
  }
};

export const updateOrderCodCollection = async (orderId, collected = true) => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      'deliveryDetails.codCollected': collected,
      'deliveryDetails.actualDeliveryTime': collected ? serverTimestamp() : null,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.error('updateOrderCodCollection error:', err);
  }
};


// --- ADDRESSES ---
export const saveAddress = async (uid, addressData) => {
  try {
    if (addressData.id) {
      const docRef = doc(db, 'users', uid, 'addresses', addressData.id);
      await updateDoc(docRef, { ...addressData, updatedAt: serverTimestamp() });
      return addressData.id;
    } else {
      const addressesCol = collection(db, 'users', uid, 'addresses');
      const docRef = await addDoc(addressesCol, {
        ...addressData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    }
  } catch (err) {
    console.error('saveAddress error:', err);
    return null;
  }
};

export const getUserAddresses = async (uid) => {
  try {
    const q = query(collection(db, 'users', uid, 'addresses'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error('getUserAddresses error:', err);
    return [];
  }
};

export const deleteAddress = async (uid, addressId) => {
  try {
    await deleteDoc(doc(db, 'users', uid, 'addresses', addressId));
  } catch (err) {
    console.error('deleteAddress error:', err);
  }
};
