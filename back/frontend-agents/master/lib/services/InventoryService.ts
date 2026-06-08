import 'server-only';
import { adminDb } from '../server/firebase-admin';
import { COLLECTIONS } from '../models/schema';

export interface Property {
  id: string;
  title: string;
  propertyType: string;
  status: string;
  compound: string;
  location: string;
  city: string;
  area: number;
  bedrooms: number;
  price: number;
  pricePerSqm: number;
  coordinates?: { lat: number; lng: number };
  finishingType?: string;
  description?: string;
}

export const InventoryService = {
  async getProperty(id: string): Promise<Property | null> {
    const docSnap = await adminDb.collection(COLLECTIONS.units).doc(id).get();
    if (docSnap.exists) {
      return { id: docSnap.id, ...docSnap.data() } as Property;
    }
    return null;
  },

  async getFeaturedListings(count: number = 3): Promise<Property[]> {
    const snapshot = await adminDb.collection(COLLECTIONS.units).limit(count).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
  }
};
