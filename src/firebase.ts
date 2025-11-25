
// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAG0MP9rO50sB03rfDzm2zMVA1909QZ3p4",
  authDomain: "clintechb.firebaseapp.com",
  projectId: "clintechb",
  storageBucket: "clintechb.firebasestorage.app",
  messagingSenderId: "920178640288",
  appId: "1:920178640288:web:d049a08fce1080736c90c5",
  measurementId: "G-TWDGLF1MEL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Optional: Set session persistence for auth
setPersistence(auth, browserSessionPersistence);

export { app, analytics, auth, db };
