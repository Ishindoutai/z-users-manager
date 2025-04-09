import * as admin from 'firebase-admin';

export interface UserCreateData {
  email: string;
  password: string;
  permissions: string[];
}

export interface UserUpdateData {
  permissions: string[];
}

export interface User extends UserCreateData {
  uid: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt?: admin.firestore.Timestamp;
}