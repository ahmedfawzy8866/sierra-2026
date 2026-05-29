import { NextRequest } from 'next/server';

const makeRequest = (headers: Record<string, string> = {}) =>
  new NextRequest(new Request('http://localhost:3000/api/orchestrate', { headers }));

describe('middleware', () => {
  afterEach(() => {
    delete process.env.SBR_SECRET_KEY;
    jest.resetModules();
  });

  test('only matches the orchestrate endpoint', async () => {
    const { config } = await import('@/middleware');
    expect(config.matcher).toBe('/api/orchestrate');
  });

  test('returns 500 when SBR_SECRET_KEY is missing', async () => {
    const { middleware } = await import('@/middleware');
    const response = middleware(makeRequest());

    expect(response.status).toBe(500);
  });

  test('returns 401 when the secret header is invalid', async () => {
    process.env.SBR_SECRET_KEY = 'expected-secret';

    const { middleware } = await import('@/middleware');
    const response = middleware(makeRequest({ 'x-sbr-secret-key': 'wrong-secret' }));

    expect(response.status).toBe(401);
  });

  test('allows requests with the correct secret header', async () => {
    process.env.SBR_SECRET_KEY = 'expected-secret';

    const { middleware } = await import('@/middleware');
    const response = middleware(makeRequest({ 'x-sbr-secret-key': 'expected-secret' }));

    expect(response.headers.get('x-middleware-next')).toBe('1');
  });
});
