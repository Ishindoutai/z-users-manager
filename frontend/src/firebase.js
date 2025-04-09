import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions(app);

// Configuração do emulador
if (process.env.REACT_APP_USE_EMULATORS === 'true') {
  // Configura o URL base para o emulador de autenticação
  const authEmulatorUrl = `http://${process.env.REACT_APP_FIREBASE_AUTH_EMULATOR_HOST}`;
  connectAuthEmulator(auth, authEmulatorUrl, { disableWarnings: true });
  
  // Configura o emulador de funções
  const [functionsHost, functionsPort] = process.env.REACT_APP_FIREBASE_FUNCTIONS_EMULATOR_HOST.split(':');
  connectFunctionsEmulator(functions, functionsHost, parseInt(functionsPort));
  
  console.log('✅ Firebase Emulators connected:', {
    auth: authEmulatorUrl,
    functions: `${functionsHost}:${functionsPort}`
  });
}

export { auth, functions };