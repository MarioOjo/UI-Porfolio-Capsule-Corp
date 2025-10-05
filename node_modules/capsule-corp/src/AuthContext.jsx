// ...existing code...
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './config/firebase';
import apiFetch from './utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!mounted) return;
      
      if (firebaseUser) {
        // User is signed in with Firebase
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          provider: firebaseUser.providerData[0]?.providerId || 'email'
        };
        setUser(userData);
        
        // Optionally sync with your backend
        try {
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('authToken', token);
          // You can send this token to your backend for verification
          // await apiFetch('/api/auth/firebase-verify', {
          //   method: 'POST',
          //   body: JSON.stringify({ token })
          // });
        } catch (error) {
          console.error('Error getting Firebase token:', error);
        }
      } else {
        // User is signed out - check backend session as fallback
        try {
          const res = await apiFetch('/api/me');
          if (mounted && res.user) {
            setUser(res.user);
          } else {
            setUser(null);
            localStorage.removeItem('authToken');
          }
        } catch (e) {
          // Backend session doesn't exist or expired
          setUser(null);
          localStorage.removeItem('authToken');
        }
      }
      
      if (mounted) setLoading(false);
    });
    
    return () => {
      mounted = false;
      unsubscribe();
    };
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

  const signup = async (email, password, firstName = '', lastName = '') => {
    const res = await apiFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName })
    });
    if (res.user) setUser(res.user);
    if (res.token) localStorage.setItem('authToken', res.token);
    return res;
  };

  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Also logout from backend if needed
      try {
        await apiFetch('/api/auth/logout', { method: 'POST' });
      } catch (e) {
        console.error('Backend logout error:', e);
      }
    } catch (error) {
      console.error('Firebase logout error:', error);
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
      changePassword,
      setUser // Export setUser for Google auth hook
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
