// src/context/AuthContext.tsx
import { createContext, useState, useEffect, type ReactNode } from "react";
import api from "../lib/axiosConfig";

interface User {
  _id: string;
  pfp?: string;
  name: {
    first?: string;
    last?: string;
  };
  gender?: 'male' | 'female';
  birthdate?: string; // Format: yyyy/mm/dd
  phoneNumber: string;
  email?: string;
  homeNumber?: string;
  bio?: string;
  LikedVillas?: string[]; // Array of Villa IDs
  history?: string[]; // Array of Reservation IDs
  submittedVillas?: string[]; // Array of Villa IDs
  lastLogin?: Date;
  role: 'admin' | 'user';
  createdAt?: Date;
  updatedAt?: Date;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loadUser: () => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loadUser: async () => { },
  logout: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const loadUser = async () => {
    try {
      const res = await api.get("/user/profile");
      setUser(res.data);
      setIsLoggedIn(true);
    } catch (err) {
      localStorage.removeItem("token");
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
    window.location.href = "/";   // ← redirect to home after logout
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loadUser();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loadUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};