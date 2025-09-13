import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-XiR10sbZllwtcXMtNZaWAcwbGsQwHxY",
  authDomain: "voting-system-b850f.firebaseapp.com",
  projectId: "voting-system-b850f",
  storageBucket: "voting-system-b850f.firebasestorage.app",
  messagingSenderId: "648503136744",
  appId: "1:648503136744:web:4411745b49d00f9b45145d"
};

//firebase connection means project connected to firebase 
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
