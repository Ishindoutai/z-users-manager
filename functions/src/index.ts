import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { handleCreateUser, handleGetUsers, handleUpdateUser } from './users/users.controller';
import express from 'express';
import cors from 'cors';

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));

// Users endpoints
app.post('/createUser', handleCreateUser);
app.get('/getUsers', handleGetUsers);
app.post('/updateUser/:uid', handleUpdateUser);

export const api = functions.https.onRequest(app);