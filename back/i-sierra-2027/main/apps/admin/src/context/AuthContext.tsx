import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { auth, db } from '../firebase';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { AuthContext } from './auth-context';
import type { AdminUser } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Fetch admin profile from Firestore
          const adminDocRef = doc(db, 'admin_users', firebaseUser.uid);
          const adminDoc = await getDoc(adminDocRef);

          if (adminDoc.exists()) {
            const adminData = adminDoc.data();
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: adminData.name || firebaseUser.displayName || 'Admin',
              role: adminData.role || 'viewer',
              compound: adminData.compound,
              createdAt: adminData.createdAt?.toDate() || new Date(),
            });
            setFirebaseUser(firebaseUser);
          } else {
            // Admin user in Firebase Auth but not in our collection
            console.warn('User authenticated but not in admin_users collection');
            setUser(null);
            setFirebaseUser(null);
          }
        } else {
          setUser(null);
          setFirebaseUser(null);
        }
      } catch (err) {
        console.error('Auth state error:', err);
        setError(err instanceof Error ? err.message : 'Authentication error');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      // User data is fetched in the onAuthStateChanged hook
      console.log('✅ Login successful:', credential.user.email);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed';
      setError(errorMsg);
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setFirebaseUser(null);
      console.log('✅ Logout successful');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMsg);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}
