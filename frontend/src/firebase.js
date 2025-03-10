import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjMOJTZ18dkB5uOStbL9vGTNu-MRh8O7k",
  authDomain: "zpms-9ed0d.firebaseapp.com",
  projectId: "zpms-9ed0d",
  storageBucket: "zpms-9ed0d.firebasestorage.app",
  messagingSenderId: "494683582733",
  appId: "1:494683582733:web:59b845df577ff2beeac044",
  measurementId: "G-34BMVY8ETQ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

export { app, auth, db };
