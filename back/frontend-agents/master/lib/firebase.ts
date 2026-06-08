import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export interface FirestoreCrmProperty {
  id: string;
  unit_code: string;
  pf_reference_id: string;
  compound_name: string;
  owner_mobile: string;
  price: number;
  beds: number;
  furnished_status: 'F' | 'S' | 'K' | 'U'; 
  lat_pct: number;
  lng_pct: number;
  pf_status: 'PUBLISHED' | 'PENDING';
  expireAt?: Timestamp;
}

/**
 * Executes a localized price buffer query (EGP ±25,000) 
 * matching leads directly against verified properties catalog documents.
 */
export async function queryCrmPropertiesWithBuffer(
  compound: string,
  bedrooms: number,
  targetBudget: number,
  furnishing: 'F' | 'S' | 'K' | 'U'
): Promise<FirestoreCrmProperty[]> {
  try {
    const propertiesRef = collection(db, 'Properties');
    const minPrice = targetBudget - 25000;
    const maxPrice = targetBudget + 25000;

    const q = query(
      propertiesRef,
      where('compound_name', '==', compound),
      where('beds', '==', bedrooms),
      where('pf_status', '==', 'PUBLISHED')
    );

    const querySnapshot = await getDocs(q);
    const validatedMatches: FirestoreCrmProperty[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirestoreCrmProperty;
      if (data.price >= minPrice && data.price <= maxPrice && data.furnished_status === furnishing) {
        validatedMatches.push({ ...data, id: doc.id });
      }
    });

    return validatedMatches;
  } catch (error) {
    console.error("Firestore Edge Sync Failure: ", error);
    return [];
  }
}
