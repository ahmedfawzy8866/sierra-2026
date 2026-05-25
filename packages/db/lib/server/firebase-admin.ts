import * as admin from 'firebase-admin';

/**
 * SIERRA BLU — FIREBASE ADMIN SERVICE (V12.1 Hardened)
 */

// Proxy returned when Admin SDK is unavailable — prevents hard crashes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const makeUnavailable = (name: string): any =>
  new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === 'then') return undefined;
        return (...args: any[]) => {
            console.warn(`⚠️ [firebase-admin] ${name}.${String(prop)} called but not initialized.`);
            // Return chainable mock objects to prevent "undefined is not a function" errors
            const chainable = {
                get: () => Promise.resolve({ size: 0, empty: true, forEach: () => {}, exists: false, data: () => ({}) }),
                set: () => Promise.resolve(),
                update: () => Promise.resolve(),
                add: () => Promise.resolve({ id: 'mock-id' }),
                limit: () => chainable,
                orderBy: () => chainable,
                where: () => chainable,
                doc: () => chainable,
                collection: () => chainable,
            };
            return chainable;
        };
      },
    }
  );

let adminApp: admin.app.App = makeUnavailable('App');
let adminAuth: admin.auth.Auth = makeUnavailable('Auth');
let adminDb: admin.firestore.Firestore = makeUnavailable('Firestore');
let adminAppCheck: admin.appCheck.AppCheck = makeUnavailable('AppCheck');
let isAdminInitialized = false;

try {
  if (!admin.apps.length) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (serviceAccount) {
      console.log('🔐 [Firebase] Initializing with service account JSON');
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccount)),
        projectId: projectId,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } else if (projectId && clientEmail && privateKey) {
      console.log('🔐 [Firebase] Initializing with individual env variables');
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
        projectId: projectId,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } else {
      console.log('🔐 [Firebase] Attempting Application Default Credentials');
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: projectId || 'sierra-blu',
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    }
  }

  adminApp = admin.app();
  adminAuth = admin.auth();
  adminDb = admin.firestore();
  adminAppCheck = admin.appCheck();
  isAdminInitialized = true;
} catch (error) {
  console.warn(
    '[firebase-admin] Initialization failed — Admin features limited.\n' +
    'Reason:', error instanceof Error ? error.message : 'Unknown error'
  );
}

export { adminApp, adminAuth, adminDb, adminAppCheck, isAdminInitialized };
