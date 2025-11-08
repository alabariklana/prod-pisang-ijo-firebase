'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Daftar email yang diizinkan (semua lowercase)
  const allowedEmails = new Set([
    'alaunasbariklana@gmail.com',
    'zelvidiana@gmail.com',
    'pisangijo@cateringsamarasa.com',
    'admin@pisangijo.com',
    'admin@cateringsamarasa.com'
  ]);

  const isAllowed = (email) => {
    if (!email) {
      console.log('⚠️ No email provided to isAllowed check');
      return false;
    }
    const normalizedEmail = email.toLowerCase().trim();
    const allowed = allowedEmails.has(normalizedEmail);
    
    if (!allowed) {
      console.warn('❌ Email not in allowed list:', normalizedEmail);
      console.log('Allowed emails:', Array.from(allowedEmails));
    } else {
      console.log('✅ Email is allowed:', normalizedEmail);
    }
    
    return allowed;
  };

  useEffect(() => {
    // Set timeout untuk loading state (max 10 detik)
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.warn('⚠️ Auth loading timeout - forcing to false');
        setLoading(false);
        setError('Authentication timed out. Please refresh the page.');
      }
    }, 10000);

    // Check for redirect result first
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          console.log('✅ User kembali dari Google:', result.user.email);
          if (!isAllowed(result.user.email)) {
            console.error('❌ Email tidak diizinkan:', result.user.email);
            alert(`Email ${result.user.email} tidak memiliki akses admin.\n\nEmail yang diizinkan:\n- alaunasbariklana@gmail.com\n- zelvidiana@gmail.com\n- pisangijo@cateringsamarasa.com\n- admin@pisangijo.com\n- admin@cateringsamarasa.com`);
            firebaseSignOut(auth).catch((e) => console.error('Error signing out:', e));
          } else {
            console.log('✅ Email diizinkan, login berhasil!');
          }
        } else {
          console.log('ℹ️ Tidak ada redirect result (ini normal saat pertama load)');
        }
      })
      .catch((error) => {
        console.error('❌ Error saat ambil redirect result:', error);
        setError('Error during authentication: ' + error.message);
      });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔔 onAuthStateChanged triggered');
      clearTimeout(loadingTimeout); // Clear timeout since auth state changed
      
      if (user) {
        console.log('👤 User detected:', user.email);
        // Jika email tidak diizinkan, langsung sign out dan jangan set user
        if (!isAllowed(user.email)) {
          console.error('❌ UNAUTHORIZED: Signing out user:', user.email);
          firebaseSignOut(auth).catch((e) => console.error('Error signing out:', e));
          setUser(null);
          setLoading(false);
          return;
        }
        console.log('✅ Setting authorized user to state');
        setUser(user);
        setError(null); // Clear any previous errors
      } else {
        console.log('ℹ️ User = null (logged out or not authenticated)');
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, []);

  const signInWithGoogle = async (useRedirect = true) => {
    try {
      if (useRedirect) {
        // Use redirect method (more reliable)
        await signInWithRedirect(auth, googleProvider);
        return null;
      } else {
        // Try popup method
        const result = await signInWithPopup(auth, googleProvider);
        const signedUser = result.user;

        if (!isAllowed(signedUser.email)) {
          await firebaseSignOut(auth);
          const error = new Error('Unauthorized email');
          error.code = 'auth/unauthorized-email';
          error.userEmail = signedUser.email;
          throw error;
        }

        return signedUser;
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithEmailPassword = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const signedUser = result.user;

      if (!isAllowed(signedUser.email)) {
        // jika tidak diizinkan, sign out dan beri tahu pemanggil
        await firebaseSignOut(auth);
        const error = new Error('Unauthorized email');
        error.code = 'auth/unauthorized-email';
        error.userEmail = signedUser.email;
        throw error;
      }

      return signedUser;
    } catch (error) {
      console.error('Error signing in with email/password:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signInWithGoogle, signInWithEmailPassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
