
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBFgQ0JCuBGhr2HB3eZ7womWIy01-sh8aE",
  authDomain: "codebox-54ff6.firebaseapp.com",
  projectId: "codebox-54ff6",
  storageBucket: "codebox-54ff6.firebasestorage.app",
  messagingSenderId: "310676588613",
  appId: "1:310676588613:web:d26a490919f6766d8ebb2c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);