import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getAuthInstance, initFirebase } from '../config/firebase';
import apiFetch from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      // Initialize Firebase (reads runtime config if present). If it's not configured
      // the initFirebase() will return nulls and we fall back to backend session check.
      initFirebase();
      const auth = getAuthInstance();

      // If Firebase auth is not configured, fall back to backend session check.
      if (!auth) {
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
        if (mounted) {
          setLoading(false);
          setAuthInitialized(true);
        }
        return;
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
            const idToken = await firebaseUser.getIdToken();
            const syncRes = await apiFetch('/api/auth/firebase-sync', {
              method: 'POST',
              body: JSON.stringify({ 
                uid: firebaseUser.uid, 
                email: firebaseUser.email, 
                displayName: firebaseUser.displayName 
              }),
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
            // Don't clear user on sync error - keep Firebase auth state
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
        
        if (mounted) {
          setLoading(false);
          setAuthInitialized(true);
        }
      });

      return () => {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    };

    const unsubscribePromise = initializeAuth();

    return () => {
      mounted = false;
      // Cleanup will be handled by the unsubscribe function returned from initializeAuth
    };
  }, []);

  const login = async (email, password, rememberMe = true) => {
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (res.user) setUser(res.user);
      if (res.token) {
        // Store in localStorage if rememberMe is true, sessionStorage otherwise
        if (rememberMe) {
          localStorage.setItem('authToken', res.token);
          sessionStorage.removeItem('authToken'); // Clear sessionStorage to avoid conflicts
        } else {
          sessionStorage.setItem('authToken', res.token);
          localStorage.removeItem('authToken'); // Clear localStorage to avoid conflicts
        }
      }
      return res;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      // If called with old signature (email, password, firstName, lastName), convert to object
      if (typeof userData === 'string') {
        const [email, password, firstName = '', lastName = ''] = arguments;
        const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '');
        userData = { email, password, username, firstName, lastName };
      }
      
      const res = await apiFetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      if (res.user) setUser(res.user);
      if (res.token) localStorage.setItem('authToken', res.token);
      return res;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    // Clear local state immediately for better UX
    setUser(null);
    localStorage.removeItem('authToken');

    // Sign out from Firebase if initialized
    try {
      const authInstance = getAuthInstance();
      if (authInstance) await signOut(authInstance);
    } catch (error) {
      console.error('Firebase logout error:', error);
    }

    // Tell backend to clear any server-side session
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Backend logout error:', e);
    }
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

  const value = {
    user, 
    loading,
    authInitialized, // New: track if auth system is fully initialized
    login, 
    signup, 
    logout,
    updateProfile,
    changePassword,
    setUser,
    // Derived helper for convenience
    isAdmin: Boolean(
      user && (
        user.role === 'admin' || 
        (user.email && user.email.toLowerCase().includes('admin')) || 
        user.email === 'mario@capsulecorp.com'
      )
    )
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;