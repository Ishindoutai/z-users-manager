import * as admin from 'firebase-admin';

export interface UserCreateData {
  email: string;
  password: string;
  permissions: string[];
}

export interface UserUpdateData {
  permissions?: string[];
}

export interface User {
  uid: string;
  email: string;
  permissions: string[];
  createdAt?: admin.firestore.Timestamp;
}