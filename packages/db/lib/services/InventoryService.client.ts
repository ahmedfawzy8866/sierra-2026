/**
 * SIERRA BLU — CLIENT INVENTORY SERVICE (SAFE)
 * This file is a safe wrapper that calls the API instead of the DB directly.
 */

export interface Property {
  id: string;
  title: string;
  titleAr?: string;
  propertyType: string;
  status: string;
  compound: string;
  location: string;
  locationAr?: string;
  city: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  pricePerSqm: number;
  coordinates?: { lat: number; lng: number };
  finishingType?: string;
  description?: string;
  featuredImage?: string;
  badge?: string;
  badgeColor?: string;
  videoUrl?: string;
}

export const InventoryService = {
  async getProperty(id: string): Promise<Property | null> {
    try {
      const res = await fetch(`/api/listings?id=${id}`);
      const data = await res.json();
      if (data.success && data.listing) {
        return data.listing as Property;
      }
      return null;
    } catch (err) {
      console.error('Client Inventory Error:', err);
      return null;
    }
  },

  async getFeaturedAssets(count: number = 3): Promise<Property[]> {
    try {
      const res = await fetch(`/api/listings?limit=${count}`);
      const data = await res.json();
      if (data.success && data.listings) {
        return data.listings as Property[];
      }
      return [];
    } catch (err) {
      console.error('Client Inventory Error:', err);
      return [];
    }
  },

  async filterAssets(filters: { type?: string; compound?: string; beds?: number; maxPrice?: number }): Promise<Property[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.compound) queryParams.append('compound', filters.compound);
      if (filters.beds) queryParams.append('beds', filters.beds.toString());
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());

      const res = await fetch(`/api/listings?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success && data.listings) {
        return data.listings as Property[];
      }
      return [];
    } catch (err) {
      console.error('Client Inventory Error:', err);
      return [];
    }
  }
};
