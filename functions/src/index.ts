import * as admin from 'firebase-admin';
import {
  userCreateCallable,
  userListCallable,
  userUpdateCallable,
  userCreateHttp,
  userListHttp,
  userUpdateHttp
} from './users/users.controller';

admin.initializeApp();

// Exporta ambas as versões (Callable e HTTP)
exports = module.exports = {
  // Versão Callable (recomendada)
  userCreate: userCreateCallable,
  userList: userListCallable,
  userUpdate: userUpdateCallable,

  // Versão HTTP (para compatibilidade)
  userCreateHttp,
  userListHttp,
  userUpdateHttp
};