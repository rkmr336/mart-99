import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './config';

export const registerUser = async (email, password, name) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  // Create user document in Firestore
  await setDoc(doc(db, 'users', result.user.uid), {
    name,
    email,
    role: 'user',
    addresses: [],
    phone: '',
    createdAt: new Date().toISOString()
  });
  return result.user;
};

export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => {
  return signOut(auth);
};

export const getUserDoc = async (uid) => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateUserProfile = async (uid, data) => {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, data);
};
