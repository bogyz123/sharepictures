
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCGC2gTbdbw3qNG1bicebI8YPXs1tvmWYM",
  authDomain: "uploadimages-43ff9.firebaseapp.com",
  projectId: "uploadimages-43ff9",
  storageBucket: "uploadimages-43ff9.appspot.com",
  messagingSenderId: "842159621062",
  appId: "1:842159621062:web:8497201afa14ac4aa1e8c7"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);