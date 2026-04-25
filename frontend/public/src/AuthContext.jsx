import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get extra data from Firestore if exists
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          username: firebaseUser.displayName || firebaseUser.email.split("@")[0],
          avatar: (firebaseUser.displayName || "U").substring(0, 2).toUpperCase(),
          ...(userSnap.exists() ? userSnap.data() : {})
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveUserToFirestore = async (firebaseUser, extraData = {}) => {
    const userRef = doc(db, "users", firebaseUser.uid);
    await setDoc(userRef, {
      email: firebaseUser.email,
      username: extraData.fullName || firebaseUser.displayName || firebaseUser.email.split("@")[0],
      avatar: (extraData.fullName || firebaseUser.displayName || "U").substring(0, 2).toUpperCase(),
      lastLogin: serverTimestamp(),
      createdAt: serverTimestamp(),
      ...extraData
    }, { merge: true });
  };

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await saveUserToFirestore(result.user);
    return result.user;
  };

  const register = async (fullName, email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: fullName });
    await saveUserToFirestore(result.user, { fullName });
    return result.user;
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await saveUserToFirestore(result.user);
    return result.user;
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = { user, login, register, loginWithGoogle, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
