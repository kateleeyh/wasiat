# WasiatHub — Supabase Setup Guide

## How to apply the schema

Run migrations **in order**:

### Migration 001 — Initial schema
1. Go to Supabase Dashboard → **SQL Editor** → New query
2. Paste `migrations/001_initial_schema.sql` → **Run**

Creates all tables, enums, RLS policies, triggers, indexes, storage bucket, and the `documents_with_status` view.

### Migration 002 — Schema improvements
1. New query → paste `migrations/002_schema_improvements.sql` → **Run**

Adds `dob`, `gender`, `marital_status`, `address` to `users` table.
Changes `will_data.residual_estate_beneficiary` from `text` to `jsonb`.
All JSONB content now uses `snake_case` (TypeScript types updated to match).

---

## Tables created

| Table | Purpose |
|---|---|
| `users` | User profile — extends `auth.users`, auto-created on sign-up |
| `documents` | One row per Wasiat or General Will document |
| `wasiat_data` | All 7 form steps for a Wasiat, stored as JSONB columns |
| `will_data` | All 7 form steps for a General Will, stored as JSONB columns |
| `payments` | Billplz payment records |

## View created

| View | Purpose |
|---|---|
| `documents_with_status` | Documents joined with payment status — used by dashboard |

## Storage bucket created

| Bucket | Public | Purpose |
|---|---|---|
| `documents` | No (private) | Stores generated PDF files per user |

---

## Auth setup (manual steps in Supabase dashboard)

1. Go to **Authentication → Providers**
2. Enable **Email** provider — confirm email required: yes
3. Enable **Google** provider — paste in your Google OAuth Client ID and Secret
4. Go to **Authentication → URL Configuration**
   - Site URL: `http://localhost:3000` (dev) / `https://wasiathub.com` (prod)
   - Redirect URLs: add `http://localhost:3000/auth/callback`

---

## Environment variables needed

See `.env.example` for the full list. The values you need from Supabase:

- `NEXT_PUBLIC_SUPABASE_URL` — Project Settings → API → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Project Settings → API → anon public key
- `SUPABASE_SERVICE_ROLE_KEY` — Project Settings → API → service_role secret key (never expose to browser)
