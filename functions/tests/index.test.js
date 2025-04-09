const functions = require("firebase-functions-test");
const admin = require("firebase-admin");
const { getUsers, createUser, updateUserPermissions, deleteUser } = require("../index");

// Initialize the Firebase Functions test SDK
const testEnv = functions({
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
}, "./service-account-key.json");

// Mock data
const adminUser = { uid: "admin123", email: "admin@example.com" };
const regularUser = { uid: "user123", email: "user@example.com" };

// Mock context
const adminContext = {
  auth: {
    uid: adminUser.uid,
    token: { email_verified: true },
  },
};

const userContext = {
  auth: {
    uid: regularUser.uid,
    token: { email_verified: true },
  },
};

// Mock database
beforeAll(async () => {
  await admin.firestore().collection("users").doc(adminUser.uid).set({
    email: adminUser.email,
    permissions: ["admin"],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await admin.firestore().collection("users").doc(regularUser.uid).set({
    email: regularUser.email,
    permissions: ["user"],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});

afterAll(() => {
  testEnv.cleanup();
});

describe("User Management Functions", () => {
  test("Admin can create a user", async () => {
    const data = {
      email: "newuser@example.com",
      password: "password123",
      permissions: ["user"],
    };

    const result = await createUser(data, adminContext);
    expect(result.success).toBe(true);
    expect(result.uid).toBeDefined();
  });

  test("Non-admin cannot create a user", async () => {
    const data = {
      email: "newuser2@example.com",
      password: "password123",
      permissions: ["user"],
    };

    await expect(createUser(data, userContext)).rejects.toThrow(
      "permission-denied"
    );
  });

  test("Admin can get users list", async () => {
    const result = await getUsers({}, adminContext);
    expect(result.users.length).toBeGreaterThan(0);
  });

  test("Admin can update user permissions", async () => {
    const newUser = await admin.auth().createUser({
      email: "update-test@example.com",
      password: "password123",
    });

    await admin.firestore().collection("users").doc(newUser.uid).set({
      email: "update-test@example.com",
      permissions: ["user"],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const data = {
      uid: newUser.uid,
      permissions: ["user", "editor"],
    };

    const result = await updateUserPermissions(data, adminContext);
    expect(result.success).toBe(true);

    const updatedUser = await admin.firestore().collection("users").doc(newUser.uid).get();
    expect(updatedUser.data().permissions).toEqual(["user", "editor"]);
  });

  test("Admin can delete a user", async () => {
    const newUser = await admin.auth().createUser({
      email: "delete-test@example.com",
      password: "password123",
    });

    await admin.firestore().collection("users").doc(newUser.uid).set({
      email: "delete-test@example.com",
      permissions: ["user"],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const data = { uid: newUser.uid };
    const result = await deleteUser(data, adminContext);
    expect(result.success).toBe(true);

    await expect(admin.auth().getUser(newUser.uid)).rejects.toThrow();
  });
});