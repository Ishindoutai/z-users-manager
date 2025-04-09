const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin with emulator settings if in development
if (process.env.FUNCTIONS_EMULATOR === 'true') {
  admin.initializeApp({
    projectId: 'demo-project', // Use your project ID or a dummy for emulators
    credential: admin.credential.applicationDefault(),
  });
  
  // Point to the emulators
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
} else {
  admin.initializeApp();
}

const db = admin.firestore();
const auth = admin.auth();

// Utility: Check if user is admin
const isAdmin = async (uid) => {
  if (!uid) return false;
  
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    return userDoc.exists && userDoc.data().permissions.includes('admin');
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
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
    console.error('Error creating user:', error);
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
    console.error('Error getting users:', error);
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
    console.error('Error updating permissions:', error);
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
    console.error('Error deleting user:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Utility endpoint to initialize test data (for emulator only)
if (process.env.FUNCTIONS_EMULATOR === 'true') {
  exports.initTestData = functions.https.onRequest(async (req, res) => {
    try {
      // Create an admin user
      const adminUser = await auth.createUser({
        email: 'admin@example.com',
        password: 'password123',
      });
      
      await db.collection('users').doc(adminUser.uid).set({
        email: 'admin@example.com',
        permissions: ['admin'],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Create a regular user
      const regularUser = await auth.createUser({
        email: 'user@example.com',
        password: 'password123',
      });
      
      await db.collection('users').doc(regularUser.uid).set({
        email: 'user@example.com',
        permissions: ['user'],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(200).send({ success: true });
    } catch (error) {
      console.error('Error initializing test data:', error);
      res.status(500).send({ success: false, error: error.message });
    }
  });
}