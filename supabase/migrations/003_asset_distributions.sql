-- Migration: add asset_distributions column to will_data
-- Required for itemised-mode per-asset beneficiary assignment

alter table public.will_data
  add column if not exists asset_distributions jsonb;

comment on column public.will_data.asset_distributions
  is 'Step 3 (itemised mode): per-asset beneficiary distributions — array of { asset_key, asset_label, beneficiaries[] }';
