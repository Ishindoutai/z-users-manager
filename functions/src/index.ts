import * as admin from 'firebase-admin';
import {
  userCreateCallable,
  userListCallable,
  userUpdateCallable,
} from './users/users.controller';

admin.initializeApp();

exports = module.exports = {
  userCreate: userCreateCallable,
  userList: userListCallable,
  userUpdate: userUpdateCallable,
};