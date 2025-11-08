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
    console.log('🔍 Checking email access:', email);
    if (!email) {
      console.log('⚠️ No email provided to isAllowed check');
      return false;
    }
    const normalizedEmail = email.toLowerCase().trim();
    const allowed = allowedEmails.has(normalizedEmail);
    
    console.log('📋 Email whitelist check:');
    console.log('  - Input email:', email);
    console.log('  - Normalized email:', normalizedEmail);
    console.log('  - Is allowed:', allowed);
    console.log('  - Allowed emails:', Array.from(allowedEmails));
    
    if (!allowed) {
      console.warn('❌ UNAUTHORIZED: Email not in allowed list:', normalizedEmail);
      // Show user-friendly alert
      alert(`❌ Email tidak memiliki akses admin: ${email}\n\nEmail yang diizinkan:\n- alaunasbariklana@gmail.com\n- zelvidiana@gmail.com\n- pisangijo@cateringsamarasa.com\n- admin@pisangijo.com\n- admin@cateringsamarasa.com`);
    } else {
      console.log('✅ Email is AUTHORIZED:', normalizedEmail);
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
        console.log('🔄 Checking redirect result...');
        if (result && result.user) {
          console.log('✅ User returned from Google:', result.user.email);
          console.log('📊 User details:', {
            email: result.user.email,
            displayName: result.user.displayName,
            uid: result.user.uid,
            emailVerified: result.user.emailVerified
          });
          
          if (!isAllowed(result.user.email)) {
            console.error('❌ REDIRECTING TO SIGN OUT: Email tidak diizinkan:', result.user.email);
            firebaseSignOut(auth).catch((e) => console.error('Error signing out:', e));
            setError(`Unauthorized email: ${result.user.email}`);
          } else {
            console.log('✅ Email diizinkan, login berhasil!');
            console.log('🎉 Redirecting to dashboard...');
          }
        } else {
          console.log('ℹ️ No redirect result (normal pada first load)');
        }
      })
      .catch((error) => {
        console.error('❌ Error getting redirect result:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          name: error.name
        });
        setError('Authentication error: ' + error.message);
      });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔔 onAuthStateChanged triggered at', new Date().toISOString());
      clearTimeout(loadingTimeout); // Clear timeout since auth state changed
      
      if (user) {
        console.log('👤 User detected in onAuthStateChanged:');
        console.log('  - Email:', user.email);
        console.log('  - UID:', user.uid);
        console.log('  - Display Name:', user.displayName);
        console.log('  - Email Verified:', user.emailVerified);
        
        // Check if email is allowed
        const emailAllowed = isAllowed(user.email);
        if (!emailAllowed) {
          console.error('❌ UNAUTHORIZED in onAuthStateChanged: Signing out user:', user.email);
          firebaseSignOut(auth).catch((e) => console.error('Error signing out:', e));
          setUser(null);
          setLoading(false);
          setError(`Unauthorized access: ${user.email}`);
          return;
        }
        
        console.log('✅ Setting AUTHORIZED user to state');
        console.log('🏠 User should now be redirected to dashboard');
        setUser(user);
        setError(null); // Clear any previous errors
      } else {
        console.log('ℹ️ User = null in onAuthStateChanged (logged out or not authenticated)');
        setUser(null);
      }
      setLoading(false);
      console.log('📊 Auth state updated - loading:', false, 'user:', user?.email || 'null');
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
