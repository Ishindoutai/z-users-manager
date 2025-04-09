import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { createUser, getUsers, updateUser } from './users.service';
import { UserCreateData, UserUpdateData } from './users.types';

admin.initializeApp();

// Helper para tratamento de erros
const handleError = (error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  functions.logger.error(message, error);
  throw new functions.https.HttpsError('internal', message);
};

// Criação de usuário
export const userCreate = functions.https.onCall(async (data: UserCreateData, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }
    
    if (!data.email || !data.password) {
      throw new functions.https.HttpsError('invalid-argument', 'Email and password are required');
    }

    return await createUser(data);
  } catch (error) {
    return handleError(error);
  }
});

// Listagem de usuários
export const userList = functions.https.onCall(async (_, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }
    
    // Exemplo de verificação de permissão
    // if (!context.auth.token.admin) {
    //   throw new functions.https.HttpsError('permission-denied', 'Admin access required');
    // }

    return await getUsers();
  } catch (error) {
    return handleError(error);
  }
});

// Atualização de usuário
export const userUpdate = functions.https.onCall(async ({ uid, ...data }: { uid: string } & UserUpdateData, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }

    if (!uid) {
      throw new functions.https.HttpsError('invalid-argument', 'User ID is required');
    }

    if (!data.permissions) {
      throw new functions.https.HttpsError('invalid-argument', 'Permissions are required');
    }

    return await updateUser(uid, data);
  } catch (error) {
    return handleError(error);
  }
});