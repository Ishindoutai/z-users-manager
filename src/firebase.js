import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDfFtKwPNYnu2yTISr77l2zfScOrNpRmrU",
  authDomain: "z-users-manager.firebaseapp.com",
  databaseURL: "https://z-users-manager-default-rtdb.firebaseio.com",
  projectId: "z-users-manager",
  storageBucket: "z-users-manager.firebasestorage.app",
  messagingSenderId: "520825228121",
  appId: "1:520825228121:web:996886e02502a9928c5a48",
  measurementId: "G-49SPSN8LZ1"
};

if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, 'localhost', 8080);
  
  console.log('Conectado aos emuladores locais do Firebase');
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);