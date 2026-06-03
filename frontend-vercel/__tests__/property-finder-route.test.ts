const collectionMock = jest.fn();

jest.mock('@/lib/server/firebase-admin', () => ({
  adminDb: {
    collection: (...args: unknown[]) => collectionMock(...args),
  },
}));

import { POST } from '@/app/api/crm/property-finder/route';

describe('POST /api/crm/property-finder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 400 when rows is not an array', async () => {
    const response = await POST(
      new Request('http://localhost:3000/api/crm/property-finder', {
        method: 'POST',
        body: JSON.stringify({ rows: 'invalid' }),
      })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: 'Invalid payload: rows must be an array.',
    });
    expect(collectionMock).not.toHaveBeenCalled();
  });

  test('returns 400 when rows array is empty', async () => {
    const response = await POST(
      new Request('http://localhost:3000/api/crm/property-finder', {
        method: 'POST',
        body: JSON.stringify({ rows: [] }),
      })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: 'Invalid payload: rows array cannot be empty.',
    });
    expect(collectionMock).not.toHaveBeenCalled();
  });
});
