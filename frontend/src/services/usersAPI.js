import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

const createUser = httpsCallable(functions, 'createUser');
const getUsers = httpsCallable(functions, 'getUsers');
const updateUserPermissions = httpsCallable(functions, 'updateUserPermissions');
const deleteUser = httpsCallable(functions, 'deleteUser');

const handleError = (error) => {
  // Extrai a mensagem de erro do Firebase Functions
  const message = error.message || 
                 error.details || 
                 (error.code ? `Firebase error: ${error.code}` : 'Unknown error');
  throw new Error(message);
};

export const createNewUser = async (userData) => {
  try {
    const result = await createUser(userData);
    return result.data;
  } catch (error) {
    handleError(error);
  }
};

export const fetchUsers = async () => {
  try {
    const result = await getUsers();
    return result.data.users || [];
  } catch (error) {
    handleError(error);
  }
};

export const updatePermissions = async (uid, permissions) => {
  try {
    const result = await updateUserPermissions({ uid, permissions });
    return result.data;
  } catch (error) {
    handleError(error);
  }
};

export const removeUser = async (uid) => {
  try {
    const result = await deleteUser({ uid });
    return result.data;
  } catch (error) {
    handleError(error);
  }
};