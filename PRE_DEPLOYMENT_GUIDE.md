# Sierra Estates — Pre-Deployment Configuration & Validation Guide

**Status:** Ready for pre-deployment setup (Vercel deployment deferred)  
**Last Updated:** 2026-06-01  
**Document Version:** 1.0

---

## 1. Environment Configuration Audit

### 1.1 Required Environment Variables by Category

#### Firebase (Core Infrastructure)
| Variable | Type | Source | Priority | Notes |
|----------|------|--------|----------|-------|
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Public | Firebase Console → Settings → General | **CRITICAL** | Project ID from Firebase console |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Public | Firebase Console → Settings → General | **CRITICAL** | Web API key (found under "Your web app") |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Public | Firebase Console → Settings → General | **CRITICAL** | Format: `{project}.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Public | Firebase Console → Settings → General | **CRITICAL** | Format: `{project}.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Public | Firebase Console → Settings → General | **CRITICAL** | Used for Cloud Messaging |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Public | Firebase Console → Settings → General | **CRITICAL** | Format: `1:{id}:web:{id}` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Public | Firebase Console → Settings → General (GA) | Optional | For Google Analytics integration |
| `FIREBASE_ADMIN_SDK_KEY` | Private (Server) | Firebase Console → Service Accounts → Admin SDK | **CRITICAL** | JSON service account key; NEVER expose publicly |
| `FIREBASE_PROJECT_ID` | Private (Server) | Extracted from Admin SDK JSON | **CRITICAL** | Server-side only |
| `FIREBASE_PRIVATE_KEY` | Private (Server) | Extracted from Admin SDK JSON | **CRITICAL** | Server-side only; multi-line format |
| `FIREBASE_CLIENT_EMAIL` | Private (Server) | Extracted from Admin SDK JSON | **CRITICAL** | Service account email |

#### AI Services
| Variable | Type | Source | Priority | Notes |
|----------|------|--------|----------|-------|
| `GOOGLE_AI_API_KEY` | Private (Server) | Google Cloud Console → APIs & Services | **REQUIRED** | For Gemini API (agent orchestration) |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Public | Google Cloud Console | Optional | For browser-side AI calls (if any) |
| `OPENCLAW_BASE_URL` | Private (Server) | OpenClaw self-hosted instance | Optional | Default: `http://localhost:18789/v1` for local |
| `OPENCLAW_TOKEN` | Private (Server) | OpenClaw instance | Optional | Bearer token for OpenClaw API |
| `ELEVENLABS_API_KEY` | Private (Server) | ElevenLabs Console | Optional | For voice synthesis (Leila TTS) |
| `LEILA_VOICE_ID` | Private (Server) | ElevenLabs Console → Voices | Optional | Voice model ID for Leila persona |

#### Property Finder Integration (Data Sync)
| Variable | Type | Source | Priority | Notes |
|----------|------|--------|----------|-------|
| `PROPERTY_FINDER_API_GATEWAY` | Private (Server) | Property Finder Dashboard | **REQUIRED** | Base URL: `https://api.property-finder.com.eg` |
| `PROPERTY_FINDER_API_KEY` | Private (Server) | Property Finder Dashboard → API Keys | **REQUIRED** | Legacy v1 API key |
| `PROPERTY_FINDER_API_SECRET` | Private (Server) | Property Finder Dashboard → API Keys | **REQUIRED** | Legacy v1 API secret |
| `PROPERTY_FINDER_CLIENT_ID` | Private (Server) | Property Finder Dashboard → OAuth | **REQUIRED** | OAuth 2.0 client ID (v2 API) |
| `PROPERTY_FINDER_CLIENT_SECRET` | Private (Server) | Property Finder Dashboard → OAuth | **REQUIRED** | OAuth 2.0 client secret (v2 API) |
| `PROPERTY_FINDER_WEBHOOK_SECRET` | Private (Server) | Property Finder Dashboard → Webhooks | Optional | Signature verification for inbound webhooks |
| `PF_API_BASE_URL` | Private (Server) | Property Finder Dashboard | Optional | Alternative name for PROPERTY_FINDER_API_GATEWAY |
| `PF_JWT_TOKEN` | Private (Server) | Property Finder Dashboard | Optional | JWT token (if using JWT auth method) |
| `PF_COMPANY_ID` | Private (Server) | Property Finder → Company Settings | Optional | Company identifier in Property Finder |
| `PF_WEBHOOK_SECRET` | Private (Server) | Property Finder Dashboard → Webhooks | Optional | Alternative name for PROPERTY_FINDER_WEBHOOK_SECRET |

#### Airtable Integration (Inventory Sync)
| Variable | Type | Source | Priority | Notes |
|----------|------|--------|----------|-------|
| `AIRTABLE_API_KEY` | Private (Server) | Airtable Account → API | **REQUIRED** | Personal access token with `data.records:read/write` scopes |
| `AIRTABLE_BASE_ID` | Public | Airtable Base URL: `https://airtable.com/appXXXXXXXXXXXXXX` | **REQUIRED** | Base ID extracted from URL |
| `AIRTABLE_TABLE_NAME` | Public | Airtable Base → Table names | **REQUIRED** | Comma-separated list of tables: `Owners-Rent,Owners-Resale,Brokers,Team Units` |

#### Google Sheets Integration (Workflows)
| Variable | Type | Source | Priority | Notes |
|----------|------|--------|----------|-------|
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Private (Server) | Google Cloud → Service Accounts → JSON key | Optional | Path to service account JSON file for Sheet API v4 |
| `BROKER_INBOX_SHEET_ID` | Public | Google Sheets URL: `sheets.google.com/spreadsheets/d/{ID}` | Optional | Sheet ID for broker inbox sync |
| `MASTER_SHEET_ID` | Public | Google Sheets URL | Optional | Alternative sheet for master data |

#### Gmail Integration (Email Notifications)
| Variable | Type | Source | Priority | Notes |
|----------|------|--------|----------|-------|
| `GMAIL_USER` | Private (Server) | Gmail Account email | Optional | Sender email address |
| `GMAIL_PASS` | Private (Server) | Gmail App Password (2FA enabled) | Optional | NOT regular password; use App Password |

#### Messaging (WhatsApp, Telegram, Zapier)
| Variable | Type | Source | Priority | Notes |
|----------|------|--------|----------|-------|
| `WHATSAPP_API_TOKEN` | Private (Server) | Meta Business Platform → WhatsApp Business API | Optional | Access token for Cloud API |
| `WHATSAPP_PHONE_NUMBER_ID` | Public | Meta Business Platform → WhatsApp → Phone Numbers | Optional | Phone number ID for business account |
| `WHATSAPP_META_TOKEN` | Private (Server) | Meta Business Platform | Optional | Alternative name for WHATSAPP_API_TOKEN |
| `WHATSAPP_VERIFY_TOKEN` | Private (Server) | User-defined | Optional | Token for webhook signature verification |
| `TELEGRAM_BOT_TOKEN` | Private (Server) | Telegram BotFather → /newbot | Optional | Format: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11` |
| `TELEGRAM_CHAT_ID` | Public | Telegram Chat ID (get via `/start` message) | Optional | Chat/group ID for bot notifications |
| `ZAPIER_CALENDAR_WEBHOOK_URL` | Private (Server) | Zapier → Webhooks → Catch Hook | Optional | Webhook URL for Zap triggers |

#### Security Keys (Internal APIs)
| Variable | Type | Source | Priority | Notes |
|----------|------|--------|----------|-------|
| `SBR_SECRET_KEY` | Private (Server) | User-generated | **REQUIRED** | Header-based auth for service/cron calls; minimum 32 chars |
| `CRON_SECRET` | Private (Server) | User-generated | **REQUIRED** | Auth for scheduled jobs (CloudScheduler/cron); minimum 32 chars |

#### Observability & Monitoring
| Variable | Type | Source | Priority | Notes |
|----------|------|--------|----------|-------|
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Public | Google reCAPTCHA → Site Keys | Optional | For form protection |
| `SENTRY_DSN` | Public | Sentry Project → Settings → Client Keys | Optional | Error tracking and performance monitoring |

#### Application Configuration
| Variable | Type | Source | Priority | Notes |
|----------|------|--------|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | Public | Configured domain | **REQUIRED** | Public URL: `https://sierrablu.luxury` (production) |
| `NODE_ENV` | Public | Set by deployment | **REQUIRED** | `development`, `staging`, or `production` |
| `NEXT_PUBLIC_ENVIRONMENT` | Public | Set manually | Optional | Redundant with NODE_ENV; can deprecate |

---

## 2. Integration Checklist & Setup Sequence

### Phase 1: Core Infrastructure (Required)
These must be configured before any functionality works.

#### ✅ Step 1.1: Firebase Project Setup (2-3 minutes)
```bash
# 1. Go to https://console.firebase.google.com
# 2. Create a new Firebase project or use existing sierra-estates-prod
# 3. Under Settings → General:
#    - Copy NEXT_PUBLIC_FIREBASE_PROJECT_ID
#    - Copy NEXT_PUBLIC_FIREBASE_API_KEY (Web API key)
#    - Copy NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
#    - Copy NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
#    - Copy NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
#    - Copy NEXT_PUBLIC_FIREBASE_APP_ID

# 4. Download Admin SDK key:
#    - Go to Settings → Service Accounts → Firebase Admin SDK
#    - Click "Generate new private key"
#    - Save JSON and extract into env vars:
#       FIREBASE_ADMIN_SDK_KEY (full JSON)
#       FIREBASE_PROJECT_ID
#       FIREBASE_PRIVATE_KEY
#       FIREBASE_CLIENT_EMAIL
```

**Validation:**
```bash
cd /home/user/i-sierra-2027
pnpm dev
# Check browser console: "Firebase initialized" message
# Check server logs: No auth errors
```

#### ✅ Step 1.2: Security Keys (1 minute)
```bash
# Generate random 32+ character strings
SBR_SECRET_KEY=$(openssl rand -base64 32)
CRON_SECRET=$(openssl rand -base64 32)

# Add to .env.local and apps/web/.env.local
echo "SBR_SECRET_KEY=$SBR_SECRET_KEY" >> /home/user/i-sierra-2027/.env.local
echo "CRON_SECRET=$CRON_SECRET" >> /home/user/i-sierra-2027/.env.local
```

**Validation:**
```bash
# Test X-SBR-SECRET-KEY header auth
curl -X POST http://localhost:3000/api/crm/leads \
  -H "X-SBR-SECRET-KEY: $SBR_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
# Should return 200, not 401
```

#### ✅ Step 1.3: Google AI (Gemini) Setup (3-5 minutes)
```bash
# 1. Go to Google Cloud Console: https://console.cloud.google.com
# 2. Create project or select sierra-estates-prod
# 3. Enable APIs:
#    - Google Generative AI API
# 4. Create API key:
#    - APIs & Services → Credentials → Create Credentials → API Key
#    - Copy to GOOGLE_AI_API_KEY
```

**Validation:**
```bash
# Test agent hub route
curl -X POST http://localhost:3000/api/agent/hub \
  -H "Content-Type: application/json" \
  -d '{"agentId":"SCRIBE","message":"What properties are available?"}'
# Should return { success: true, response: "..." }
```

#### ✅ Step 1.4: Deploy Firestore Security Rules (5 minutes)
```bash
cd /home/user/i-sierra-2027
# Review rules
cat firestore.rules

# Deploy rules
firebase deploy --only firestore:rules --project sierra-estates-prod

# Verify in Firebase Console:
# - Go to Firestore → Rules
# - Check that new rules are active
```

### Phase 2: Property Finder Integration (5-10 minutes)
Required for property listing sync (`/api/properties/sync`).

#### ✅ Step 2.1: Property Finder OAuth Setup
```bash
# 1. Login to https://dashboard.property-finder.com
# 2. Go to Developer Settings → Applications → Create New Application
# 3. Configure OAuth:
#    - App Name: "Sierra Estates Platform"
#    - Redirect URIs: https://sierrablu.luxury/api/auth/callback
# 4. Copy credentials:
#    - PROPERTY_FINDER_CLIENT_ID
#    - PROPERTY_FINDER_CLIENT_SECRET

# 5. (Legacy API) If still using v1 API:
#    - Go to API Settings → API Keys
#    - Copy PROPERTY_FINDER_API_KEY, PROPERTY_FINDER_API_SECRET
```

**Validation:**
```bash
curl -X POST http://localhost:3000/api/properties/sync \
  -H "X-SBR-SECRET-KEY: $SBR_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{"cityId":1}'
# Should return { success: true, syncedCount: X, failedCount: Y }
```

### Phase 3: Airtable Integration (3-5 minutes)
Optional but recommended for inventory tracking.

#### ✅ Step 3.1: Airtable Setup
```bash
# 1. Go to https://airtable.com/app/settings/tokens
# 2. Create Personal Access Token with scopes:
#    - data.records:read
#    - data.records:write
#    - schema.bases:read
# 3. Copy to AIRTABLE_API_KEY

# 4. Get Base ID:
#    - Open your Airtable base
#    - From URL: airtable.com/appXXXXXXXXXXXXXX/...
#    - Copy AIRTABLE_BASE_ID = appXXXXXXXXXXXXXX

# 5. List table names you want to sync:
#    - AIRTABLE_TABLE_NAME = "Owners-Rent,Owners-Resale,Brokers,Team Units"
```

**Validation:**
```bash
curl -X POST http://localhost:3000/api/sync/airtable \
  -H "X-SBR-SECRET-KEY: $SBR_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
# Should return { success: true, synced: X }
```

### Phase 4: Messaging Integrations (Optional)

#### ✅ Step 4.1: Telegram Bot (2 minutes)
```bash
# 1. Open Telegram, find @BotFather
# 2. Send /newbot
# 3. Follow instructions, copy token to TELEGRAM_BOT_TOKEN
# 4. Enable webhook:
#    - /setwebhook https://sierrablu.luxury/api/webhooks/telegram
# 5. Get chat ID:
#    - Add bot to group or DM it
#    - Forward any message to https://api.telegram.org/bot{TOKEN}/getUpdates
#    - Extract "chat" → "id" → TELEGRAM_CHAT_ID
```

#### ✅ Step 4.2: WhatsApp Cloud API (5-10 minutes)
```bash
# 1. Go to https://business.facebook.com
# 2. Create WhatsApp Business App
# 3. Get credentials:
#    - WHATSAPP_API_TOKEN (permanent access token)
#    - WHATSAPP_PHONE_NUMBER_ID (from Phone Numbers section)
# 4. Set webhook in settings:
#    - Callback URL: https://sierrablu.luxury/api/webhooks/whatsapp
#    - Verify Token: Generate WHATSAPP_VERIFY_TOKEN
```

#### ✅ Step 4.3: Zapier Webhooks (Optional, 3 minutes)
```bash
# 1. Go to https://zapier.com/
# 2. Create new Zap
# 3. Use "Webhooks by Zapier" → Catch Hook
# 4. Copy webhook URL to ZAPIER_CALENDAR_WEBHOOK_URL
# 5. Test in app:
curl -X POST $ZAPIER_CALENDAR_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

---

## 3. Environment File Creation

### 3.1 Root `.env.local`
```bash
# Create /home/user/i-sierra-2027/.env.local
cp /home/user/i-sierra-2027/.env.example /home/user/i-sierra-2027/.env.local

# Fill in (DO NOT COMMIT):
# - All NEXT_PUBLIC_FIREBASE_* (from Step 1.1)
# - FIREBASE_ADMIN_SDK_KEY, FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL
# - GOOGLE_AI_API_KEY (Step 1.3)
# - SBR_SECRET_KEY, CRON_SECRET (Step 1.2)
# - PROPERTY_FINDER_* (Step 2.1)
# - AIRTABLE_* (Step 3.1)
# - NEXT_PUBLIC_SITE_URL = "https://sierrablu.luxury"
# - NODE_ENV = "production"
```

### 3.2 Apps Web `.env.local`
```bash
# Create /home/user/i-sierra-2027/apps/web/.env.local
cp /home/user/i-sierra-2027/apps/web/.env.local.example /home/user/i-sierra-2027/apps/web/.env.local

# Fill in:
# - All NEXT_PUBLIC_FIREBASE_* (same as root)
# - NEXT_PUBLIC_SITE_URL = "https://sierrablu.luxury"
# - NEXT_PUBLIC_APP_URL = "https://sierrablu.luxury"
# - NEXT_PUBLIC_DEFAULT_LOCALE = "en"
```

### 3.3 Workflows `.env` (if needed)
```bash
# Create /home/user/i-sierra-2027/workflows/.env
cp /home/user/i-sierra-2027/workflows/.env.example /home/user/i-sierra-2027/workflows/.env

# Fill in:
# - GOOGLE_SERVICE_ACCOUNT_KEY
# - PROPERTY_FINDER_JWT_TOKEN
# - WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_BUSINESS_ACCOUNT_ID
# - SENDGRID_API_KEY (if using SendGrid)
# - FIREBASE_* (if running workflows against Firebase)
```

---

## 4. Pre-Deployment Validation Checklist

### Build & Type Safety
- [ ] `pnpm install` completes without errors
- [ ] `pnpm type-check` passes (tsc --noEmit)
- [ ] `pnpm lint` passes (no ESLint violations)
- [ ] `pnpm test:ci` passes (all 57 tests pass)
- [ ] `pnpm build` completes; output is <1GB

### Firebase Connectivity
- [ ] Dev server starts: `pnpm dev`
- [ ] Browser console shows "Firebase initialized"
- [ ] Firestore Database is accessible (check Firebase Console)
- [ ] Storage Bucket is accessible
- [ ] Authentication is enabled (Email/Password provider)

### API Routes
- [ ] `POST /api/agent/hub` returns `{ success: true, response: "..." }`
- [ ] `POST /api/crm/leads` accepts valid lead data
- [ ] `POST /api/crm/property-finder` accepts sync data
- [ ] `POST /api/properties/sync` syncs from Property Finder
- [ ] `POST /api/seed/admin-setup` creates admin user (one-time)

### Integrations
- [ ] Property Finder API is accessible (test via `/api/properties/sync`)
- [ ] Airtable sync works (test via `/api/sync/airtable`)
- [ ] Google Sheets (if used) credentials are valid
- [ ] Telegram webhook is registered (if used)
- [ ] WhatsApp webhook is registered (if used)

### Security
- [ ] All secrets are in `.env.local` (NOT in code or .env files)
- [ ] `.env.local` is in `.gitignore` on all repos
- [ ] FIREBASE_ADMIN_SDK_KEY is never logged
- [ ] API keys are rotated from development defaults
- [ ] CORS is properly configured (check `next.config.ts`)

### Database
- [ ] Firestore rules are deployed
- [ ] Firestore indexes are created (check Console for warnings)
- [ ] Storage rules are deployed
- [ ] Backup schedule is configured in Firebase Console

### Observability (Optional)
- [ ] Sentry DSN is configured (if using Sentry)
- [ ] OpenTelemetry exporter is configured (if using Arize)
- [ ] Error logging works (test by triggering a 500 error)

---

## 5. Deployment Sequence (When Ready)

### 5.1 Pre-Deployment Dry Run
```bash
# 1. Test full build in production mode
NODE_ENV=production pnpm build

# 2. Start local production server
NODE_ENV=production pnpm start

# 3. Run smoke tests against localhost:3000
# (See section 4 above)

# 4. Check no console errors or warnings
```

### 5.2 Database Migrations (If Needed)
```bash
# Deploy Firestore indexes
firebase deploy --only firestore:indexes --project sierra-estates-prod

# Deploy security rules
firebase deploy --only firestore:rules,storage --project sierra-estates-prod
```

### 5.3 Vercel Deployment (TO BE DONE LATER)
```bash
# When user confirms:
git push origin claude/sharp-gauss-7o0Wa
# Create PR (if not exists) or update existing
# Merge to main
# Vercel auto-deploys from main branch
```

---

## 6. Secrets Management Best Practices

### What NOT to do:
- ❌ Commit `.env.local` to git
- ❌ Log environment variables in code
- ❌ Pass secrets in URL query parameters
- ❌ Store secrets in Firebase Realtime Database or Firestore
- ❌ Hardcode API keys in client-side code (use server APIs)

### What TO do:
- ✅ Use `.env.local` locally (in `.gitignore`)
- ✅ Use Vercel Environment Variables for production
- ✅ Rotate keys every 90 days
- ✅ Use narrow scopes for API keys (least privilege)
- ✅ Enable API key restrictions (IP whitelist, domain restrictions)
- ✅ Monitor API key usage via respective dashboards

---

## 7. Troubleshooting Common Issues

### Firebase Auth Errors
**Error:** `auth/invalid-api-key` or `auth/app-not-configured`  
**Solution:** Verify NEXT_PUBLIC_FIREBASE_* vars match Firebase Console values exactly

### Property Finder API Failures
**Error:** `401 Unauthorized` or `403 Forbidden`  
**Solution:** Check PROPERTY_FINDER_CLIENT_ID and CLIENT_SECRET are current (tokens expire)

### Airtable Sync Hangs
**Error:** Timeout or 429 (too many requests)  
**Solution:** Airtable API has rate limits; reduce AIRTABLE_TABLE_NAME list or add delays

### Firestore Rules Blocking Writes
**Error:** `PERMISSION_DENIED` in Firebase Console logs  
**Solution:** Rules are correctly deployed; verify user role is in users/{uid}.role

---

## 8. Post-Deployment Monitoring

### 1st Hour (Immediate Alerts)
- Monitor Sentry for new errors
- Check Telegram/Slack for webhook alerts
- Verify homepage loads without 5xx errors

### 1st Day
- Check Firestore query performance (Firebase Console → Performance)
- Verify no unexpected growth in Cloud Functions costs
- Spot-check agent responses for quality

### 1st Week
- Review user authentication flow (no login failures)
- Analyze API endpoint performance
- Check Property Finder sync success rate

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-01 | Initial pre-deployment guide; documented all 46+ environment variables, integration sequence, validation steps |

