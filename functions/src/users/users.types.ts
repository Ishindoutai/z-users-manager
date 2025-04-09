import * as admin from 'firebase-admin';

export interface UserCreateRequest {
  email: string;
  password: string;
  permissions: string[];
}

export interface UserUpdateRequest {
  uid: string;
  permissions: string[];
}

export interface UserResponse {
  uid: string;
  email: string;
  permissions: string[];
  createdAt: admin.firestore.Timestamp;
  updatedAt?: admin.firestore.Timestamp;
}