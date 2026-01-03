import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAUMACtBg9EOFqM1RniDJh8F7Ed3X1ttok",
  authDomain: "dayhoctructuyenquavideo.firebaseapp.com",
  projectId: "dayhoctructuyenquavideo",
  storageBucket: "dayhoctructuyenquavideo.firebasestorage.app",
  messagingSenderId: "989572036444",
  appId: "1:989572036444:web:6f83a36aeb5513267c7399",
  measurementId: "G-CEDYBETVF1"
};

console.log('🔥 Firebase Config Project ID:', firebaseConfig.projectId);

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const storage = getStorage(app);
