import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB3KxEi2_4er7lnsk5O3_NFw8tFl1LDEmE",
  authDomain: "responde-irmao-27406.firebaseapp.com",
  projectId: "responde-irmao-27406",
  storageBucket: "responde-irmao-27406.firebasestorage.app",
  messagingSenderId: "459596151804",
  appId: "1:459596151804:web:877a1bd2fe854e33989079",
  measurementId: "G-1D8T6N0N40"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
