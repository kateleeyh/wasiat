# WasiatHub — Product Requirements Document (PRD)

> **SECURITY NOTICE**
> API keys, secrets, and credentials for this project are stored in `.env.local` and must **never** be shared, pasted, or revealed in any chat, issue, PR description, or public channel. If a key is accidentally exposed, rotate it immediately via the respective service dashboard.

---

## 1. Project Overview

**WasiatHub** is a Malaysian online platform that enables users to create legally-guided Wasiat (Islamic Will) and General Will (Surat Wasiat Am) through a guided, step-by-step digital form. Upon completion and payment, the document is generated as a PDF and sent to the user's email.

- **Target Market**: Malaysian residents (Muslim and non-Muslim)
- **Languages**: Bahasa Malaysia & English (user can toggle)
- **Monetization**: One-time payment per document generation
- **Payment Gateway**: DOKU (formerly SenangPay Malaysia) — FPX + GrabPay + Touch 'n Go
- **Live Domain**: https://wasiathub.my
- **Hosting**: Cloudflare Workers (via OpenNext)

---

## 2. Legal Framework

### Wasiat (Islamic Will)
- Governed by **Syariah law** in Malaysia (varies by state)
- Maximum bequest to non-heirs: **1/3 of total estate**
- Remaining **2/3 follows Faraid** (Islamic inheritance law)
- Testator may choose "All Follows Faraid" — skip 1/3 designation (Wasiat still valid for appointing Wasi)
- Covers **Harta Alih** (movable) and **Harta Tak Alih** (immovable assets)
- Requires **2 Muslim witnesses** for validity
- Executor (Wasi) must be Muslim
- Document always generated in **Bahasa Malaysia**

### General Will (Non-Muslim)
- Governed by **Wills Act 1959 (Malaysia)**
- Testator must be **18 years or older**, of sound mind
- **Islam is excluded** from religion options — Muslims must use Wasiat
- Requires **2 witnesses who are not beneficiaries** (Wills Act 1959 s.9)
- Can include guardianship for minor children
- Document generated in user's selected language (BM or EN)

---

## 3. Tech Stack (Current)

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS |
| Authentication | Supabase Auth (email + Google OAuth) |
| Database | Supabase (PostgreSQL) |
| File Storage | Supabase Storage (generated PDFs) |
| PDF Generation | React PDF (`@react-pdf/renderer`) — client-side |
| Email Delivery | Resend (`services@wasiathub.my`) |
| Payment | DOKU API (FPX + GrabPay + Touch 'n Go) |
| Hosting | Cloudflare Workers via `@opennextjs/cloudflare` |
| i18n | `next-intl` (BM + English) |

---

## 4. Environment Variables

| Key | Service | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | Server-only |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` / `SMTP_PORT` | Hostinger SMTP | Server-only. Email via `services@wasiathub.my` |
| `DOKU_CLIENT_ID` | DOKU | Client ID from DOKU API Keys page |
| `DOKU_SECRET_KEY` | DOKU | Active Secret Key — used for HMAC-SHA256 signing |
| `NEXT_PUBLIC_APP_URL` | App | `https://wasiathub.my` |

All secrets stored in `.env.local` and as Cloudflare Worker secrets via `wrangler secret put`.

---

## 5. Pricing

Centralized in `lib/pricing.ts`. Change `TEST_MODE` flag only.

| Plan | Price | Details |
|---|---|---|
| Single | RM 79 | 1 document, PDF, email |
| Family Bundle | RM 129 | 2 credits — 1st doc unlocked + 1 credit stored for any future doc |
| Credit redemption | Free | Uses stored bundle credit |

> **TEST_MODE = true** → charges RM 1 for both plans (for testing)
> **TEST_MODE = false** → live pricing (RM 79 / RM 129) ✅ currently active

---

## 6. Database Schema

### `users`
- id, email, full_name, ic_number, phone, language_preference, created_at
- `bundle_credits INT DEFAULT 0` — stored credits from Family Bundle purchase

### `documents`
- id, user_id, type (`wasiat` | `general_will`), status (`draft` | `completed`), language, created_at, updated_at, paid_at, pdf_url

### `wasiat_data`
- id, document_id, testator_info, movable_assets, immovable_assets, beneficiaries, executor, backup_executor, witnesses, declaration (all JSON)
- `beneficiaries = []` (empty array) means "All Follows Faraid" — distinct from `null` (not filled)

### `will_data`
- id, document_id, testator_info, assets, beneficiaries, asset_distributions, residual_estate_beneficiary, guardianship, executor, backup_executor, witnesses, declaration (all JSON)

### `payments`
- id, document_id, user_id, billplz_bill_id, amount, currency, status, paid_at
- `plan TEXT DEFAULT 'single'` — values: `'single'` | `'bundle'` | `'credit'`

---

## 7. Routes

```
/                          → Landing page
/auth/login                → Login
/auth/register             → Register
/dashboard                 → Dashboard home
/dashboard/documents       → My Documents
/dashboard/create          → Choose document type
/dashboard/profile         → User profile
/dashboard/billing         → Billing history
/wasiat/[id]/step/[n]      → Wasiat form steps 1–7
/will/[id]/step/[n]        → General Will form steps 1–7
/wasiat/[id]/review        → Review & preview (Wasiat)
/will/[id]/review          → Review & preview (Will)
/payment/[id]              → Payment page
/payment/[id]/success      → Success + PDF download
/insights                  → Insights articles (placeholder)
/privacy                   → Privacy Policy
/terms                     → Terms of Use
/disclaimer                → Disclaimer
/contact                   → Contact Us
```

---

## 8. Payment Flow

### Single (RM 79)
```
Review → Pay RM 79 → DOKU checkout (checkout.doku.com) → Payment
  → DOKU fires webhook → /api/payment/callback verifies HMAC signature
  → Document marked completed + payment record inserted
  → DOKU redirects to /payment/[id]/success
  → PaymentVerifying spinner polls DB (3s interval, max 60s) until completed
  → Success page shown → Generate PDF
```

### Family Bundle (RM 129)
```
Review → Pay RM 129 → DOKU checkout → Payment
  → Webhook marks Doc #1 completed + stores 1 bundle credit
  → Success → Generate PDF
Doc #2 (anytime) → Payment page shows "Bundle Credit Available" → Use credit (free) → Generate PDF
```

### Security — Free PDF Loophole Prevention
- `PaymentVerifying` component polls `/api/payment/status/[id]` every 3s
- Only shows success after webhook confirms `doc.status = completed`
- Users who cancel/go back without paying: wait 60s → redirected to payment page
- Test mode simulate button has been **removed** — live payments only

---

## 9. Cross-Field Legal Validation

Enforced at **Review page** for both Wasiat and Will. Violations block payment.

**Errors (payment blocked):**
- Testator = executor / wasi / witness / beneficiary / guardian
- Beneficiary = witness (Wills Act 1959 s.9 / Syariah)
- Witness 1 = Witness 2
- Primary executor = backup executor
- Primary guardian = backup guardian
- Wasi = witness (Wasiat only)

**Warnings (payment allowed):**
- Wasi is also a beneficiary
- Executor is also a witness

---

## 10. Key Design Decisions

1. **PDF generation is client-side** (browser) — avoids Cloudflare Workers memory limits
2. **Wasiat always in Malay** — document content, preset text, declarations all forced to BM regardless of UI language
3. **Islam excluded from General Will** religion dropdown — Muslims directed to Wasiat
4. **Wasiat Step 4 optional** — user can choose "All Follows Faraid" (empty beneficiaries = valid)
5. **Admin client for all payment writes** — bypasses Supabase RLS
6. **Centralized pricing** in `lib/pricing.ts` — TEST_MODE flag for easy switching
7. **Bottom tab nav on mobile** — sidebar only on desktop (md+)
8. **My Documents shows testator name** — fetched from wasiat_data/will_data, not stored on documents table

---

## 11. Deploy Process

```bash
# Build and deploy
python3 -c "import shutil; shutil.rmtree('.next', ignore_errors=True); shutil.rmtree('.open-next', ignore_errors=True)"
npm run deploy
# deploy script: next build → opennextjs-cloudflare build → dedup next-env.mjs → wrangler deploy
```

Known issue: `next-env.mjs` gets duplicate exports — `npm run deploy` auto-deduplicates before wrangler.

---

## 12. Admin CRM

URL: `wasiathub.my/admin` — protected by email whitelist in `app/admin/layout.tsx`.

Pages:
- **Overview** — key stats, recent payments, recent registrations
- **Users** — full user list with PDPA/marketing consent flags
- **Documents** — all documents with status, type, dates
- **Revenue** — all paid transactions, monthly breakdown, invoice references
- **Promo Codes** — create/manage discount codes

Admin access: edit `ADMIN_EMAILS` array in `app/admin/layout.tsx` and redeploy.

---

## 13. Deploy Process

```bash
npm run deploy
```

Runs: `next build` → `opennextjs-cloudflare build` → dedup `next-env.mjs` → `wrangler deploy`

**IMPORTANT**: Never run `npm run build` + `wrangler deploy` separately. The `.open-next` directory is only updated by `opennextjs-cloudflare build`. Cloudflare CI is disconnected — all deployments are manual.

---

## 14. What's Next

### Done ✅
- [x] `TEST_MODE = false` — live pricing (RM79 / RM129)
- [x] DOKU payment gateway (FPX + GrabPay + TnG)
- [x] DOKU webhook server-side confirmation
- [x] PaymentVerifying — prevents free PDF loophole
- [x] Admin CRM dashboard
- [x] Promo code system

### Up Next
- [ ] Annual reminder email ("Review your wasiat — 1 year later")
- [ ] Referral program
- [ ] Faraid calculator info in Wasiat flow
- [ ] WhatsApp notifications
- [ ] Hibah document type (future)

---

*Document version: 3.0 | Updated: 16 May 2026 | WasiatHub*
