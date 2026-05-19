# AGENTS.md — WasiatHub Developer Guide

This is the WasiatHub.my project. Read this file before making any changes.

---

## Core Rules

- Do NOT rewrite large files unless necessary — make small, targeted edits
- Always read a file before editing it
- Preserve existing flows: Wasiat form, Will form, Payment, PDF generation, Email
- Explain all changes clearly
- Do not break working features
- Avoid assumptions — inspect before acting
- Never expose API keys, secrets, or credentials in any output

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router) |
| Styling | Tailwind CSS |
| Auth | Supabase Auth (email + Google OAuth) |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage (PDFs) |
| PDF | `@react-pdf/renderer` — client-side only |
| Email | Nodemailer via Hostinger SMTP (`services@wasiathub.my`) |
| Payment | **DOKU** (formerly SenangPay Malaysia) — FPX + GrabPay + TnG |
| Hosting | Cloudflare Workers via `@opennextjs/cloudflare` |

---

## CRITICAL: Deployment Process

**Never run `npm run build` + `npx wrangler deploy` separately.** The correct command is:

```bash
npm run deploy
```

This runs in sequence:
1. `next build` — compiles Next.js
2. `opennextjs-cloudflare build` — transforms `.next` → `.open-next` for Cloudflare Workers
3. Deduplicates `next-env.mjs` (known issue)
4. `wrangler deploy` — uploads to Cloudflare

If you skip step 2, **stale old code will be deployed** (`.open-next` is not updated by `next build` alone).

Cloudflare CI is **disconnected** — all deployments are manual via `npm run deploy`.

---

## Payment Gateway — DOKU

- **Provider**: DOKU (acquired SenangPay Malaysia) — `dashboard.doku.com`
- **Checkout API**: `POST https://api.doku.com/checkout/v1/payment`
- **Auth**: HMAC-SHA256 signature using `Client-Id` + `Active Secret Key`
- **Response**: `data.response.payment.url` (not `data.payment.url`)
- **Amounts**: sent in **whole MYR** (e.g. `79` for RM 79, not `7900`)
- **Webhook**: DOKU POSTs to `/api/payment/callback` after payment
- **Signature verification**: `Client-Id` + `Request-Id` + `Request-Timestamp` + `Request-Target` + `Digest` HMAC-SHA256
- **Callback URL**: `https://wasiathub.my/api/payment/callback` (configured in DOKU dashboard → Webhook)
- **Payment methods**: FPX, GrabPay, Touch 'n Go

Environment variables (Cloudflare secrets):
- `DOKU_CLIENT_ID` — Client ID from DOKU API Keys page
- `DOKU_SECRET_KEY` — Active Secret Key from DOKU API Keys page

---

## Pricing

Centralized in `lib/pricing.ts`. **Never hardcode prices elsewhere.**

| Plan | `amountSen` | Display | DOKU amount sent |
|---|---:|---|---:|
| Single | 7900 | RM 79 | 79 |
| Bundle | 12900 | RM 129 | 129 |
| Test (RM1) | 100 | RM 1 | 1 |

`TEST_MODE = false` is **live**. Do not set to `true` unless testing.

---

## Admin CRM

- URL: `wasiathub.my/admin`
- Access: email whitelist in `app/admin/layout.tsx` → `ADMIN_EMAILS` array
- Pages: Overview, Users, Documents, Revenue, Promo Codes
- To add/remove admin access: edit `ADMIN_EMAILS` array and redeploy

---

## Key File Locations

| Purpose | File |
|---|---|
| Pricing config | `lib/pricing.ts` |
| Create payment | `app/api/payment/create-bill/route.ts` |
| Payment webhook | `app/api/payment/callback/route.ts` |
| Payment status poll | `app/api/payment/status/[id]/route.ts` |
| Success page | `app/payment/[id]/success/page.tsx` |
| Verifying spinner | `components/payment/PaymentVerifying.tsx` |
| Admin layout & auth | `app/admin/layout.tsx` |
| PDF (Wasiat) | `lib/pdf/WasiatPdf.tsx` |
| PDF (Will) | `lib/pdf/WillPdf.tsx` |

---

## Payment Flow (Current)

```
User → Review → Pay → DOKU checkout (checkout.doku.com)
  → Payment success → DOKU redirects to /payment/[id]/success
  → Success page checks doc.status
  → If not completed: show PaymentVerifying spinner (polls every 3s, max 60s)
  → DOKU fires webhook → /api/payment/callback verifies HMAC signature
  → Webhook marks document completed + inserts payment record
  → PaymentVerifying detects completed → page refreshes → success shown
  → User downloads PDF
```

**Security**: PaymentVerifying polls the DB — it only shows success after the webhook confirms payment. Users who click "Back to merchant" without paying will wait 60s then be redirected back to the payment page.

---

## Language Rules

- Bahasa Malaysia content must remain formal and Syariah-compliant
- Wasiat documents always generated in BM regardless of UI language
- General Will follows user's selected language (BM or EN)

---

## Marketing Context

WasiatHub is now in Phase 2 — marketing and lead generation. The product is live and payment works. See `SKILLS.md` for content creation guidelines.

**Target audiences:**

| Segment | Product | Key pain point |
|---|---|---|
| Malay/Muslim (primary) | Wasiat | Family disputes, Faraid, who manages estate |
| Chinese/Indian Malaysian | General Will | Distribution Act 1958, frozen assets, probate cost |
| Young professionals (25–35) | Both | Marriage, first home, new baby as triggers |

**Active marketing channels:**
- TikTok `@wasiathub` — awareness, both segments, BM + EN
- Facebook page — trust, conversion, age 35–55
- SEO articles — organic search, long-term
- Landing page — convert arriving traffic

**Content rules:**
- Never name competitors by name in any public content
- All legal claims must reference actual Malaysian law (Wills Act 1959, Distribution Act 1958, Syariah)
- Price RM79 is a major competitive advantage — always mention it
- Tone: plain language, consequence-driven, never condescending

---

## Priority

1. Stability — do not break existing working flows
2. Correctness — legal accuracy matters
3. UX
4. Marketing / SEO
