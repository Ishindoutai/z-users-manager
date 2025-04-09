const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

// Utility: Check if user is admin
const isAdmin = async (uid) => {
  const userDoc = await db.collection('users').doc(uid).get();
  return userDoc.exists && userDoc.data().permissions.includes('admin');
};

// Create user endpoint
exports.createUser = functions.https.onCall(async (data, context) => {
  if (!context.auth || !(await isAdmin(context.auth.uid))) {
    throw new functions.https.HttpsError(
      'permission-denied', 
      'Only admins can create users'
    );
  }

  const { email, password, permissions } = data;

  if (!email || !password || !permissions) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Email, password and permissions are required'
    );
  }

  try {
    // Create auth user
    const userRecord = await auth.createUser({
      email,
      password,
    });

    // Create user document
    await db.collection('users').doc(userRecord.uid).set({
      email,
      permissions,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, uid: userRecord.uid };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Get users endpoint
exports.getUsers = functions.https.onCall(async (data, context) => {
  if (!context.auth || !(await isAdmin(context.auth.uid))) {
    throw new functions.https.HttpsError(
      'permission-denied', 
      'Only admins can access users'
    );
  }

  try {
    const snapshot = await db.collection('users').get();
    const users = [];
    
    snapshot.forEach(doc => {
      users.push({
        uid: doc.id,
        ...doc.data()
      });
    });

    return { users };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Update user permissions endpoint
exports.updateUserPermissions = functions.https.onCall(async (data, context) => {
  if (!context.auth || !(await isAdmin(context.auth.uid))) {
    throw new functions.https.HttpsError(
      'permission-denied', 
      'Only admins can update permissions'
    );
  }

  const { uid, permissions } = data;

  if (!uid || !permissions) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'User ID and permissions are required'
    );
  }

  try {
    await db.collection('users').doc(uid).update({
      permissions
    });

    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Delete user endpoint
exports.deleteUser = functions.https.onCall(async (data, context) => {
  if (!context.auth || !(await isAdmin(context.auth.uid))) {
    throw new functions.https.HttpsError(
      'permission-denied', 
      'Only admins can delete users'
    );
  }

  const { uid } = data;

  if (!uid) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'User ID is required'
    );
  }

  try {
    // Delete auth user
    await auth.deleteUser(uid);
    
    // Delete user document
    await db.collection('users').doc(uid).delete();

    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});