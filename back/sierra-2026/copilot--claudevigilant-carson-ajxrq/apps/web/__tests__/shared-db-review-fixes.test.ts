import { getAuth } from 'firebase/auth';

import { parseDSL, buildFirestoreQuery } from '../../../packages/db/lib/dsl/parser';
import { pushListingToPF } from '../../../packages/db/lib/integrations/property-finder';
import { VIEW_CONFIGS } from '../../../packages/db/lib/sierra-blue-view-configs';

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
}));

describe('shared db review fixes', () => {
  const mockedGetAuth = getAuth as jest.MockedFunction<typeof getAuth>;
  const mockFetch = jest.fn();

  beforeEach(() => {
    mockedGetAuth.mockReset();
    mockFetch.mockReset();
    global.fetch = mockFetch as typeof fetch;
    Object.defineProperty(globalThis, 'window', {
      value: {},
      configurable: true,
      writable: true,
    });
  });

  it('keeps SHOW fields when a view starts with SBR_Code and preserves PRIMARY_ID', () => {
    const parsed = parseDSL(VIEW_CONFIGS.scribe_dashboard.dsl, VIEW_CONFIGS.scribe_dashboard.collection);

    expect(parsed.showFields[0]).toBe('SBR_Code');
    expect(parsed.showFieldsMap.SBR_Code).toBe(true);
    expect(parsed.primaryIdField).toBe('SBR_Code');
  });

  it('normalizes equals operators for standard and percent filters', () => {
    const parsed = parseDSL('FILTER "Status" = "active"\nFILTER "Completion" = 85 PERCENT');

    expect(parsed.filters).toEqual([
      { field: 'Status', operator: '==', value: 'active' },
      { field: 'Completion', operator: '==', value: 85 },
    ]);
  });

  it('throws a clear error when COMPOUND IN is combined with another multi-value IN filter', () => {
    const parsed = parseDSL(VIEW_CONFIGS.hidden_gems.dsl, VIEW_CONFIGS.hidden_gems.collection);

    expect(() => buildFirestoreQuery(parsed, {} as never)).toThrow(
      'Firestore queries cannot combine COMPOUND IN (...) with another IN filter unless exactly one compound is provided.',
    );
  });

  it('fails fast when listing.id is missing', async () => {
    const result = await pushListingToPF({
      title: 'Listing',
      compound: 'Mivida',
      city: 'Cairo',
      location: 'New Cairo',
      propertyType: 'apartment',
      offerType: 'sale',
      price: 1,
      area: 1,
      bedrooms: 1,
      bathrooms: 1,
      status: 'active',
    });

    expect(result).toEqual({
      success: false,
      error: 'Cannot publish listing: listing.id is required for Property Finder sync',
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('fails fast when no Firebase token is available', async () => {
    mockedGetAuth.mockReturnValue({ currentUser: null } as never);

    const result = await pushListingToPF({
      id: 'unit-1',
      title: 'Listing',
      compound: 'Mivida',
      city: 'Cairo',
      location: 'New Cairo',
      propertyType: 'apartment',
      offerType: 'sale',
      price: 1,
      area: 1,
      bedrooms: 1,
      bathrooms: 1,
      status: 'active',
    });

    expect(result).toEqual({ success: false, error: 'Authentication required to publish listings' });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('sends the Firebase bearer token when publishing to Property Finder', async () => {
    mockedGetAuth.mockReturnValue({
      currentUser: {
        getIdToken: jest.fn().mockResolvedValue('test-token'),
      },
    } as never);
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'pf-1' }),
    });

    const result = await pushListingToPF({
      id: 'unit-1',
      title: 'Listing',
      compound: 'Mivida',
      city: 'Cairo',
      location: 'New Cairo',
      propertyType: 'apartment',
      offerType: 'sale',
      price: 1,
      area: 1,
      bedrooms: 1,
      bathrooms: 1,
      status: 'active',
    });

    expect(result).toEqual({ success: true, id: 'pf-1' });
    expect(mockFetch).toHaveBeenCalledWith('/api/sync/publish', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + 'test-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ unitId: 'unit-1' }),
    });
  });
});
