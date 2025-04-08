const db = admin.firestore();
const usersCollection = db.collection('users');

const User = {
  async create(userData) {
    const { email, password, role } = userData;
    
    // Criar usuário na autenticação
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });
    
    // Salvar dados adicionais no Firestore
    await usersCollection.doc(userRecord.uid).set({
      email,
      role: role || 'user',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    return { uid: userRecord.uid, ...userData };
  },
  
  async update(uid, userData) {
    await usersCollection.doc(uid).update(userData);
    if (userData.email) {
      await admin.auth().updateUser(uid, { email: userData.email });
    }
    return this.get(uid);
  },
  
  async list() {
    const snapshot = await usersCollection.get();
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
  }
};