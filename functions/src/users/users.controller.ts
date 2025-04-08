import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

export const handleCreateUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    
    const userRecord = await admin.auth().createUser({
      email: userData.email,
      password: userData.password,
    });
    
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email: userData.email,
      permissions: userData.permissions,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    res.status(201).json({
      uid: userRecord.uid,
      email: userData.email,
      permissions: userData.permissions,
    });
  } catch (error) {
    console.error('Create User Error:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create user' });
  }
};

export const handleGetUsers = async (req: Request, res: Response) => {
  try {
    const snapshot = await admin.firestore().collection('users').get();
    const users = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(users);
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to fetch users' });
  }
};

export const handleUpdateUser = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const userData = req.body;
    
    await admin.firestore().collection('users').doc(uid).update(userData);
    const updatedDoc = await admin.firestore().collection('users').doc(uid).get();
    
    res.status(200).json({
      uid,
      ...updatedDoc.data(),
    });
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to update user' });
  }
};