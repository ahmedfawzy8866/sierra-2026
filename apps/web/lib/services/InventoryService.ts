import { doc, getDoc, collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type OfferType = 'sale' | 'rent';
export type ListingType = 'primary' | 'resale' | 'landlord_direct' | 'developer_inventory';

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
  offerType?: OfferType;
  listingType?: ListingType;
}

export const InventoryService = {
  async getProperty(id: string): Promise<Property | null> {
    const docRef = doc(db, 'listings', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Property;
    }
    return null;
  },

  async getFeaturedListings(count: number = 3): Promise<Property[]> {
    const q = query(collection(db, 'listings'), limit(count));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
  }
};
