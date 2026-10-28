import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const token = localStorage.getItem('prepify_token');
      if (token) {
        try {
          const res = await api.getMe();
          if (res.user) {
            setCurrentUser(res.user);
          }
        } catch {
          localStorage.removeItem('prepify_token');
          setCurrentUser(null);
        }
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.token) {
      localStorage.setItem('prepify_token', res.token);
      setCurrentUser(res.user);
    }
    return res.user;
  };

  const register = async (name, email, password) => {
    const res = await api.register(name, email, password);
    if (res.token) {
      localStorage.setItem('prepify_token', res.token);
      setCurrentUser(res.user);
    }
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('prepify_token');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
