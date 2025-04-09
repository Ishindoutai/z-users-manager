// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {logger} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const { collection, getDocs } = require("firebase/firestore");

initializeApp();

const db = getFirestore();

// Função auxiliar para hash de senha (simplificada)
async function hashPassword(password) {
  // Na prática, use bcrypt ou similar
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(password).digest('hex');
}

exports.createUser = onRequest(async (req, res) => {
  try {
    // Verifica o método HTTP
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Valida os dados de entrada
    const { email, password, permissions = [] } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Email and password are required' 
      });
    }

    // Cria o objeto de usuário
    const userData = {
      email,
      password: await hashPassword(password), // Sempre hash a senha!
      permissions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Adiciona ao Firestore
    const db = getFirestore();
    const writeResult = await db.collection("users").add(userData);
    
    // Retorna resposta de sucesso
    res.status(201).json({
      success: true,
      message: `User created successfully`,
      userId: writeResult.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      details: error.message
    });
  }
});

exports.getUserById = onRequest(async (req, res) => {
  const { userId } = req.query.params;

  const user = await getFirestore().collection.get(userId);

  res.json({ user: user });
});

exports.getUserList = onRequest(async (req, res) => {
  try {
    // Inicializa o Firestore
    const db = getFirestore();
    
    // Obtém todos os documentos da coleção 'users'
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    
    // Prepara o array de usuários
    const userList = [];
    
    snapshot.forEach(doc => {
      userList.push({
        id: doc.id,
        data: doc.data()
      });
    });
    
    // Retorna a lista de usuários
    res.status(200).json({
      success: true,
      count: userList.length,
      users: userList
    });
    
  } catch (error) {
    console.error('Error getting user list:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user list',
      details: error.message
    });
  }
});

// // Take the text parameter passed to this HTTP endpoint and insert it into
// // Firestore under the path /messages/:documentId/original
// exports.addmessage = onRequest(async (req, res) => {
//   // Grab the text parameter.
//   const original = req.query.text;
//   // Push the new message into Firestore using the Firebase Admin SDK.
//   const writeResult = await getFirestore()
//       .collection("messages")
//       .add({original: original});
//   // Send back a message that we've successfully written the message
//   res.json({result: `Message with ID: ${writeResult.id} added.`});
// });

// // Listens for new messages added to /messages/:documentId/original
// // and saves an uppercased version of the message
// // to /messages/:documentId/uppercase
// exports.makeuppercase = onDocumentCreated("/messages/{documentId}", (event) => {
//   // Grab the current value of what was written to Firestore.
//   const original = event.data.data().original;

//   // Access the parameter `{documentId}` with `event.params`
//   logger.log("Uppercasing", event.params.documentId, original);

//   const uppercase = original.toUpperCase();

//   // You must return a Promise when performing
//   // asynchronous tasks inside a function
//   // such as writing to Firestore.
//   // Setting an 'uppercase' field in Firestore document returns a Promise.
//   return event.data.ref.set({uppercase}, {merge: true});
// });