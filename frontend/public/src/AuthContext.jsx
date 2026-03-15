/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

function getStoredUser() {
  try {
    const stored = localStorage.getItem("nbd_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem("nbd_user");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const newUser = {
            username: email.split("@")[0],
            email,
            avatar: email.split("@")[0].substring(0, 2).toUpperCase(),
          };
          setUser(newUser);
          localStorage.setItem("nbd_user", JSON.stringify(newUser));
          resolve(newUser);
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 800);
    });
  };

  const register = (fullName, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (fullName && email && password) {
          const newUser = {
            username: fullName,
            email,
            avatar: fullName.substring(0, 2).toUpperCase(),
          };
          setUser(newUser);
          localStorage.setItem("nbd_user", JSON.stringify(newUser));
          resolve(newUser);
        } else {
          reject(new Error("All fields are required"));
        }
      }, 800);
    });
  };

  const loginWithGoogle = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          username: "Google User",
          email: "user@gmail.com",
          avatar: "GU",
        };
        setUser(newUser);
        localStorage.setItem("nbd_user", JSON.stringify(newUser));
        resolve(newUser);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("nbd_user");
  };

  const value = { user, login, register, loginWithGoogle, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
