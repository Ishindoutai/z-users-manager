import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UsersService } from './users.service';
import { UserCreateRequest, UserUpdateRequest } from './users.types';

admin.initializeApp();

// Helper para tratamento de erros
const handleError = (error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  functions.logger.error('Error:', message, error);
  throw new functions.https.HttpsError('internal', message);
};

// Versão Callable (recomendada)
export const userCreateCallable = functions.https.onCall(async (data: UserCreateRequest, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }
    
    if (!data.email || !data.password) {
      throw new functions.https.HttpsError('invalid-argument', 'Email and password are required');
    }

    return await UsersService.createUser(data);
  } catch (error) {
    return handleError(error);
  }
});

export const userListCallable = functions.https.onCall(async (_, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }
    
    // Verificação de permissão de exemplo
    // if (!context.auth.token.admin) {
    //   throw new functions.https.HttpsError('permission-denied', 'Admin access required');
    // }

    return await UsersService.getUsers();
  } catch (error) {
    return handleError(error);
  }
});

export const userUpdateCallable = functions.https.onCall(async (data: UserUpdateRequest, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }

    if (!data.uid) {
      throw new functions.https.HttpsError('invalid-argument', 'User ID is required');
    }

    if (!data.permissions || !Array.isArray(data.permissions)) {
      throw new functions.https.HttpsError('invalid-argument', 'Valid permissions array is required');
    }

    return await UsersService.updateUser(data);
  } catch (error) {
    return handleError(error);
  }
});

// Versão HTTP (se necessário para CORS)
const corsHandler = (handler: (req: functions.https.Request) => Promise<any>) => 
  async (req: functions.https.Request, res: functions.Response) => {
    // Configuração CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    try {
      const data = req.method === 'GET' ? req.query : req.body;
      const result = await handler(data);
      res.status(200).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal Server Error';
      res.status(500).json({ error: message });
    }
  };

export const userCreateHttp = functions.https.onRequest(
  corsHandler(async (data: any) => {
    if (!data.email || !data.password) {
      throw new Error('Email and password are required');
    }
    return UsersService.createUser(data as UserCreateRequest);
  })
);

export const userListHttp = functions.https.onRequest(
  corsHandler(async () => UsersService.getUsers())
);

export const userUpdateHttp = functions.https.onRequest(
  corsHandler(async (data: any) => {
    if (!data.uid) throw new Error('User ID is required');
    if (!data.permissions) throw new Error('Permissions are required');
    return UsersService.updateUser(data as UserUpdateRequest);
  })
);