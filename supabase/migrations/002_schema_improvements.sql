-- ============================================================
-- WasiatHub — Migration 002: Schema Improvements
-- Run this in Supabase SQL Editor AFTER 001_initial_schema.sql
-- ============================================================

-- ─── Expand users table with personal fields for pre-fill ────────────────────
-- These fields are reusable across multiple documents.
-- testator_info in wasiat_data/will_data remains a self-contained snapshot for PDF.

alter table public.users
  add column if not exists dob            date,
  add column if not exists gender         gender_type,
  add column if not exists marital_status marital_status,
  add column if not exists address        text;

comment on column public.users.dob            is 'Date of birth — pre-fills Step 1 of Wasiat and Will forms';
comment on column public.users.gender         is 'Gender — pre-fills Step 1';
comment on column public.users.marital_status is 'Marital status — pre-fills Step 1';
comment on column public.users.address        is 'Home address — pre-fills Step 1';

-- ─── Update users RLS to allow update of new columns ─────────────────────────
-- Existing "Users can update their own profile" policy already covers all columns.
-- No policy changes needed.

-- ─── Update documents_with_status view ───────────────────────────────────────
-- No structural changes needed to the view.

-- ─── Notes on JSONB structure changes (no SQL needed) ────────────────────────
-- wasiat_data and will_data store JSONB. The content structure is defined in
-- TypeScript types (types/database.ts). The following breaking changes apply
-- to all new documents written after this migration:
--
-- ALL JSONB content now uses snake_case (was camelCase):
--   fullName        → full_name
--   icNumber        → ic_number
--   dob             → dob (unchanged)
--   maritalStatus   → marital_status
--   assetAssignment → assignment_type + specific_asset_description
--   portionPercentage → portion_percentage
--   bankName        → bank_name
--   accountNumber   → account_number
--   estimatedValue  → estimated_value
--   lotTitleNumber  → lot_title_number
--   regNumber       → reg_number
--   sumCovered      → sum_covered
--   signatureName   → signature_name
--   etc.
--
-- WasiatBeneficiary:
--   assignment_type: 'specific_asset' | 'percentage'
--   specific_asset_description (if specific_asset)
--   portion_percentage (if percentage — must total ≤ 100% across all beneficiaries)
--   is_muslim field REMOVED from beneficiary (not required by Syariah)
--
-- Executor (both Wasiat and Will):
--   + email (required)
--   + is_muslim (Wasiat executor only — required)
--   address is now required (was optional)
--
-- Witnesses (Wasiat):
--   + is_muslim (required — both witnesses must be Muslim for Wasiat)
--   stored as { witness_1: {...}, witness_2: {...} } (was witness1/witness2)
--
-- residual_estate_beneficiary (will_data):
--   Changed from plain text to JSONB object { full_name, ic_number, relationship }

-- ─── Update residual_estate_beneficiary column type ──────────────────────────
-- Change from text to jsonb to store structured PersonBase object

alter table public.will_data
  alter column residual_estate_beneficiary type jsonb
  using case
    when residual_estate_beneficiary is null then null
    else jsonb_build_object('full_name', residual_estate_beneficiary)
  end;

comment on column public.will_data.residual_estate_beneficiary
  is 'Step 3: structured { full_name, ic_number, relationship } for residual estate recipient';
