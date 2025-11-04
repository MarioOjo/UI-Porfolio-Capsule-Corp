import { useState } from 'react';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { getAuthInstance, getGoogleProvider, initFirebase } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const { showSuccess, showError } = useNotifications();

  const signInWithGoogle = async (useRedirect = false) => {
    setLoading(true);
    try {
      // Ensure firebase is initialized (reads runtime env.json if present)
      initFirebase();
      const auth = getAuthInstance();
      const googleProvider = getGoogleProvider();

      if (!auth || !googleProvider) {
        throw new Error('Firebase auth not configured.');
      }
      let result;
      
      if (useRedirect) {
        // Use redirect method for mobile or when popup is blocked
        await signInWithRedirect(auth, googleProvider);
        return; // The redirect will handle the rest
      } else {
        // Use popup method (preferred for desktop)
        result = await signInWithPopup(auth, googleProvider);
      }

      if (result?.user) {
        const userData = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          emailVerified: result.user.emailVerified,
          provider: 'google'
        };

        // You can sync this with your backend here
        // await syncUserWithBackend(userData);
        
        setUser(userData);
        
        showSuccess(`🚀 Welcome to Capsule Corp, ${result.user.displayName || 'Saiyan'}!`, {
          title: "GOOGLE SIGN-IN SUCCESSFUL",
          duration: 4000
        });

        return userData;
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      
      let errorMessage = 'Google sign-in failed';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in cancelled by user';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup blocked. Please allow popups and try again.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Another sign-in popup is already open';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      }

      showError(`⚡ ${errorMessage}`, {
        title: "GOOGLE SIGN-IN FAILED",
        duration: 5000
      });

      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectResult = async () => {
    try {
      const auth = getAuthInstance();
      if (!auth) {
        console.warn('Firebase auth not configured; skipping redirect result handling.');
        return null;
      }
      const result = await getRedirectResult(auth);
      if (result?.user) {
        const userData = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          emailVerified: result.user.emailVerified,
          provider: 'google'
        };

        setUser(userData);
        
        showSuccess(`🚀 Welcome back, ${result.user.displayName || 'Saiyan'}!`, {
          title: "GOOGLE SIGN-IN SUCCESSFUL",
          duration: 4000
        });

        return userData;
      }
    } catch (error) {
      console.error('Redirect result error:', error);
    }
  };

  return {
    signInWithGoogle,
    handleRedirectResult,
    loading
  };
};