import * as admin from 'firebase-admin';
import { UserCreateRequest, UserUpdateRequest, UserResponse } from './users.types';

const db = admin.firestore();

export const UsersService = {
  async createUser(userData: UserCreateRequest): Promise<UserResponse> {
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
    } as UserResponse;
  },

  async getUsers(): Promise<UserResponse[]> {
    const snapshot = await db.collection('users').get();
    return snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
    })) as UserResponse[];
  },

  async updateUser({ uid, permissions }: UserUpdateRequest): Promise<UserResponse> {
    if (!uid) throw new Error('User ID is required');
    
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
    } as UserResponse;
  }
};