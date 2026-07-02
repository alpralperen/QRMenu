import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfkORk3W0etXC3glmaVEmzHzTEKDEe5yk",
  authDomain: "qrmenu-app-da287.firebaseapp.com",
  databaseURL: "https://qrmenu-app-da287-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "qrmenu-app-da287",
  storageBucket: "qrmenu-app-da287.firebasestorage.app",
  messagingSenderId: "3587622425",
  appId: "1:3587622425:web:29225e7d245f1ea8008c88",
  measurementId: "G-KLE0LCDZNS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
