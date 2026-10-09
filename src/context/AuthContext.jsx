import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('nextcampus_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.success && res.data?.user) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.warn('[NextCampus Auth] Session expired or invalid token');
          localStorage.removeItem('nextcampus_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.data?.token) {
      localStorage.setItem('nextcampus_token', res.data.token);
      setUser(res.data.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.success && res.data?.token) {
      localStorage.setItem('nextcampus_token', res.data.token);
      setUser(res.data.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('nextcampus_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
