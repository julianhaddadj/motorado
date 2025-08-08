import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user if token exists
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/api/auth/me');
        setUser(res.data);
      } catch (err) {
        // Invalid token, clear localStorage
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password, sellerType, phoneNumber) => {
    const res = await api.post('/api/auth/register', {
      name,
      email,
      password,
      sellerType,
      phoneNumber,
    });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const addFavorite = async (listingId) => {
    await api.post(`/api/auth/favorites/${listingId}`);
    // Optionally refetch user
  };

  const removeFavorite = async (listingId) => {
    await api.delete(`/api/auth/favorites/${listingId}`);
    // Optionally refetch user
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, addFavorite, removeFavorite }}
    >
      {children}
    </AuthContext.Provider>
  );
};