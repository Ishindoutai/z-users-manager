// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated, onDocumentUpdated, onDocumentDeleted } = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

// Helper function to handle errors
const handleError = (res, error, message = "An error occurred") => {
  logger.error(message, error);
  res.status(500).json({ error: message });
};

// CREATE - Add new user
exports.createUser = onRequest(async (req, res) => {
  try {
    // Validate request method
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // Extract user data from request body
    const { email, password, permissions } = req.body;
    
    // Basic validation
    if (!email || !password || !permissions) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create user document
    const userRef = await db.collection("users").add({
      email,
      password: "", // In a real app, you would hash the password
      permissions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Return success response
    res.status(201).json({
      id: userRef.id,
      message: "User created successfully",
      user: { email, permissions }
    });
  } catch (error) {
    handleError(res, error, "Failed to create user");
  }
});

// READ - Get all users
exports.getUsers = onRequest(async (req, res) => {
  try {
    const usersSnapshot = await db.collection("users").get();
    const users = [];
    
    usersSnapshot.forEach(doc => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json(users);
  } catch (error) {
    handleError(res, error, "Failed to fetch users");
  }
});

// READ - Get single user
exports.getUser = onRequest(async (req, res) => {
  try {
    const userId = req.query.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const userDoc = await db.collection("users").doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      id: userDoc.id,
      ...userDoc.data()
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch user");
  }
});

// STATS - Get users statistics
exports.getUsersStats = onRequest(async (req, res) => {
  try {
    // Validate request method
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // Get all users count
    const allUsersQuery = db.collection("users");
    const allUsersSnapshot = await allUsersQuery.count().get();
    const totalUsers = allUsersSnapshot.data().count;

    // Get active users count (assuming we have an 'active' field)
    const activeUsersQuery = db.collection("users").where("active", "==", true);
    const activeUsersSnapshot = await activeUsersQuery.count().get();
    const activeUsers = activeUsersSnapshot.data().count;

    // Get admin users count (users with 'admin' permission)
    const adminUsersQuery = db.collection("users").where("permissions", "array-contains", "admin");
    const adminUsersSnapshot = await adminUsersQuery.count().get();
    const adminUsers = adminUsersSnapshot.data().count;

    // Get recently created users (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentUsersQuery = db.collection("users")
      .where("createdAt", ">", oneWeekAgo.toISOString())
      .orderBy("createdAt", "desc")
      .limit(5);
    
    const recentUsersSnapshot = await recentUsersQuery.get();
    const recentUsers = recentUsersSnapshot.docs.map(doc => ({
      id: doc.id,
      email: doc.data().email,
      createdAt: doc.data().createdAt
    }));

    // Return statistics
    res.status(200).json({
      totalUsers,
      activeUsers,
      adminUsers,
      recentUsers,
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    handleError(res, error, "Failed to fetch user statistics");
  }
});

// UPDATE - Modify user
exports.updateUser = onRequest(async (req, res) => {
  try {
    if (req.method !== "PUT") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const userId = req.query.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const { email, permissions } = req.body;
    const updateData = {
      ...(email && { email }),
      ...(permissions && { permissions }),
      updatedAt: new Date().toISOString()
    };

    await db.collection("users").doc(userId).update(updateData);

    res.status(200).json({
      message: "User updated successfully",
      userId,
      updates: updateData
    });
  } catch (error) {
    handleError(res, error, "Failed to update user");
  }
});

// DELETE - Remove user
exports.deleteUser = onRequest(async (req, res) => {
  try {
    if (req.method !== "DELETE") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const userId = req.query.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    await db.collection("users").doc(userId).delete();

    res.status(200).json({
      message: "User deleted successfully",
      userId
    });
  } catch (error) {
    handleError(res, error, "Failed to delete user");
  }
});

// Firestore Triggers for User Changes
exports.onUserCreated = onDocumentCreated("/users/{userId}", (event) => {
  const newUser = event.data.data();
  logger.log("New user created:", event.params.userId, newUser);
  // You could add additional processing here, like sending a welcome email
});

exports.onUserUpdated = onDocumentUpdated("/users/{userId}", (event) => {
  const beforeData = event.data.before.data();
  const afterData = event.data.after.data();
  logger.log(`User ${event.params.userId} updated`, {
    before: beforeData,
    after: afterData
  });
  // You could add audit logging here
});

exports.onUserDeleted = onDocumentDeleted("/users/{userId}", (event) => {
  const deletedUser = event.data.data();
  logger.log("User deleted:", event.params.userId, deletedUser);
  // You could add cleanup tasks here
});