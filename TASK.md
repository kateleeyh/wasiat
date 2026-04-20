# WasiatHub — Project Task Tracker

> **How to use this file**
> - `[ ]` = Not started
> - `[~]` = In progress
> - `[x]` = Done — add a ✓ remark with completion date, e.g. `[x] Task name ✓ 2026-04-10`
> - Update this file as work progresses. Do not delete completed tasks — keep them for audit trail.

---

## Phase 1 — Project Setup & Foundation
*Goal: Get the development environment, repo, and base infrastructure ready before any feature work.*

- [x] Initialise Next.js 14 project with App Router and TypeScript ✓ 2026-04-06
- [x] Configure Tailwind CSS and shadcn/ui component library ✓ 2026-04-06
- [x] Set up Supabase project (database + auth + storage) ✓ 2026-04-06
- [x] Configure Supabase Auth — email/password and Google OAuth ✓ 2026-04-06
- [x] Create `.env.local` from `.env.example` and fill in all API keys ✓ 2026-04-06
- [x] Configure `next-intl` for bilingual support (Bahasa Malaysia + English) ✓ 2026-04-06
- [x] Create translation files: `messages/en.json` and `messages/ms.json` ✓ 2026-04-06
- [x] Set up project folder structure (`/app`, `/components`, `/lib`, `/types`, `/hooks`) ✓ 2026-04-06
- [x] Connect Supabase client in Next.js (`/lib/supabase/client.ts`, `server.ts`, `admin.ts`) ✓ 2026-04-06
- [ ] Deploy base project to Vercel and verify CI/CD pipeline — **manual: push to GitHub + connect Vercel**

- [x] Add `.gitignore` to exclude `.env.local` and sensitive files ✓ 2026-04-06

**Phase 1 complete when:** App runs locally and on Vercel, Supabase connected, auth works, language toggle works.

---

## Phase 2 — Authentication & User Accounts
*Goal: Users can register, log in, manage their profile, and have a working dashboard shell.*

- [x] Build Register page (`/auth/register`) — email + password form ✓ 2026-04-06
- [x] Build Login page (`/auth/login`) — email + password + Google OAuth button ✓ 2026-04-06
- [x] Implement Supabase Auth session handling (proxy.ts for protected routes) ✓ 2026-04-06
- [x] Build user `Profile` table in Supabase — store name, IC, phone, language preference ✓ 2026-04-06
- [x] Build Profile settings page (`/profile`) — update details, change password ✓ 2026-04-06
- [x] Build Dashboard shell (`/dashboard`) — layout, sidebar/nav, language toggle ✓ 2026-04-06
- [x] Build "My Documents" list page (`/dashboard/documents`) — empty state on first load ✓ 2026-04-06
- [x] Implement auth redirect: unauthenticated users redirected to `/auth/login` ✓ 2026-04-06
- [x] Implement post-login redirect back to intended page ✓ 2026-04-06

**Phase 2 complete when:** User can register, log in, see dashboard, manage profile, and be correctly redirected.

---

## Phase 3 — Database Schema & Core Data Layer
*Goal: All Supabase tables, types, and server-side data access functions are ready before form building.*

- [x] Create `documents` table — id, user_id, type, status, language, created_at, updated_at, paid_at ✓ 2026-04-06
- [x] Create `wasiat_data` table — document_id, testator_info, movable_assets, immovable_assets, beneficiaries, executor, backup_executor, witnesses, declaration (all JSONB) ✓ 2026-04-06
- [x] Create `will_data` table — document_id, testator_info, assets, beneficiaries, guardianship, executor, backup_executor, witnesses, declaration (all JSONB) ✓ 2026-04-06
- [x] Create `payments` table — document_id, user_id, billplz_bill_id, amount, status, paid_at ✓ 2026-04-06
- [x] Set Row Level Security (RLS) policies — users can only access their own documents ✓ 2026-04-06
- [x] Write TypeScript types for all DB entities (`/types/database.ts`) ✓ 2026-04-07
- [x] Write server-side data access functions (`/lib/documents.ts`, `/lib/payments.ts`) ✓ 2026-04-06
- [x] Write auto-save utility — upsert draft data per step on change (`/hooks/useAutoSave.ts`) ✓ 2026-04-06
- [x] Schema review & migration 002 — executor, beneficiary, witness, naming fixes ✓ 2026-04-07

**Phase 3 complete when:** All tables exist with RLS, TypeScript types defined, and CRUD functions tested.

---

## Phase 4 — Document Type Selection & Form Shell
*Goal: User can choose between Wasiat and General Will, and the multi-step form shell (navigation, progress bar, auto-save) works for both.*

- [x] Build "Create New Document" page (`/dashboard/create`) — choose Wasiat or General Will ✓ 2026-04-09
- [x] On selection, create a new `documents` record (status: `draft`) and redirect to Step 1 ✓ 2026-04-09
- [x] Build reusable multi-step form layout component — step indicator, back/next buttons, progress bar ✓ 2026-04-09
- [x] Implement step routing: `/wasiat/[id]/step/[n]` and `/will/[id]/step/[n]` ✓ 2026-04-09
- [x] Implement auto-save on each step — debounced upsert to Supabase on field change ✓ 2026-04-09
- [x] Guard step routes — redirect if document doesn't belong to logged-in user ✓ 2026-04-09
- [x] Handle "resume draft" — redirect to last incomplete step when reopening a draft ✓ 2026-04-09

**Phase 4 complete when:** User can create a new document, navigate between steps, and data auto-saves correctly.

---

## Phase 5 — Wasiat Form (All Steps)
*Goal: Complete 7-step Wasiat form with validation and auto-save.*

- [ ] **Step 1 — Maklumat Pewasiat**: name, IC, DOB, gender, marital status, address, phone, email, religion confirmation, state
- [ ] **Step 2 — Harta Alih**: Option A (Lampiran A itemised list) and Option B (general statement) — both modes fully functional
- [ ] **Step 3 — Harta Tak Alih**: Option A and Option B — independent selection from Step 2
- [ ] **Step 4 — Penerima Manfaat**: Add/remove beneficiaries, 1/3 rule auto-validator, warning if total exceeds 1/3
- [ ] **Step 5 — Wasi (Executor)**: Primary and backup executor fields
- [ ] **Step 6 — Saksi (Witnesses)**: Witness 1 and Witness 2, validation that witnesses ≠ beneficiaries
- [ ] **Step 7 — Perisytiharan**: Date, typed name declaration, acknowledgement checkbox
- [ ] Form validation on each step — required fields, IC format, phone format
- [ ] Bilingual labels and error messages for all Wasiat steps

**Phase 5 complete when:** All 7 Wasiat steps validated, auto-saved, and navigable.

---

## Phase 6 — General Will Form (All Steps)
*Goal: Complete 7-step General Will form with validation and auto-save.*

- [ ] **Step 1 — Testator Info**: name, IC/passport, DOB, gender, marital status, nationality, religion, address, phone, email
- [ ] **Step 2 — Assets**: Property, bank accounts, EPF (with nomination disclaimer), investments, insurance, business, digital assets, vehicles, other
- [ ] **Step 3 — Beneficiaries**: Add/remove beneficiaries, assign specific assets or percentage, residual estate clause option
- [ ] **Step 4 — Guardianship**: Toggle for minor children, guardian + backup guardian fields (conditional display)
- [ ] **Step 5 — Executor**: Primary and backup executor fields
- [ ] **Step 6 — Witnesses**: Witness 1 and Witness 2, validation that witnesses ≠ beneficiaries or their spouses
- [ ] **Step 7 — Declaration**: Date, typed name declaration, acknowledgement checkbox
- [ ] Form validation on each step — required fields, IC format, phone format
- [ ] Bilingual labels and error messages for all General Will steps

**Phase 6 complete when:** All 7 General Will steps validated, auto-saved, and navigable.

---

## Phase 7 — Review & Preview Page
*Goal: User can review all inputs and see a partial-blur document preview before payment.*

- [x] Build Review Summary page — collapsible cards per section for Wasiat ✓ 2026-04-13
- [ ] Build Review Summary page — collapsible cards per section for General Will (pending Phase 6)
- [x] Each card shows key field values and has an **Edit** button (deep-links back to that step) ✓ 2026-04-13
- [x] Completion progress bar — highlight incomplete required sections ✓ 2026-04-13
- [x] Disable "Proceed to Payment" if any required section is incomplete ✓ 2026-04-13
- [x] Implement partial blur — CSS `blur-sm` on asset, beneficiary, executor, signature sections ✓ 2026-04-13
- [x] Show lock icon + "Bayar untuk melihat dokumen penuh" label on blurred sections ✓ 2026-04-13
- [x] Sticky "Proceed to Payment" CTA button at bottom of preview ✓ 2026-04-13
- [ ] Build document preview using React PDF (`@react-pdf/renderer`) — deferred to Phase 9 (PDF generation)
- [ ] Design Wasiat PDF template — proper legal Bahasa Malaysia / English formatting
- [ ] Design General Will PDF template — proper legal formatting per Wills Act 1959 style
- [ ] Include Lampiran A appendix in PDF when Option A is selected for assets

**Phase 7 complete when:** Review summary is accurate, preview renders correctly, blur strategy works on both document types.

---

## Phase 8 — Payment Integration (Billplz)
*Goal: Users can pay via Billplz FPX and document is unlocked on successful payment.*

- [~] Set up Billplz account — using mock payment flow for dev; real Billplz wired in Phase 14
- [x] Build payment page (`/payment/[id]`) — order summary + mock simulate button ✓ 2026-04-13
- [x] Build mock-complete API route (`/api/payment/mock-complete`) — marks doc completed, creates payment record ✓ 2026-04-13
- [x] Build payment success page (`/payment/[id]/success`) — next steps, PDF download placeholder ✓ 2026-04-13
- [x] Update `documents.status` to `completed` and `documents.paid_at` on successful payment ✓ 2026-04-13
- [ ] Build real Billplz bill creation (`/api/payment/create`) — deferred to Phase 14
- [ ] Build Billplz webhook handler (`/api/payment/webhook`) — deferred to Phase 14
- [ ] Build payment failed/cancelled page — deferred to Phase 14
- [ ] Validate webhook X-Signature — deferred to Phase 14

**Phase 8 complete when:** Mock flow tested end-to-end. Real Billplz integration deferred to Phase 14.

---

## Phase 9 — PDF Generation & Email Delivery
*Goal: Final unblurred PDF is generated after payment and emailed to the user.*

- [x] Build PDF generation API route (`/api/documents/generate`) — triggered on demand from success page ✓ 2026-04-13
- [x] Generate final Wasiat PDF — full legal BM content, includes Lampiran A if applicable ✓ 2026-04-13
- [x] Store generated PDF in Supabase Storage under user's folder ✓ 2026-04-13
- [x] Build SendGrid email template — BM body, signing instructions, PDF attachment ✓ 2026-04-13
- [x] Attach generated PDF to SendGrid email ✓ 2026-04-13
- [x] Send email to user's registered email address post-payment ✓ 2026-04-13
- [x] Build Download PDF button on success page — auto-triggers generation if not yet generated ✓ 2026-04-13
- [ ] Generate final General Will PDF — pending Phase 6 (General Will form)
- [ ] Build "Re-send email" button in dashboard — Phase 10
- [ ] Test PDF rendering for edge cases — pending full end-to-end test

**Phase 9 complete when:** PDF generates correctly for all cases, email received with correct attachment.

---

## Phase 10 — Dashboard & Document Management
*Goal: Users can manage all their documents — drafts and completed — from the dashboard.*

- [ ] Build My Documents list (`/dashboard/documents`) — show all drafts and completed documents
- [ ] Show document type (Wasiat / Will), status badge (Draft / Completed), created date
- [ ] Draft documents: show "Continue" button → resume at last incomplete step
- [ ] Completed documents: show "Download PDF" and "Re-send Email" buttons
- [ ] Allow user to delete a draft document (with confirmation)
- [ ] Build Billing History page — list of past payments with date, amount, document reference
- [ ] Display post-payment notice reminding user to sign with witnesses and register/file document

**Phase 10 complete when:** All document states handled in dashboard, download and re-send work correctly.

---

## Phase 11 — Legal Disclaimers, Content & Compliance Polish
*Goal: All legal notices, warnings, and compliance copy are in place throughout the app.*

- [ ] Add legal disclaimer page (`/disclaimer`) — full disclaimer text in BM + EN
- [ ] Add disclaimer acceptance checkbox at document creation (before Step 1)
- [ ] Add EPF nomination disclaimer in General Will Step 2 (assets)
- [ ] Add 1/3 Faraid rule warning in Wasiat Step 4 (beneficiaries)
- [ ] Add witness eligibility notice in Step 6 of both flows
- [ ] Add post-payment signing instruction notice (Wasiat: register with State Islamic Authority; Will: sign in front of 2 witnesses)
- [ ] Add footer links: Privacy Policy, Terms of Service, Disclaimer
- [ ] Write Privacy Policy page
- [ ] Write Terms of Service page

**Phase 11 complete when:** All legal copy reviewed, disclaimers shown at correct touchpoints.

---

## Phase 12 — Landing Page & Public Marketing Pages
*Goal: Public-facing pages that explain the product and drive sign-ups.*

- [ ] Build Landing page (`/`) — hero, what is Wasiat/Will, why WasiatHub, pricing, CTA
- [ ] Build FAQ section — common questions about Wasiat, General Will, and the process
- [ ] Build Pricing section — RM 49 per document, RM 79 bundle
- [ ] Language toggle on landing page (BM / EN)
- [ ] SEO metadata — title, description, OG tags for all public pages
- [ ] Mobile-responsive layout for all public pages

**Phase 12 complete when:** Landing page live, SEO tags set, fully responsive on mobile.

---

## Phase 13 — Testing & QA
*Goal: Functional, edge case, and security testing before launch.*

- [ ] Test Wasiat form — all 7 steps, both asset modes, 1/3 rule validation
- [ ] Test General Will form — all 7 steps, guardianship toggle, residual estate clause
- [ ] Test review summary — all fields display correctly, edit links return to correct step
- [ ] Test PDF preview blur — correct sections blurred/visible
- [ ] Test PDF generation — Wasiat and General Will, BM and EN, with and without Lampiran A
- [ ] Test payment flow — success, failure, webhook, duplicate webhook handling
- [ ] Test email delivery — PDF attachment received, correct language
- [ ] Test auth flows — register, login, Google OAuth, session expiry, protected routes
- [ ] Test RLS policies — user cannot access another user's documents
- [ ] Test Billplz webhook signature validation
- [ ] Test mobile responsiveness on forms and dashboard
- [ ] Test bilingual toggle — all strings translated, no missing keys
- [ ] Test auto-save — data persists across page refresh and browser close

**Phase 13 complete when:** All critical paths tested and passing with no blocking bugs.

---

## Phase 14 — Production Launch
*Goal: App deployed to production and ready for real users.*

- [ ] Set all production environment variables in Vercel
- [ ] Switch Billplz from sandbox to production credentials
- [ ] Configure custom domain (e.g. wasiathub.com) on Vercel
- [ ] Configure SendGrid domain authentication (SPF, DKIM) for email deliverability
- [ ] Set Supabase production database connection limits and backups
- [ ] Final review of all legal disclaimers and pricing copy
- [ ] Smoke test full flow on production (register → create → pay → receive email)
- [ ] Monitor Vercel logs and Supabase dashboard post-launch

**Phase 14 complete when:** App live on production domain, smoke test passed, monitoring in place.

---

## Backlog — Post-MVP Enhancements

- [ ] Faraid calculator integrated into Wasiat flow
- [ ] Joint will for married couples
- [ ] Hibah (gift inter vivos) document type
- [ ] Malay notary / lawyer directory referral
- [ ] Annual reminder emails (will review nudge)
- [ ] Admin dashboard for document management and analytics
- [ ] WhatsApp notifications via official API

---

*Last updated: 2026-04-06*
