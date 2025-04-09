// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {logger} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

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
  try {
    // Verifica o método HTTP
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Obtém o ID do usuário
    const userId = req.query.userId || req.params.userId;
    
    if (!userId) {
      return res.status(400).json({ 
        error: 'User ID is required' 
      });
    }

    // Busca no Firestore
    const db = getFirestore();
    const userRef = db.collection("users").doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Retorna os dados (excluindo a senha por segurança)
    const userData = doc.data();
    delete userData.password;

    res.status(200).json({
      success: true,
      user: {
        id: doc.id,
        ...userData
      }
    });

  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user',
      details: error.message
    });
  }
});

exports.getUserList = onRequest(async (req, res) => {
  try {
    
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

exports.updateUserById = onRequest(async (req, res) => {
  try {
    // Verifica o método HTTP
    if (req.method !== 'PUT' && req.method !== 'PATCH') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Obtém o ID do usuário e dados para atualização
    const userId = req.params.userId || req.query.userId;
    const { email, password, permissions } = req.body;

    if (!userId) {
      return res.status(400).json({ 
        error: 'User ID is required' 
      });
    }

    // Prepara os dados de atualização
    const updateData = {
      updatedAt: new Date().toISOString()
    };

    if (email) updateData.email = email;
    if (permissions) updateData.permissions = permissions;
    if (password) updateData.password = await hashPassword(password);

    // Verifica se há dados válidos para atualizar
    if (Object.keys(updateData).length <= 1) {
      return res.status(400).json({ 
        error: 'No valid fields to update' 
      });
    }

    // Atualiza no Firestore
    const userRef = db.collection("users").doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    await userRef.update(updateData);

    // Obtém os dados atualizados (sem a senha)
    const updatedDoc = await userRef.get();
    const userData = updatedDoc.data();
    delete userData.password;

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: updatedDoc.id,
        ...userData
      }
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      details: error.message
    });
  }
});

exports.deleteUserById = onRequest(async (req, res) => {
  try {
    // Verifica o método HTTP
    if (req.method !== 'DELETE') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Obtém o ID do usuário
    const userId = req.params.userId || req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ 
        error: 'User ID is required' 
      });
    }

    // Verifica se o usuário existe antes de deletar
    const userRef = db.collection("users").doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Obtém dados do usuário (para retorno antes de deletar)
    const userData = doc.data();
    delete userData.password;

    // Realiza a exclusão
    await userRef.delete();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      deletedUser: {
        id: doc.id,
        ...userData
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      details: error.message
    });
  }
});