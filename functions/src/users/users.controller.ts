import * as functions from 'firebase-functions';
import { UsersService } from './users.service';
import { UserCreateRequest, UserUpdateRequest } from './users.types';

const handleError = (error: unknown) => {
  if (error instanceof functions.https.HttpsError) throw error;
  
  const message = error instanceof Error ? error.message : 'Internal Server Error';
  functions.logger.error('Error:', error);
  throw new functions.https.HttpsError('internal', message);
};

export const userCreateCallable = functions.https.onCall(async (data: UserCreateRequest, context) => {
  try {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    
    if (!data.email || !data.password || !data.permissions) {
      throw new functions.https.HttpsError('invalid-argument', 'All fields are required');
    }

    if (!Array.isArray(data.permissions)) {
      throw new functions.https.HttpsError('invalid-argument', 'Permissions must be an array');
    }

    return await UsersService.createUser(data);
  } catch (error) {
    return handleError(error);
  }
});

export const userListCallable = functions.https.onCall(async (_, context) => {
  try {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    return await UsersService.getUsers();
  } catch (error) {
    return handleError(error);
  }
});

export const userUpdateCallable = functions.https.onCall(async (data: UserUpdateRequest, context) => {
  try {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    if (!data.uid) throw new functions.https.HttpsError('invalid-argument', 'User ID is required');
    
    return await UsersService.updateUser(data);
  } catch (error) {
    return handleError(error);
  }
});