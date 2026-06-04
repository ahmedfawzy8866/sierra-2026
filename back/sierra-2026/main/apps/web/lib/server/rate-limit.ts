import { NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RequestRecord {
  count: number;
  resetAt: number;
}

const store = new Map<string, RequestRecord>();

export function getRateLimitKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}

export function createRateLimiter(config: RateLimitConfig) {
  return (request: Request) => {
    const key = getRateLimitKey(request);
    const now = Date.now();

    let record = store.get(key);

    if (!record || now > record.resetAt) {
      record = { count: 0, resetAt: now + config.windowMs };
      store.set(key, record);
    }

    record.count += 1;

    if (record.count > config.maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later.' },
        { status: 429, headers: { 'Retry-After': Math.ceil((record.resetAt - now) / 1000).toString() } }
      );
    }

    return null;
  };
}

export const publicEndpointLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 30,
});

export const webhookLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 100,
});

export function applyRateLimit(
  request: Request,
  limiter: (request: Request) => NextResponse | null
): NextResponse | null {
  return limiter(request);
}
