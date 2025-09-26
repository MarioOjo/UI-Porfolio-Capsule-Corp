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

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
