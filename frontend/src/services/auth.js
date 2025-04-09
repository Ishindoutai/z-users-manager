// services/auth.js
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';

/**
 * Realiza o login do usuário
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<UserCredential>}
 */
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Realiza o logout do usuário
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error('Erro ao fazer logout. Tente novamente.');
  }
};

/**
 * Registra um novo usuário
 * @param {string} email 
 * @param {string} password 
 * @param {string} displayName 
 * @returns {Promise<UserCredential>}
 */
export const register = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Envia email para redefinição de senha
 * @param {string} email 
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Observa mudanças no estado de autenticação
 * @param {function} callback 
 * @returns {function} Função para cancelar a inscrição
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Retorna o usuário atual
 * @returns {User|null}
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Traduz códigos de erro do Firebase para mensagens amigáveis
 * @param {string} errorCode 
 * @returns {string}
 */
const getAuthErrorMessage = (errorCode) => {
  const messages = {
    'auth/invalid-email': 'E-mail inválido',
    'auth/user-disabled': 'Usuário desativado',
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'auth/email-already-in-use': 'E-mail já está em uso',
    'auth/operation-not-allowed': 'Operação não permitida',
    'auth/weak-password': 'Senha muito fraca (mínimo 6 caracteres)',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    'auth/requires-recent-login': 'Sessão expirada. Faça login novamente.',
    'default': 'Erro na autenticação. Tente novamente.'
  };

  return messages[errorCode] || messages.default;
};