import * as admin from 'firebase-admin';
import { UserCreateData, UserUpdateData } from './users.types';

const db = admin.firestore();

export const createUser = async (userData: UserCreateData) => {
  const { email, password, permissions } = userData;
  
  // Create auth user
  const userRecord = await admin.auth().createUser({
    email,
    password,
  });
  
  // Create user document in Firestore
  await db.collection('users').doc(userRecord.uid).set({
    email,
    permissions,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return {
    uid: userRecord.uid,
    email,
    permissions,
  };
};

export const getUsers = async () => {
  const snapshot = await db.collection('users').get();
  return snapshot.docs.map(doc => ({
    uid: doc.id,
    ...doc.data(),
  }));
};

export const updateUser = async (uid: string, userData: UserUpdateData) => {
  await db.collection('users').doc(uid).update(userData);
  const updatedDoc = await db.collection('users').doc(uid).get();
  return {
    uid,
    ...updatedDoc.data(),
  };
};