// ...existing code...
import React, { createContext, useContext, useEffect, useState } from 'react';
import apiFetch from './utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchMe() {
      try {
        const res = await apiFetch('/api/me');
        if (mounted) setUser(res.user);
      } catch (e) {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchMe();
    return () => { mounted = false; };
  }, []);

  const login = async (email, password) => {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.user) setUser(res.user);
    if (res.token) localStorage.setItem('authToken', res.token);
    return res;
  };

  const signup = async (email, password) => {
    const res = await apiFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.user) setUser(res.user);
    if (res.token) localStorage.setItem('authToken', res.token);
    return res;
  };

  const logout = async () => {
    try { 
      await apiFetch('/api/auth/logout', { method: 'POST' }); 
    } catch (e) {
      console.error('Logout error:', e);
    }
    setUser(null);
    localStorage.removeItem('authToken');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await apiFetch('/api/profile/update', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
      if (res.user) setUser(res.user);
      return res;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await apiFetch('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      });
      return res;
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout,
      updateProfile,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
