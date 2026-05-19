# SKILLS.md — What Claude Can Help With on WasiatHub

This file defines the scope of tasks Claude can assist with for this project, guidelines for each skill area, and constraints to always respect.

---

## 1. Technical Skills

### Code & Features
- Add/edit Next.js pages, API routes, components
- Debug Cloudflare Workers deployment issues
- Supabase queries, RLS, schema changes
- DOKU payment integration (see AGENTS.md for details)
- PDF generation (`@react-pdf/renderer`, client-side only)
- Admin CRM updates

### Deployment
- Always use `npm run deploy` (never split into separate steps)
- Cloudflare CI is disconnected — manual deploys only
- Wrangler secrets via `npx wrangler secret put`

---

## 2. Content & Marketing Skills

### Brand Voice

| Attribute | Description |
|---|---|
| **Tone** | Plain, direct, warm — not legal jargon |
| **Language** | BM-first for Malay audience, English for non-Muslim/professional audience |
| **Emotional register** | Empathetic, consequence-driven — not fear-mongering |
| **Personality** | Trusted friend who happens to know the law, not a salesman |
| **What to avoid** | Corporate speak, excessive disclaimers, naming competitors |

**Good headline example**: "Tanpa wasiat, mahkamah yang tentukan siapa dapat harta anda."
**Bad headline example**: "WasiatHub provides comprehensive legally-structured will documentation services."

---

### 2A. TikTok Scripts

**When to use this skill**: Writing video scripts for `@wasiathub` TikTok account.

**Format for every script:**
```
TITLE: [video title / hook]
DURATION: [15 / 30 / 45 / 60 sec]
LANGUAGE: [BM / English / Mixed]
AUDIENCE: [Muslim-Malay / Non-Muslim / Both]

HOOK (0–3s): [what viewer sees/hears in first 3 seconds — must stop the scroll]
BODY (3s–end): [content broken into 5–10 second segments]
CTA (last 5s): [one clear action — visit wasiathub.my / link in bio]
CAPTION: [TikTok caption with 3–5 hashtags]
```

**Content formats that work:**
1. **"Apa jadi kalau..."** — real scary outcome, then solution
2. **Myth-busting** — "Ramai orang salah faham pasal..."
3. **Process walkthrough** — screen record of doing it in 15 min
4. **Comparison** — "Lawyer: RM1,000. WasiatHub: RM79. Masa: 15 minit."

**Rules:**
- Hook must be in the first 3 seconds — assume zero patience
- End every video with price (RM79) and time (15 minit)
- Never mention competitor names
- Legal claims must cite actual Malaysian law
- BM videos: formal enough to be credible, casual enough to be shareable
- English videos: target non-Muslim Malaysians (Chinese/Indian), reference Distribution Act 1958 or Wills Act 1959

**Hashtags to use:**
- BM: `#wasiat #wasiatislam #faraid #harta #perancanganharta #malaysia`
- EN: `#willwriting #estateplanning #malaysianlaw #willsact #getitdone`

---

### 2B. Facebook Posts

**When to use this skill**: Writing posts for the WasiatHub Facebook page.

**Format types:**

**Type 1 — Native story post** (highest reach, no external link in post)
```
HOOK LINE: [1 line that stops scrolling]
STORY: [3–5 short paragraphs, personal/emotional, real scenario]
BRIDGE: [connect to consequence — what happens without a will]
SOFT CTA: [mention WasiatHub naturally at the end, no hard sell]
NOTE: Post the link as first COMMENT, not in the post itself
```

**Type 2 — Educational list post**
```
HEADLINE: [bold statement or surprising fact]
LIST: [3–5 punchy points, short sentences]
CTA: [one action, direct]
```

**Type 3 — Boosted ad copy** (for paid promotion)
```
HOOK: [fear or curiosity trigger]
PROOF: [one concrete number or fact]
CTA: [direct — "Buat wasiat sekarang. RM79. 15 minit."]
TARGET: [specify age/interest targeting to use]
BUDGET: [suggested boost amount]
```

**Rules:**
- Facebook suppresses posts with external links in body — put the link in comments
- Malay posts: mix standard BM with some casual phrasing (ramai orang, kan ke, etc.)
- English posts: target Chinese/Indian Malaysians, reference Wills Act 1959 / Distribution Act 1958
- Never use stock photo descriptions — use real product screenshots or simple graphics
- Do not post the same content as TikTok — repurpose, don't copy

---

### 2C. SEO Articles

**When to use this skill**: Writing blog/insight articles for `wasiathub.my/insights`.

**Article structure:**
```
SLUG: [url-friendly, keyword-first e.g. wasiat-online-malaysia]
TARGET KEYWORD: [exact phrase to rank for]
LANGUAGE: [BM / English]
AUDIENCE: [Muslim-Malay / Non-Muslim / Both]
WORD COUNT: [800–1,200 words]

H1: [matches target keyword naturally]
INTRO (150 words): [problem/pain, why this matters, what article covers]
H2 sections (3–5): [each answers a specific sub-question]
LEGAL REFERENCE: [cite actual law: Wills Act 1959 / Distribution Act 1958 / Syariah]
CTA SECTION: [end with clear path to wasiathub.my/auth/register]
INTERNAL LINKS: [link to 2–3 other articles + homepage]
META DESCRIPTION: [150–160 chars, includes target keyword]
```

**Priority keywords (do these first):**

BM:
- `wasiat online malaysia` — direct commercial intent
- `berapa kos buat wasiat malaysia` — ready to buy
- `apa jadi harta tanpa wasiat malaysia` — fear + education
- `bezanya wasiat dan faraid` — educational
- `cara buat wasiat islam malaysia` — how-to

English:
- `how to write a will online malaysia` — commercial
- `what happens if you die without a will malaysia` — fear + education
- `distribution act 1958 malaysia explained` — Chinese/Indian audience
- `difference between wasiat and faraid` — Muslim audience, English speakers

**Rules:**
- Every claim about Malaysian law must be accurate and cite the actual Act
- Never say "the cheapest" — say "from RM79" or "RM79 vs RM1,000 at a lawyer"
- Never name competitors in articles
- Always end with a CTA linking to `/auth/register`
- BM articles: formal but readable, avoid overly academic language
- English articles: conversational, accessible to non-lawyers

---

### 2D. Landing Page Copy

**When to use this skill**: Updating or improving copy on `wasiathub.my` (app/page.tsx and related).

**Key messages that must appear on the landing page:**
1. Price: "RM 79" — must be visible without scrolling
2. Speed: "15 minit" — done quickly, no office visit needed
3. Dual product: Wasiat (Muslim) + General Will (non-Muslim)
4. Trust: Legally guided, PDF + email delivery
5. Price comparison: vs banks (RM298+), vs lawyers (RM1,000+)

**Sections to always include:**
- Hero: consequence-driven headline, not feature-driven
- How it works: 3 steps max
- Pricing: visible, no hidden fees
- Who it's for: explicitly mention both Muslim and non-Muslim
- FAQ: address top 3 objections (Is it legally valid? What if I need changes? Is my data safe?)
- Trust badges: PDPA, Wills Act 1959, SSL

**Headline test** — use consequence framing:
- Bad: "Create your Wasiat or Will online in minutes"
- Good: "Tanpa wasiat, mahkamah yang tentukan siapa dapat harta anda."
- Good: "70% of Malaysians have no will. Your family will pay the price."

---

### 2E. Email Marketing

**When to use this skill**: Writing emails to `marketing_consent = true` users via Hostinger SMTP.

**Rules:**
- Only send to users where `marketing_consent = true`
- From: `services@wasiathub.my`
- Subject lines: plain language, curiosity or consequence-driven
- Body: short — 150–250 words max, one CTA only
- Never spam — max 2 emails/month

**Email types:**
1. **Welcome email** (Day 0 after registration): introduce WasiatHub, one soft CTA
2. **Educational email** (Day 3–7): share one useful article, no hard sell
3. **Conversion nudge** (Day 14): "Your document is ready to complete — RM79"
4. **Monthly newsletter**: one new article + one reminder

---

## 3. Target Audience Profiles

### Profile A — Ahmad, 35, Malay Muslim, Selangor
- Married, 2 kids, owns a house and car
- Knows about wasiat vaguely, never got around to it
- Worried about family fighting over harta after he's gone
- Pain point: thinks making a will is complicated and expensive
- Trigger: friend's father passed away, family dispute followed
- Channel: TikTok, Facebook, WhatsApp (from friends)
- Message that works: "Habis kerja, dalam 15 minit, siap."

### Profile B — Mei Ling, 42, Chinese Malaysian, KL
- Divorced, 1 child, owns property + savings
- No will — never thought about it
- Worried about her assets going to estranged relatives under Distribution Act 1958
- Pain point: thinks she needs a lawyer, expensive and time-consuming
- Trigger: read a news article about frozen estate, distant relatives claiming assets
- Channel: Facebook, Google search
- Message that works: "Without a will, the Distribution Act 1958 decides who gets your assets — not you."

### Profile C — Priya, 28, Indian Malaysian, professional
- Single, just bought first property
- No will — "I'm too young for this"
- Trigger: got a mortgage, bank mentioned will writing
- Channel: TikTok, Instagram, Google
- Message that works: "You just bought a house. Who gets it if something happens to you?"

---

## 4. Content Do's and Don'ts

| Do | Don't |
|---|---|
| Cite Malaysian law by name (Wills Act 1959, Distribution Act 1958) | Make up or generalise legal claims |
| Show RM79 price prominently | Hide or delay showing the price |
| Use real Malaysian scenarios (frozen accounts, JPJ, Puspakom) | Use generic Western estate planning examples |
| Write BM that sounds natural, not translated | Translate English copy literally into BM |
| End every piece of content with one clear CTA | End with multiple competing CTAs |
| Mention both Muslim and non-Muslim products | Only target one segment |
| Use TikTok for awareness, Facebook for trust/conversion | Post identical content across all channels |
| Name the law, not the competitor | Name or imply competitors |

---

*Last updated: May 2026 | WasiatHub*
