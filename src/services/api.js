// frontend/src/services/api.js
import { db } from '../firebase';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';

const usersCollection = collection(db, 'users');

export const getUsers = async () => {
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
};

export const createUser = async (userData) => {
  const docRef = await addDoc(usersCollection, {
    email: userData.email,
    password: userData.password,
    role: userData.role || 'user',
    createdAt: new Date()
  });
  return { uid: docRef.id, ...userData };
};

export const updateUser = async (uid, userData) => {
  await updateDoc(doc(db, 'users', uid), userData);
  return { uid, ...userData };
};