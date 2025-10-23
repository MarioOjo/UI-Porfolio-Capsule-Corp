// Firebase configuration for Capsule Corp
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Prefer runtime-loaded config (from /env.json -> window.__RUNTIME_CONFIG__) when available.
// This lets you change API_BASE or Firebase settings at deploy-time without rebuilding.
const RUNTIME = typeof window !== 'undefined' && window.__RUNTIME_CONFIG__ ? window.__RUNTIME_CONFIG__ : {};

// Read envs: prefer runtime then build-time VITE_ vars.
const FIREBASE_KEY = RUNTIME.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY;
const FIREBASE_AUTH_DOMAIN = RUNTIME.VITE_FIREBASE_AUTH_DOMAIN || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const FIREBASE_PROJECT_ID = RUNTIME.VITE_FIREBASE_PROJECT_ID || import.meta.env.VITE_FIREBASE_PROJECT_ID;
const FIREBASE_STORAGE_BUCKET = RUNTIME.VITE_FIREBASE_STORAGE_BUCKET || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const FIREBASE_MESSAGING_SENDER_ID = RUNTIME.VITE_FIREBASE_MESSAGING_SENDER_ID || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const FIREBASE_APP_ID = RUNTIME.VITE_FIREBASE_APP_ID || import.meta.env.VITE_FIREBASE_APP_ID;
const FIREBASE_MEASUREMENT_ID = RUNTIME.VITE_FIREBASE_MEASUREMENT_ID || import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;

const required = FIREBASE_KEY && FIREBASE_AUTH_DOMAIN && FIREBASE_PROJECT_ID && FIREBASE_APP_ID;

// Top-level exports (initialized to null). We assign to them below to avoid exporting inside blocks.
let auth = null;
let googleProvider = null;
let firebaseApp = null;

if (!required) {
  // Missing Firebase config — avoid throwing so the UI can still render a helpful message
  // and other non-auth functionality can remain available.
  // eslint-disable-next-line no-console
  console.warn('[firebase] Missing VITE_FIREBASE_* env vars. Firebase auth disabled.');
} else {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: FIREBASE_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
    measurementId: FIREBASE_MEASUREMENT_ID
  };

  // Initialize Firebase
  firebaseApp = initializeApp(firebaseConfig);

  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(firebaseApp);

  // Initialize Google Auth Provider
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
}

export { auth, googleProvider };
export default firebaseApp;