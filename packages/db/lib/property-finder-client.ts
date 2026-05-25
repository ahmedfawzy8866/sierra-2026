/**
 * PROPERTY FINDER ENTERPRISE API GATEWAY (v2)
 * Implementation for Sierra Blu Realty Operational Intelligence
 */

export interface PFListing {
  id?: string;
  reference_number: string;
  title: {
    en: string;
    ar?: string;
  };
  description: {
    en: string;
    ar?: string;
  };
  price: {
    value: number;
    currency: string;
    period?: 'yearly' | 'monthly' | 'weekly' | 'daily';
  };
  type: 'apartment' | 'villa' | 'townhouse' | 'penthouse' | 'duplex' | 'hotel' | 'land' | 'commercial';
  offering_type: 'sale' | 'rent';
  status: 'published' | 'draft' | 'archived' | 'rejected';
  bedrooms: number;
  bathrooms: number;
  size: {
    value: number;
    unit: 'sqft' | 'sqm';
  };
  location: {
    id: number;
    name?: string;
  };
  amenities?: number[];
  images?: Array<{
    url: string;
    is_main?: boolean;
    category?: string;
  }>;
  created_at?: string;
  updated_at?: string;
}

export interface PFLocation {
  id: number;
  name: string;
  full_name: string;
  type: string;
}

export interface PFAccessToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

class PropertyFinderClient {
  private static instance: PropertyFinderClient;
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  private constructor() {
    this.baseUrl = process.env.PROPERTY_FINDER_API_GATEWAY || 'https://gateway.propertyfinder.com/v2';
    this.clientId = process.env.PROPERTY_FINDER_CLIENT_ID || '';
    this.clientSecret = process.env.PROPERTY_FINDER_CLIENT_SECRET || '';
  }

  public static getInstance(): PropertyFinderClient {
    if (!PropertyFinderClient.instance) {
      PropertyFinderClient.instance = new PropertyFinderClient();
    }
    return PropertyFinderClient.instance;
  }

  private async getAuthToken(): Promise<string> {
    const now = Date.now();
    if (this.accessToken && this.tokenExpiry && now < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error(`Authentication Protocol Failed: ${response.statusText}`);
      }

      const data: PFAccessToken = await response.json();
      this.accessToken = data.access_token;
      // Set expiry with a 60s buffer
      this.tokenExpiry = now + (data.expires_in - 60) * 1000;
      
      return this.accessToken;
    } catch (error) {
      console.error('Property Finder Auth Error:', error);
      throw error;
    }
  }

  private async request(path: string, options: RequestInit = {}): Promise<any> {
    const token = await this.getAuthToken();
    const url = `${this.baseUrl}${path}`;
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 204) return null;
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Gateway Error (${response.status}): ${errorData.message || 'Unknown integration failure'}`);
    }

    return response.json();
  }

  /**
   * Search for listings with filters
   */
  public async searchListings(filters: Record<string, any> = {}): Promise<{ data: PFListing[], meta: any }> {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/listings?${query}`);
  }

  /**
   * Get a single listing by ID or reference number
   */
  public async getListing(id: string): Promise<PFListing> {
    return this.request(`/listings/${id}`);
  }

  /**
   * Create a new premium listing
   */
  public async createListing(listing: PFListing): Promise<PFListing> {
    return this.request('/listings', {
      method: 'POST',
      body: JSON.stringify(listing),
    });
  }

  /**
   * Update existing listing protocol
   */
  public async updateListing(id: string, updates: Partial<PFListing>): Promise<PFListing> {
    return this.request(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  /**
   * De-list an asset
   */
  public async deleteListing(id: string): Promise<void> {
    return this.request(`/listings/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Retrieve incoming investment stakeholder protocols
   */
  public async fetchInvestmentStakeholderRegistry(filters: Record<string, any> = {}): Promise<{ data: PFStakeholderProtocol[], meta: any }> {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/leads?${query}`);
  }

  /**
   * Search locations for precision mapping
   */
  public async searchLocations(query: string): Promise<{ data: PFLocation[] }> {
    return this.request(`/reference/locations/search?q=${encodeURIComponent(query)}`);
  }

  /**
   * Get reference amenities protocols
   */
  public async getAmenities(): Promise<any> {
    return this.request('/reference/amenities');
  }
}

export interface PFStakeholderProtocol {
  id: string;
  listing_id?: string;
  listing_reference_number?: string;
  customer: {
    name: string;
    email?: string;
    phone: string;
  };
  message?: string;
  source: string;
  created_at: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost' | 'won';
}

export const pfClient = PropertyFinderClient.getInstance();
export default PropertyFinderClient;
