import * as admin from 'firebase-admin';
import { UserCreateRequest, UserUpdateRequest, UserResponse } from './users.types';

const db = admin.firestore();

export const UsersService = {
  async createUser(userData: UserCreateRequest): Promise<UserResponse> {
    const userRecord = await admin.auth().createUser({
      email: userData.email,
      password: userData.password
    });

    const userDoc = {
      email: userData.email,
      permissions: userData.permissions
    };

    await db.collection('users').doc(userRecord.uid).set(userDoc);
    
    return {
      uid: userRecord.uid,
      ...userDoc
    };
  },

  async getUsers(): Promise<UserResponse[]> {
    const snapshot = await db.collection('users').get();
    return snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    } as UserResponse));
  },

  async updateUser(data: UserUpdateRequest): Promise<UserResponse> {
    const userRef = db.collection('users').doc(data.uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      throw new Error('User not found');
    }

    await userRef.update({
      permissions: data.permissions
    });

    const updatedDoc = await userRef.get();
    
    return {
      uid: data.uid,
      ...updatedDoc.data()
    } as UserResponse;
  }
};