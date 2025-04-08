const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// Criar usuário
exports.createUser = functions.https.onRequest(async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Criar usuário no Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password
    });
    
    // Salvar dados adicionais no Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      role: role || 'user',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.status(201).json({ uid: userRecord.uid, email, role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar usuários
exports.getUsers = functions.https.onRequest(async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar usuário
exports.updateUser = functions.https.onRequest(async (req, res) => {
  try {
    const { uid } = req.params;
    const updateData = req.body;
    
    // Atualizar no Firestore
    await db.collection('users').doc(uid).update(updateData);
    
    // Se email foi alterado, atualizar no Auth também
    if (updateData.email) {
      await admin.auth().updateUser(uid, { email: updateData.email });
    }
    
    res.status(200).json({ uid, ...updateData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});