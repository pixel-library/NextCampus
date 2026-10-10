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
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (emailOrId, password) => {
    const res = await api.post('/auth/login', { identifier: emailOrId, email: emailOrId, password });
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

  const updateProfile = async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    if (res.success && res.data?.user) {
      setUser(res.data.user);
    }
    return res;
  };

  const changePassword = async (currentPassword, newPassword) => {
    const res = await api.put('/auth/change-password', { currentPassword, newPassword });
    return res;
  };

  const logout = () => {
    localStorage.removeItem('nextcampus_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        updateProfile,
        changePassword,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
