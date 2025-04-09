import * as admin from 'firebase-admin';
import { UserCreateData, UserUpdateData, User } from './users.types';

const db = admin.firestore();

export const createUser = async (userData: UserCreateData): Promise<User> => {
  const { email, password, permissions } = userData;
  
  const userRecord = await admin.auth().createUser({ email, password });
  
  const userDoc = {
    email,
    permissions,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  
  await db.collection('users').doc(userRecord.uid).set(userDoc);
  
  return {
    uid: userRecord.uid,
    ...userDoc,
  } as User;
};

export const getUsers = async (): Promise<User[]> => {
  const snapshot = await db.collection('users').get();
  return snapshot.docs.map(doc => ({
    uid: doc.id,
    ...doc.data(),
  })) as User[];
};

export const updateUser = async (uid: string, { permissions }: UserUpdateData): Promise<User> => {
  if (!uid) throw new Error('UID is required');
  
  const updateData = {
    permissions,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  
  await db.collection('users').doc(uid).update(updateData);
  const doc = await db.collection('users').doc(uid).get();
  
  if (!doc.exists) throw new Error('User not found');
  
  return {
    uid,
    ...doc.data(),
  } as User;
};