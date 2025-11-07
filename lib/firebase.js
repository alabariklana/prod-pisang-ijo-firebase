import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:demo',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-DEMO'
};

// Check if we have valid Firebase configuration
const hasValidConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
                      process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'your-firebase-api-key-here';

if (!hasValidConfig) {
  console.warn('⚠️  Firebase configuration not found or invalid.');
  console.warn('Please copy .env.example to .env.local and fill in your Firebase config.');
  console.warn('See DEV_SETUP.md for detailed instructions.');
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Set persistence to LOCAL (survives browser refresh/close) only if we have valid config
if (typeof window !== 'undefined' && hasValidConfig) {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error('Error setting auth persistence:', error);
  });
}

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Optional: Add custom parameters to Google Provider
googleProvider.setCustomParameters({
  prompt: 'select_account' // Force account selection even if user has one account
});

export { auth, googleProvider, hasValidConfig };
export default app;