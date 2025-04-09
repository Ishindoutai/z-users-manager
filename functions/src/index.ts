import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { userCreateCallable, userListCallable, userUpdateCallable } from './users/users.controller';

admin.initializeApp();

export const api = {
  // Callable Functions
  userCreate: userCreateCallable,
  userList: userListCallable,
  userUpdate: userUpdateCallable,

  // HTTP Functions (opcional)
  userCreateHttp: functions.https.onRequest(async (req, res) => {
    try {
      const data = req.method === 'GET' ? req.query : req.body;
      const result = await userCreateCallable(data, { auth: req.headers.authorization ? { uid: '' } : null } as any);
      res.status(200).json({ data: result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  })
};