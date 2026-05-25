/**
 * SIERRA BLU — FIREBASE CLIENT SINGLETON
 * Central Firebase initialization for the frontend.
 * Admin SDK (service-account.json) is for server/scripts only.
 */
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const hasFirebaseConfig = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID
);
const canUsePlaceholderConfig = !hasFirebaseConfig && typeof window === 'undefined';

if (!hasFirebaseConfig && !canUsePlaceholderConfig) {
  throw new Error('Missing public Firebase configuration.');
}

const firebaseConfig = hasFirebaseConfig
  ? {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }
  : {
      apiKey: 'demo-api-key',
      authDomain: 'demo.firebaseapp.com',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:000000000000:web:demo',
    };

if (canUsePlaceholderConfig) {
  console.warn('[firebase] Missing public Firebase config; using safe placeholder values during build/server rendering.');
}

const app: FirebaseApp = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

const hasClientApiKey = Boolean(firebaseConfig.apiKey);
export const isFirebaseClientConfigured = hasClientApiKey;
const unavailableClientService = <T>(serviceName: string): T =>
  new Proxy(
    {},
    {
      get() {
        throw new Error(
          `Firebase client ${serviceName} is unavailable because NEXT_PUBLIC_FIREBASE_API_KEY is not configured.`
        );
      },
    }
  ) as T;

export const auth: Auth = hasClientApiKey ? getAuth(app) : unavailableClientService<Auth>('auth');
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = hasClientApiKey
  ? getStorage(app)
  : unavailableClientService<FirebaseStorage>('storage');

export async function getAnalyticsInstance() {
  if (typeof window === 'undefined') return null;
  try {
    const { getAnalytics } = await import('firebase/analytics');
    return getAnalytics(app);
  } catch {
    return null;
  }
}

export default app;
