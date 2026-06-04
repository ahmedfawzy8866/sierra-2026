import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Edge middleware: shared-secret gate for INTERNAL server-to-server API
 * routes only (X-SBR-SECRET-KEY must equal SBR_SECRET_KEY).
 *
 * Public/browser routes (/api/listings, /api/leads, /api/concierge, …),
 * cron routes (authenticated with CRON_SECRET) and inbound third-party
 * webhooks (/api/webhooks/*, /api/telegram, /api/whatsapp/* — each with
 * their own secret/HMAC) are intentionally NOT matched: gating them here
 * would 401 the public site and break inbound webhooks. Add internal
 * routes to `config.matcher` below — never public/cron/webhook routes.
 */
export function middleware(request: NextRequest) {
  const inboundSecretHeader = request.headers.get('X-SBR-SECRET-KEY');
  const systemSecureToken = process.env.SBR_SECRET_KEY;

  // No secret configured (e.g. local dev) → don't block.
  if (!systemSecureToken) return NextResponse.next();

  if (!inboundSecretHeader || inboundSecretHeader !== systemSecureToken) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Security Integrity Refused. Access Blocked." }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
  }
  return NextResponse.next();
}

// Scope to internal automation only. /api/orchestrate already self-enforces
// this secret; other routes authenticate themselves and must NOT be added here.
export const config = { matcher: ['/api/orchestrate/:path*'] };
