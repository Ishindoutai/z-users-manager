import * as admin from 'firebase-admin';
import { UserCreateRequest, UserUpdateRequest, UserResponse } from './users.types';

const db = admin.firestore();

export const UsersService = {
  async createUser(userData: UserCreateRequest): Promise<UserResponse> {
    return await db.runTransaction(async (transaction) => {
      const userRef = db.collection('users').doc();
      
      const userRecord = await admin.auth().createUser({
        email: userData.email,
        password: userData.password,
        uid: userRef.id
      });

      const userDoc: Omit<UserResponse, 'uid'> = {
        email: userData.email,
        permissions: userData.permissions,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await transaction.set(userRef, userDoc);
      
      return {
        uid: userRecord.uid,
        ...userDoc
      };
    });
  },

  async getUsers(): Promise<UserResponse[]> {
    const snapshot = await db.collection('users').get();
    return snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    } as UserResponse));
  },

  async updateUser(data: UserUpdateRequest): Promise<UserResponse> {
    return await db.runTransaction(async (transaction) => {
      const userRef = db.collection('users').doc(data.uid);
      const doc = await transaction.get(userRef);

      if (!doc.exists) {
        throw new Error('User not found');
      }

      const updateData = {
        permissions: data.permissions,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await transaction.update(userRef, updateData);
      
      return {
        uid: data.uid,
        ...doc.data(),
        ...updateData
      } as UserResponse;
    });
  }
};