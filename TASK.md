# WasiatHub — Task & Progress Tracker

## Status: LIVE at wasiathub.my | Phase 2: Marketing & Lead Generation

---

## ✅ PHASE 1 — PRODUCT (COMPLETED)

### Infrastructure
- [x] Domain `wasiathub.my` — Cloudflare Workers
- [x] Email: Resend `services@wasiathub.my`
- [x] Google OAuth for `wasiathub.my`
- [x] Billplz FPX payment (RM79 single / RM129 bundle)
- [x] `TEST_MODE = false` — live pricing active

### Product
- [x] Wasiat Islam (7-step form, Malay PDF)
- [x] General Will (7-step form, BM/EN PDF)
- [x] Family Bundle credit system
- [x] Cross-field legal validation at Review page
- [x] PDPA + Marketing consent (email & Google users)
- [x] Delete document button in dashboard
- [x] Mobile-responsive (bottom tab nav)
- [x] InfoTip collapsible legal notices

### Legal & PDF
- [x] PDF footer: name + IC + page number on all pages
- [x] State enactment in Wasiat Mukadimah
- [x] Wasi/Witness addresses in PDF
- [x] Disclaimer removed from PDF (on website only)
- [x] Privacy Policy, Terms, Disclaimer, Contact pages

### Landing Page
- [x] "Your Will, Your Way." tagline
- [x] "One price. Zero limits." differentiator
- [x] Document mockup stack visual in hero
- [x] Trust badges: SSL / FPX / PDPA / Wills Act 1959
- [x] Pricing: RM79 / RM129 (centralized in `lib/pricing.ts`)

### SEO (Technical)
- [x] Meta tags, Open Graph, Twitter cards
- [x] Schema.org LegalService structured data
- [x] sitemap.xml at `wasiathub.my/sitemap.xml`
- [x] robots.txt

### Insights / Content
- [x] 6 articles live (pillar + 5 supporting)
  - [x] Tukar Nama Kereta Arwah (Pillar — Arif's story)
  - [x] Akaun Bank Dibekukan
  - [x] Grant of Probate vs Letter of Administration
  - [x] 5 Salah Faham Tentang Wasiat
  - [x] EPF Nomination Bukan Wasiat
  - [x] Wasiat Islam vs Surat Wasiat Am

---

## 🔲 PHASE 2 — MARKETING & LEAD GENERATION (CURRENT)

### 2A. SEO — Search Engine Visibility
**Goal: Rank on Google for "wasiat online malaysia", "tukar nama kereta arwah", etc.**

- [ ] Submit sitemap to Google Search Console (`search.google.com/search-console`)
      → Add `wasiathub.my` → verify via Cloudflare DNS TXT record → submit sitemap URL
- [ ] Create OG image (1200×630px) — `public/og-image.png`
      → Dark background + WasiatHub logo + tagline (needed for social sharing previews)
- [ ] Write 4 more Insights articles (from SEO cluster plan):
  - [ ] "Boleh Tak Guna Kereta Arwah Tanpa Tukar Nama?"
  - [ ] "Kenapa Tukar Nama Kereta RM100 Tapi Kos Boleh RM10,000?"
  - [ ] "Rumah Arwah Tak Boleh Terus Jual — Ini Sebabnya"
  - [ ] "Berapa Kos Sebenar Urus Harta Pusaka Tanpa Wasiat?"
- [ ] Internal linking — ensure all articles link to pillar & to `/auth/register`
- [ ] Add article dates to sitemap (dynamic, based on actual publish dates)

### 2B. Social Media — Awareness & Reach
**Goal: Build organic reach before spending on ads**

**Facebook / Instagram:**
- [ ] Create WasiatHub Facebook Page (`facebook.com/wasiathub`)
- [ ] Create WasiatHub Instagram (`instagram.com/wasiathub`)
- [ ] Post template 1 — Hook posts (vehicle transfer, bank account frozen)
      → Use article excerpts as captions, link to Insights page
- [ ] Post template 2 — Myth-busting carousel (EPF nomination, "saya tak kaya")
- [ ] Post template 3 — Educational infographic (Distribution Act 1958 formula)
- [ ] Posting schedule: 3x per week minimum

**TikTok:**
- [ ] Create WasiatHub TikTok (`@wasiathub`)
- [ ] Video ideas:
  - "3 benda yang ramai tak tahu tentang wasiat" (60 sec)
  - "EPF nomination ≠ wasiat — ini bezanya" (45 sec)
  - "Berapa lama proses tukar nama kereta arwah?" (30 sec)

**WhatsApp:**
- [ ] Set up WhatsApp Business number for `wasiathub.my`
- [ ] Create WhatsApp Business profile (logo, description, link)
- [ ] Share articles in relevant Malaysian groups (family law, financial planning, community)

### 2C. Lead Generation — First 100 Users
**Goal: Get first 10 paying customers, then 50, then 100**

**Week 1-2 (Free channels):**
- [ ] Share pillar article in 10 WhatsApp family/community groups
- [ ] Post on personal Facebook/LinkedIn with genuine personal story about why you built this
- [ ] Ask 5 friends/family to try the product and give honest feedback
- [ ] Submit to Malaysian startup directories:
  - [ ] Vulcan Post tips (`tips@vulcanpost.com`)
  - [ ] SoyaCincau tips
  - [ ] Malaysia Startup community (Facebook group)

**Week 3-4 (Content seeding):**
- [ ] Post "Arif's story" article as Facebook/LinkedIn post (native format, not just link)
- [ ] Create Quora/Reddit answers to "how to transfer car ownership after death Malaysia"
- [ ] Comment helpfully in Facebook groups about estate/wasiat questions

**Month 2 (Paid):**
- [ ] Facebook/Meta Ads — start RM300/month test budget
  - Target: Malaysia, age 28-55, interests: property, financial planning, family
  - Creative: "Kereta arwah stuck kat JPJ?" hook
  - CTA: "Buat wasiat sekarang — RM79"
- [ ] Google Ads — RM300/month test budget
  - Keywords: "wasiat online malaysia", "tukar nama kereta arwah", "cara buat wasiat"
  - Landing page: wasiathub.my

### 2D. Email Marketing — Nurture Leads
**Goal: Use marketing_consent list to send educational emails**

- [ ] Set up email sequence in Resend (3-email welcome series):
  - Email 1 (Day 0): Welcome — "Ini yang WasiatHub boleh buat untuk anda"
  - Email 2 (Day 3): Educational — Share "Kereta Arwah" article
  - Email 3 (Day 7): CTA — "Draf wasiat anda dalam 15 minit"
- [ ] Monthly newsletter to `marketing_consent = true` users
      → 1 new article + 1 reminder CTA

### 2E. PR & Partnership
**Goal: Build credibility and backlinks**

- [ ] Reach out to 1-2 Malaysian financial bloggers for collaboration
- [ ] Write guest article for Ringgit Oh Ringgit or similar Malaysian PF blog
- [ ] Contact MAIF (Malaysian Association of Islamic Finance) for visibility
- [ ] Approach HR departments of companies for employee benefit (wasiat as perk)

---

## 🔲 PHASE 3 — PRODUCT IMPROVEMENTS (NEXT SPRINT)

### Payment
- [ ] Switch Billplz → DOKU (only `app/api/payment/create-bill/route.ts` needs change)
- [ ] Billplz server-side webhook (currently relies on redirect params as fallback)

### Product Features
- [ ] Admin dashboard (view all users, documents, payments, revenue)
- [ ] Annual reminder email to all users ("Review your wasiat — 1 year later")
- [ ] Referral program ("Share with a friend — both get RM10 off")
- [ ] Hibah document type (future — after Wasiat & Will are fully stable)

### Content
- [ ] 4 remaining SEO cluster articles (from 2A above)
- [ ] Translate all 6 articles to English version (currently bilingual but BM-first)
- [ ] Add proper article images/illustrations to Insights pages

---

## 🔲 PHASE 4 — SCALE (3-6 MONTHS)

- [ ] wasiathub.my as primary domain (already done ✅)
- [ ] Google My Business listing
- [ ] Reach 100 paying customers → validate pricing → consider price review
- [ ] Consider partnerships with law firms for "refer for complex cases"
- [ ] WhatsApp Business API for automated follow-ups
- [ ] Consider mobile app (React Native) if web traffic is strong

---

## KEY METRICS TO TRACK

| Metric | Target (Month 1) | Target (Month 3) |
|---|---|---|
| Website visitors | 500/month | 2,000/month |
| Free registrations | 50 | 200 |
| Paying customers | 5 | 30 |
| Revenue | RM395 | RM2,370 |
| Top Google ranking | Top 10 for 1 keyword | Top 5 for 3 keywords |

---

## CRITICAL REMINDERS

- `lib/pricing.ts` — `TEST_MODE = false` ✅ (live pricing active)
- Payment gateway switch: Billplz → DOKU = change only `create-bill/route.ts`
- Never name competitors in any content
- All article claims must reference actual Malaysian law
- `marketing_consent` users only for promotional emails

---
*Last updated: May 2026 | WasiatHub*
