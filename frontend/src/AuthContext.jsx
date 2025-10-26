// ...existing code...
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getAuthInstance, initFirebase } from './config/firebase';
import apiFetch from './utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

  // Initialize Firebase (reads runtime config if present). If it's not configured
  // the initFirebase() will return nulls and we fall back to backend session check.
  initFirebase();
  const auth = getAuthInstance();

  // If Firebase auth is not configured, fall back to backend session check.
  if (!auth) {
      (async () => {
        try {
          const res = await apiFetch('/api/me');
          if (mounted && res.user) {
            setUser(res.user);
          } else {
            setUser(null);
            localStorage.removeItem('authToken');
          }
        } catch (e) {
          setUser(null);
          localStorage.removeItem('authToken');
        }
        if (mounted) setLoading(false);
      })();

      return () => { mounted = false; };
    }

  // Listen to Firebase auth state changes
  const authLive = getAuthInstance();
  const unsubscribe = onAuthStateChanged(authLive, async (firebaseUser) => {
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
        // First set a lightweight firebase user to update UI quickly
        setUser(userData);

        // Sync with backend: exchange Firebase identity for our backend JWT and user record
        try {
          // Ensure we have a fresh Firebase ID token (not strictly required by our backend but useful)
          const idToken = await firebaseUser.getIdToken();
          // POST minimal identity to backend to create/link a user and receive a backend JWT
          // We intentionally post uid/email/displayName so backend can create or link the user.
          const syncRes = await apiFetch('/api/auth/firebase-sync', {
            method: 'POST',
            body: JSON.stringify({ uid: firebaseUser.uid, email: firebaseUser.email, displayName: firebaseUser.displayName }),
            // Don't include credentials by default; apiFetch will attach existing backend token if present
          });

          if (syncRes.token) {
            localStorage.setItem('authToken', syncRes.token);
          }
          if (syncRes.user) {
            // Use backend user record (has canonical fields like firstName/lastName)
            setUser({ ...userData, ...syncRes.user });
          }
        } catch (error) {
          console.error('Error syncing Firebase user with backend:', error);
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
      if (typeof unsubscribe === 'function') unsubscribe();
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
    // Sign out from Firebase if initialized. Keep this isolated so missing
    // firebase doesn't block backend logout and state clearing.
    try {
      const authInstance = getAuthInstance();
      if (authInstance) await signOut(authInstance);
    } catch (error) {
      console.error('Firebase logout error:', error);
    }

    // Tell backend to clear any server-side session if present. Don't
    // fail the entire flow if the backend is unreachable.
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Backend logout error:', e);
    }

    // Clear local client state
    setUser(null);
    localStorage.removeItem('authToken');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await apiFetch('/api/profile', {
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
    ,
      // Derived helper for convenience: prefer checking `user.role === 'admin'` in backend
      // but keep a compatibility check for older installs that used a hard-coded email.
      isAdmin: Boolean(user && (user.role === 'admin' || (user.email && user.email.toLowerCase().includes('admin') ) || user.email === 'mario@capsulecorp.com'))
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
