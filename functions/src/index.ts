import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { handleCreateUser, handleGetUsers, handleUpdateUser } from './users/users.controller';

admin.initializeApp();

const corsHandler = (handler: Function) => async (req: functions.https.Request, res: functions.Response) => {
  // Configuração CORS mais segura
  const allowedOrigins = ['http://localhost:3000']; // Adicione outros domínios se necessário
  const origin = req.headers.origin || '';
  
  if (allowedOrigins.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
  }
  
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Access-Control-Allow-Credentials', 'true');

  // Responde imediatamente para requisições OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    await handler(req, res);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
  }
};

export const createUser = functions.https.onRequest(corsHandler(handleCreateUser));
export const getUsers = functions.https.onRequest(corsHandler(handleGetUsers));
export const updateUser = functions.https.onRequest(corsHandler(handleUpdateUser));