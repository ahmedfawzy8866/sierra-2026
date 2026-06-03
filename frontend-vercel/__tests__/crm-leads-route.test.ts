const collectionMock = jest.fn();
const docMock = jest.fn();
const setMock = jest.fn();

jest.mock('@/lib/server/firebase-admin', () => ({
  adminDb: {
    collection: (...args: unknown[]) => collectionMock(...args),
  },
}));

import { POST } from '@/app/api/crm/leads/route';

describe('POST /api/crm/leads validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    collectionMock.mockReturnValue({ doc: docMock });
    docMock.mockReturnValue({ set: setMock });
    setMock.mockResolvedValue(undefined);
  });

  test('returns 400 when client_name or client_mobile is missing', async () => {
    const res = await POST(
      new Request('http://localhost:3000/api/crm/leads', {
        method: 'POST',
        body: JSON.stringify({
          client_name: '  ',
          client_mobile: '',
          extracted_metrics: { intent: 'BUY' },
        }),
      }),
    );
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: 'Missing required fields: client_name and client_mobile are required.',
    });
    expect(collectionMock).not.toHaveBeenCalled();
  });

  test('returns 400 when extracted_metrics is invalid', async () => {
    const res = await POST(
      new Request('http://localhost:3000/api/crm/leads', {
        method: 'POST',
        body: JSON.stringify({
          client_name: 'Jane Doe',
          client_mobile: '+201000000000',
          extracted_metrics: [],
        }),
      }),
    );
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: 'Invalid payload: extracted_metrics object is required.',
    });
    expect(collectionMock).not.toHaveBeenCalled();
  });
});
