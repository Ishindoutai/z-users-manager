import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { handleCreateUser, handleGetUsers, handleUpdateUser } from './users/users.controller';

admin.initializeApp();

// Middleware CORS
const corsHandler = async (req: functions.https.Request, res: functions.Response, handler: Function) => {
  // Configuração CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Responde imediatamente para requisições OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    await handler(req, res);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createUser = functions.https.onRequest((req, res) => 
  corsHandler(req, res, handleCreateUser)
);

export const getUsers = functions.https.onRequest((req, res) => 
  corsHandler(req, res, handleGetUsers)
);

export const updateUser = functions.https.onRequest((req, res) => 
  corsHandler(req, res, handleUpdateUser)
);