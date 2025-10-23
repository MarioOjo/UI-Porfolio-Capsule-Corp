// Lazy-initialized Firebase configuration for Capsule Corp
import { initializeApp } from 'firebase/app';
import { getAuth as firebaseGetAuth, GoogleAuthProvider } from 'firebase/auth';

// We export helpers rather than initialized instances so Firebase can be
// initialized after runtime `/env.json` is loaded (avoids warnings and race conditions).
let firebaseApp = null;
let authInstance = null;
let googleProviderInstance = null;

function readConfig() {
  const RUNTIME = typeof window !== 'undefined' && window.__RUNTIME_CONFIG__ ? window.__RUNTIME_CONFIG__ : {};

  return {
    apiKey: RUNTIME.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: RUNTIME.VITE_FIREBASE_AUTH_DOMAIN || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: RUNTIME.VITE_FIREBASE_PROJECT_ID || import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: RUNTIME.VITE_FIREBASE_STORAGE_BUCKET || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: RUNTIME.VITE_FIREBASE_MESSAGING_SENDER_ID || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: RUNTIME.VITE_FIREBASE_APP_ID || import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: RUNTIME.VITE_FIREBASE_MEASUREMENT_ID || import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };
}

export function initFirebase() {
  if (firebaseApp) return { firebaseApp, auth: authInstance, googleProvider: googleProviderInstance };

  const cfg = readConfig();
  const required = cfg.apiKey && cfg.authDomain && cfg.projectId && cfg.appId;

  if (!required) {
    // eslint-disable-next-line no-console
    console.warn('[firebase] Missing VITE_FIREBASE_* env vars. Firebase auth disabled.');
    return { firebaseApp: null, auth: null, googleProvider: null };
  }

  const firebaseConfig = {
    apiKey: cfg.apiKey,
    authDomain: cfg.authDomain,
    projectId: cfg.projectId,
    storageBucket: cfg.storageBucket,
    messagingSenderId: cfg.messagingSenderId,
    appId: cfg.appId,
    measurementId: cfg.measurementId
  };

  firebaseApp = initializeApp(firebaseConfig);
  authInstance = firebaseGetAuth(firebaseApp);
  googleProviderInstance = new GoogleAuthProvider();
  googleProviderInstance.setCustomParameters({ prompt: 'select_account' });

  return { firebaseApp, auth: authInstance, googleProvider: googleProviderInstance };
}

export function getAuthInstance() {
  if (!authInstance) initFirebase();
  return authInstance;
}

export function getGoogleProvider() {
  if (!googleProviderInstance) initFirebase();
  return googleProviderInstance;
}

export default function getFirebaseApp() {
  if (!firebaseApp) initFirebase();
  return firebaseApp;
}