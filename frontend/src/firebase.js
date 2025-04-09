import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions(app);

export { auth, functions };