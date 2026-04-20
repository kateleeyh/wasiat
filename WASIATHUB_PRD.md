# WasiatHub — Product Requirements Document (PRD)

> **SECURITY NOTICE**
> API keys, secrets, and credentials for this project are stored in `.env.local` and must **never** be shared, pasted, or revealed in any chat, issue, PR description, or public channel — including this document and any AI assistant conversation. If a key is accidentally exposed, rotate it immediately via the respective service dashboard.

---

## 1. Project Overview

**WasiatHub** is a Malaysian online platform that enables users to create legally-guided Wasiat (Islamic Will) and General Will (for non-Muslims) through a guided, step-by-step digital form. Upon completion and payment, the document is generated as a PDF and sent to the user's email.

- **Target Market**: Malaysian residents (Muslim and non-Muslim)
- **Languages**: Bahasa Malaysia & English (user can toggle)
- **Monetization**: One-time payment per document generation
- **Payment Gateway**: Billplz (FPX-based, local Malaysian)

---

## 2. Legal Framework

### Wasiat (Islamic Will)
- Governed by **Syariah law** in Malaysia (varies by state, e.g., Enakmen Wasiat Orang Islam)
- Maximum bequest to non-heirs: **1/3 of total estate**
- Remaining **2/3 follows Faraid** (Islamic inheritance law — distributed to legal heirs automatically)
- Covers **Harta Alih** (movable assets) and **Harta Tak Alih** (immovable assets)
- Guardian (penjaga) is **excluded** — guardianship falls under civil law
- Requires **2 witnesses (saksi)** for validity under Syariah
- Executor (wasi) must be Muslim

### General Will (Non-Muslim)
- Governed by **Wills Act 1959 (Malaysia)**
- Testator must be **18 years or older** and of sound mind
- Requires **2 witnesses** who are not beneficiaries
- Can include **guardianship** for minor children
- Covers all asset types: property, bank accounts, EPF, investments, insurance, digital assets, business interests

---

## 3. Core Features

| Feature | Description |
|---|---|
| Document Type Selection | User selects Wasiat or General Will at onboarding |
| Guided Step-by-Step Form | Separate form flows for each document type |
| Bilingual UI | Toggle between Bahasa Malaysia and English |
| User Account | Register/login via Supabase Auth (email or Google) |
| Draft Auto-Save | Progress saved automatically at each step |
| Edit Anytime | Users can return and edit saved drafts before payment |
| Preview | Full document preview before payment |
| One-Time Payment | Pay via Billplz to unlock PDF generation |
| PDF Generation | Final document generated using React PDF |
| Email Delivery | PDF sent to user's registered email via SendGrid |
| Document History | Users can view previously generated documents |

---

## 4. User Flow

### 4.1 General Flow (Both Document Types)

```
Landing Page
    ↓
Register / Login (Supabase Auth)
    ↓
Dashboard → Create New Document
    ↓
Choose Document Type: [Wasiat] or [General Will]
    ↓
Step-by-Step Form (auto-saved as draft)
    ↓
Review & Preview Page
    ↓
Payment (Billplz)
    ↓
PDF Generated → Download + Email Sent
    ↓
Document saved in Dashboard (view-only)
```

### 4.2 Returning User Flow

```
Login
    ↓
Dashboard → My Documents
    ↓
Open Draft → Continue Editing
    OR
View Completed Document → Re-download PDF
```

---

## 5. Form Steps & Fields

> **Legend**
> - ★ = Need to have (required — document is invalid or incomplete without it)
> - ◎ = Good to have (strengthens legal identification but document can proceed without it)

---

### 5.1 Wasiat (Islamic Will) Form

**Step 1 — Maklumat Pewasiat (Testator Information)**

| Field | Status | Reason |
|---|---|---|
| Full name (as per IC) | ★ | Core identity — appears on document |
| IC number | ★ | Legal identification — mandatory for Syariah validity |
| Date of birth | ★ | Required for Syariah documents |
| Marital status | ★ | Affects faraid distribution context |
| Address | ★ | Legal residence — appears on document |
| Phone number | ★ | Contact for executor/legal purposes |
| Email | ★ | For document delivery |
| State | ★ | Determines which Syariah enactment applies |
| Religion confirmation (Muslim) | ★ | Must confirm to proceed — legal gatekeeping |
| Gender | ◎ | Useful context; some Syariah docs include it |

**Step 2 — Harta Alih (Movable Assets)**

User selects one of two modes. Mode selection is ★ required:

> **Option A — Senarai Terperinci (Lampiran A)**
> Each asset row: **Type** ★ | **Details** ★ | **Amount (RM)** ◎
> - Type = asset category label (e.g. "Akaun Bank", "KWSP", "Kenderaan", "Barang Kemas")
> - Details = free text description (e.g. bank name + account number, vehicle reg)
> - Amount = estimated value in RM — ◎ good to have for estate planning context
> - Multiple rows — add/remove dynamically

> **Option B — Pernyataan Umum (General Statement)**
> No itemised input. Wasiat will contain:
> *"Saya mewasiatkan kesemua harta alih saya yang ada pada tarikh kematian saya … kepada penerima-penerima yang dinyatakan di bawah."*
> - Optional note ◎ — brief description user may add

**Step 3 — Harta Tak Alih (Immovable Assets)**

Same two-option mode as Step 2, selected **independently**:

> **Option A — Senarai Terperinci (Lampiran A)**
> Each asset row: **Type** ★ | **Details** ★ | **Amount (RM)** ◎
> - Type = "Kediaman" / "Komersial" / "Tanah"
> - Details = property address + lot/title number

> **Option B — Pernyataan Umum (General Statement)**
> *"Saya mewasiatkan kesemua harta tak alih saya yang berdaftar atas nama saya …"*
> - Optional note ◎

**Step 4 — Penerima Manfaat Wasiat (Beneficiaries — 1/3 rule)**

> *"Anda hanya boleh mewasiatkan sehingga 1/3 daripada jumlah harta kepada penerima yang bukan waris. 2/3 selebihnya akan diagihkan mengikut Faraid."*

Each beneficiary row:

| Field | Status | Reason |
|---|---|---|
| Full name | ★ | Core identification |
| IC number | ★ | Legal identification — Syariah requirement |
| Relationship | ★ | Required for document context |
| Phone number | ★ | Contact detail |
| Assignment type | ★ | Either percentage or specific asset — must choose one |
| Percentage (%) | ★ if type = percentage | Sum of all percentages must not exceed 100 (= 100% of 1/3 pool) |
| Specific asset description | ★ if type = specific_asset | Names the exact asset bequeathed |

- Multiple beneficiaries — add/remove dynamically
- System validates: total percentage ≤ 100% of the 1/3 pool

**Step 5 — Wasi (Executor)**

*Primary Executor:*

| Field | Status | Reason |
|---|---|---|
| Full name | ★ | Appears on document |
| IC number | ★ | Legal identification |
| Relationship to testator | ★ | Document context |
| Phone number | ★ | Contact for estate administration |
| Address | ★ | Legal requirement for executor |

*Backup Executor:*

| Field | Status | Reason |
|---|---|---|
| Full name | ★ | Appears on document |
| IC number | ★ | Legal identification |
| Relationship to testator | ★ | Document context |
| Phone number | ◎ | Useful but not strictly required for backup |

> Note: Wasi must be Muslim — legal disclaimer displayed, not a form field.

**Step 6 — Saksi (Witnesses)**

Both Witness 1 and Witness 2:

| Field | Status | Reason |
|---|---|---|
| Full name | ★ | Appears on document |
| IC number | ★ | Legal identification |
| Address | ★ | Syariah validity requirement |

> *"Saksi tidak boleh merupakan penerima manfaat dalam wasiat ini."*
> Note: Witnesses must be Muslim — legal disclaimer, not a form field.

**Step 7 — Perisytiharan (Declaration)**

| Field | Status | Reason |
|---|---|---|
| Date of declaration | ★ | Document date — legal requirement |
| Typed full name (as signature) | ★ | Declaration confirmation |
| Acknowledgement checkbox | ★ | Must be checked to proceed |

---

### 5.2 General Will Form

**Step 1 — Testator Information**

| Field | Status | Reason |
|---|---|---|
| Full name (as per IC/passport) | ★ | Core identity |
| IC / Passport number | ★ | Legal identification |
| Date of birth | ★ | Wills Act requires testator to be ≥ 18 |
| Marital status | ★ | Legal document context |
| Nationality | ★ | Wills Act context |
| Religion | ★ | Non-Muslim confirmation |
| Address | ★ | Legal residence |
| Phone number | ★ | Contact |
| Email | ★ | Document delivery |
| Gender | ◎ | Useful context; not strictly required by Wills Act |

**Step 2 — Executor**

> Appointed early in the Will — standard practice under Wills Act 1959. The executor is named first so all subsequent asset and beneficiary clauses reference who will carry them out.

*Primary Executor:*

| Field | Status | Reason |
|---|---|---|
| Full name | ★ | Appears on document |
| IC number | ★ | Legal identification |
| Relationship | ★ | Document context |
| Phone number | ★ | Contact for estate administration |
| Address | ★ | Legal requirement for executor |

*Backup Executor:*

| Field | Status | Reason |
|---|---|---|
| Full name | ★ | Appears on document |
| IC number | ★ | Legal identification |
| Relationship | ★ | Document context |
| Phone number | ◎ | Useful but not strictly required for backup |

**Step 3 — Assets**

Assets are grouped by category. Each category uses the same row structure:
**Type** ★ | **Details** ★ | **Amount (RM)** ◎

| Category | Type label | Details guidance | Notes |
|---|---|---|---|
| Hartanah / Property | "Kediaman" / "Komersial" / "Tanah" | Address + lot/title number | ◎ co-ownership flag |
| Akaun Bank | "Akaun Semasa" / "Akaun Simpanan" | Bank name + account number | — |
| KWSP / EPF | "KWSP" | Account number | ★ disclaimer: nomination is separate |
| Pelaburan / Investment | "Unit Amanah" / "ASB" / "Saham" | Fund/account name + reference | — |
| Insurans / Insurance | "Polisi Insurans" | Insurer + policy number | ◎ nomination status note |
| Perniagaan / Business | "Perniagaan" | Business name + reg number + % ownership | — |
| Aset Digital | "Aset Digital" | Description + access note | ◎ access instructions |
| Kenderaan / Vehicle | "Kenderaan" | Type + registration number | — |
| Lain-lain / Other | "Lain-lain" | Free text | — |

**Step 4 — Beneficiaries**

Each beneficiary row:

| Field | Status | Reason |
|---|---|---|
| Full name | ★ | Core identification |
| IC number | ★ | Legal identification — Wills Act |
| Relationship | ★ | Document context |
| Phone number | ★ | Contact detail |
| Address | ★ | Required by Wills Act for beneficiary identification |
| Assignment type | ★ | Either percentage or specific asset |
| Percentage (%) | ★ if type = percentage | Sum must not exceed 100% |
| Specific asset description | ★ if type = specific_asset | Names the exact asset |

Residual Estate Clause (what happens to unassigned assets):

| Field | Status | Reason |
|---|---|---|
| Beneficiary full name | ★ | Must name who receives residual |
| IC number | ★ | Legal identification |
| Relationship | ◎ | Good for document context |

**Step 5 — Guardianship (Minor Children)**

Toggle: *Do you have minor children?* — if No, this step is marked complete automatically.

*Children (add multiple):*

| Field | Status | Reason |
|---|---|---|
| Full name | ★ | Identification |
| IC / birth cert number | ★ | Legal identification |
| Date of birth | ★ | To confirm minor status |

*Primary Guardian:*

| Field | Status | Reason |
|---|---|---|
| Full name | ★ | Appears on document |
| IC number | ★ | Legal identification |
| Relationship | ★ | Document context |
| Phone number | ★ | Contact |
| Address | ★ | Legal requirement |

*Backup Guardian:*

| Field | Status | Reason |
|---|---|---|
| Full name | ★ | Appears on document |
| IC number | ★ | Legal identification |
| Relationship | ★ | Document context |
| Phone number | ◎ | Useful but not strictly required for backup |

**Step 6 — Witnesses**

Both Witness 1 and Witness 2:

| Field | Status | Reason |
|---|---|---|
| Full name | ★ | Appears on document |
| IC number | ★ | Legal identification |
| Address | ★ | Wills Act validity requirement |

> *"Witnesses must not be beneficiaries or spouses of beneficiaries under this Will."*

**Step 7 — Declaration**

| Field | Status | Reason |
|---|---|---|
| Date of execution | ★ | Document date — legal requirement |
| Typed full name (as signature) | ★ | Declaration confirmation |
| Acknowledgement checkbox | ★ | Must be checked to proceed |

---

## 6. Review & Preview Page

The Review & Preview page is split into two distinct sections:

---

### 6.1 Review Summary

A structured, card-based summary of everything the user has entered — displayed **before** the document preview. Purpose: let the user verify their inputs are correct before seeing the preview.

Layout: one collapsible card per form section, each with an **Edit** button that deep-links back to the relevant step.

**Wasiat — Summary Cards:**

| Card | Fields Shown |
|---|---|
| Maklumat Pewasiat | Name, IC, DOB, marital status, state |
| Harta Alih | Mode selected (Lampiran A / Umum), item count or general statement label |
| Harta Tak Alih | Mode selected (Lampiran A / Umum), item count or general statement label |
| Penerima Manfaat | Beneficiary names, relationship, assigned portion — 1/3 usage indicator (e.g. "2 of 3 beneficiaries, 28% of 1/3 allocated") |
| Wasi | Primary and backup executor names |
| Saksi | Witness 1 and Witness 2 names |
| Perisytiharan | Date, testator typed name |

**General Will — Summary Cards:**

| Card | Fields Shown |
|---|---|
| Testator Info | Name, IC, DOB, marital status, nationality |
| Executor | Primary and backup executor names |
| Assets | Category list, item count per category |
| Beneficiaries | Beneficiary names, relationship, assigned assets or share |
| Guardianship | Guardian name(s) if applicable, children names — or "No minor children" |
| Witnesses | Witness 1 and Witness 2 names |
| Declaration | Date, testator typed name |

- Incomplete sections are flagged with a warning indicator
- A **completion progress bar** is shown at the top (e.g. "6/7 sections complete")
- **Proceed to Preview** button only enabled when all required sections are complete

---

### 6.2 Document Preview (Partial Blur)

A rendered preview of the actual Wasiat or Will document — styled to look like the final output — but with **selective paragraph blurring** to protect full content until payment.

**Blur Strategy:**

| Section | Visibility |
|---|---|
| Document title & header | Fully visible |
| Testator name & IC | Fully visible (user's own data — builds trust) |
| Opening declaration paragraph | Fully visible |
| Asset listing (Lampiran A or general paragraph) | **Blurred** |
| Beneficiary names & distribution details | **Blurred** |
| Executor details | First executor's name visible, details **blurred** |
| Witness section | Section heading visible, details **blurred** |
| Faraid/legal clause paragraphs | **Blurred** |
| Declaration & signature block | Fully visible (date and testator name shown) |

**UI behaviour:**
- Blurred sections use a CSS `blur(6px)` effect with a semi-transparent overlay
- A lock icon and label shown on blurred sections: *"Bayar untuk melihat dokumen penuh"* / *"Pay to unlock full document"*
- Overall document is rendered as a scrollable A4-style page
- A floating **"Proceed to Payment"** sticky button at the bottom of the page

**Purpose:** Give the user enough confidence that a real, properly structured legal document has been generated — without giving away the full content for free.

---

---

## 7. Payment Flow

- Payment provider: **Billplz**
- One-time fee per document (pricing TBD, suggested: **RM 49–RM 79**)
- On successful payment:
  - Document status updated to `completed` in database
  - PDF generated (final version, no watermark)
  - PDF sent to user's email via SendGrid
  - PDF available for download in user dashboard
- On failed/cancelled payment:
  - Draft preserved, user can retry payment

---

## 8. Post-Payment

- **Email** (via SendGrid):
  - Subject: *"WasiatHub — Your [Wasiat / Will] is Ready"*
  - Body: Thank you message, important instructions (print, sign, witnesses)
  - Attachment: Generated PDF
- **Dashboard**:
  - Document marked as `Completed`
  - Download button available
  - Re-send email option
- **Important notice** shown to user:
  - For Wasiat: Must be signed in front of 2 Muslim witnesses and registered with the State Islamic Religious Department (JAWI/JAKIM state equivalent) for full legal effect
  - For General Will: Must be signed in front of 2 witnesses (not beneficiaries) to be legally valid under the Wills Act 1959

---

## 9. User Dashboard

| Section | Description |
|---|---|
| My Documents | List of all drafts and completed documents |
| Create New | Start a new Wasiat or Will |
| Profile | Update personal details, change password |
| Billing History | View past payments |
| Language Toggle | Switch between BM and English |

---

## 10. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14+ (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Authentication | Supabase Auth (email + Google OAuth) |
| Database | Supabase (PostgreSQL) |
| File Storage | Supabase Storage (store generated PDFs) |
| PDF Generation | React PDF (`@react-pdf/renderer`) |
| Email Delivery | SendGrid (transactional email + PDF attachment) |
| Payment | Billplz API |
| Hosting | Vercel |
| Language i18n | `next-intl` (BM + English) |

### 10.1 Environment Variables

All secrets are stored in `.env.local` (never committed). See `.env.example` for the full key list.

| Key | Service | Visibility |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | Public (safe to expose) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | Public (safe to expose) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | **Server-only. Never expose to client.** |
| `SENDGRID_API_KEY` | SendGrid | **Server-only. Never expose to client.** |
| `SENDGRID_FROM_EMAIL` | SendGrid | Server-only |
| `BILLPLZ_API_KEY` | Billplz | **Server-only. Never expose to client.** |
| `BILLPLZ_COLLECTION_ID` | Billplz | Server-only |
| `BILLPLZ_X_SIGNATURE` | Billplz | **Server-only. Used to verify webhook callbacks.** |
| `NEXTAUTH_SECRET` | Next.js Auth | **Server-only. Min 32 characters.** |
| `NEXT_PUBLIC_APP_URL` | App | Public |

> **Rules:**
> - Keys prefixed `NEXT_PUBLIC_` are exposed to the browser — never put secrets there
> - All other keys are server-side only — only accessible in API routes and server components
> - **Never paste any real key value into this document, a chat, a GitHub issue, or a PR**
> - If a key is accidentally exposed, rotate it immediately on the respective service dashboard

---

## 11. Database Schema (High Level)

### `users`
- id, email, full_name, ic_number, phone, language_preference, created_at

### `documents`
- id, user_id, type (`wasiat` | `general_will`), status (`draft` | `completed`), language, created_at, updated_at, paid_at

### `wasiat_data`
- id, document_id, testator_info (JSON), movable_assets (JSON), immovable_assets (JSON), beneficiaries (JSON), executor (JSON), backup_executor (JSON), witnesses (JSON), declaration (JSON)

### `will_data`
- id, document_id, testator_info (JSON), assets (JSON), beneficiaries (JSON), guardianship (JSON), executor (JSON), backup_executor (JSON), witnesses (JSON), declaration (JSON)

### `payments`
- id, document_id, user_id, billplz_bill_id, amount, currency, status, paid_at

---

## 12. Pages & Routes

```
/                          → Landing page
/register                  → Sign up
/login                     → Login
/dashboard                 → User dashboard (protected)
/dashboard/documents       → My documents list
/dashboard/create          → Choose document type
/wasiat/[id]/step/[n]      → Wasiat form steps 1–7
/will/[id]/step/[n]        → General Will form steps 1–7
/wasiat/[id]/review        → Review & preview (Wasiat)
/will/[id]/review          → Review & preview (Will)
/payment/[id]              → Payment page (Billplz redirect)
/payment/success           → Payment success + download
/payment/failed            → Payment failed, retry
/profile                   → User profile settings
```

---

## 13. Bilingual Support

- All UI labels, form fields, error messages, document content, and email templates in both **Bahasa Malaysia** and **English**
- User sets preferred language at registration (can change in profile)
- Generated PDF language matches user's selected language
- Use `next-intl` for i18n routing and translation files

---

## 14. Pricing (Suggested)

| Plan | Price | Includes |
|---|---|---|
| Wasiat | RM 49 | 1 Wasiat document, PDF, email delivery |
| General Will | RM 49 | 1 General Will document, PDF, email delivery |
| Bundle | RM 79 | Both Wasiat + General Will (for married couples or family) |

---

## 15. Important Legal Disclaimers (to display in app)

- WasiatHub provides a **document generation service** and does not constitute legal advice
- Users are advised to consult a **lawyer or Syariah officer** to ensure the document meets their specific needs
- For Wasiat to be fully effective, it must be **registered with the relevant State Islamic Religious Authority**
- For General Will to be legally valid, it must be **signed and witnessed** according to the Wills Act 1959
- WasiatHub is not liable for any legal disputes arising from the use of generated documents

---

## 16. Future Enhancements (Post-MVP)

- Faraid calculator integrated into Wasiat flow
- Malay notary / lawyer directory referral
- Joint will for couples
- Reminder emails (annual review nudge)
- Hibah (gift inter vivos) document type
- Admin dashboard for document management
- WhatsApp notifications via official API

---

*Document version: 1.0 | Date: April 2026 | WasiatHub*
