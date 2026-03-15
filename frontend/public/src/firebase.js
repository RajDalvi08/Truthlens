import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWfR6F_2U8rLMh02NyP-gmXe9Vbsb7mcM",
  authDomain: "truthlens-news-bias.firebaseapp.com",
  databaseURL: "https://truthlens-news-bias-default-rtdb.firebaseio.com",
  projectId: "truthlens-news-bias",
  storageBucket: "truthlens-news-bias.firebasestorage.app",
  messagingSenderId: "70633447011",
  appId: "1:70633447011:web:857840e15f4732c97d6256",
  measurementId: "G-YR4S354596"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
