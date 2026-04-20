-- ============================================================
-- WasiatHub — Initial Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────────────────────

create extension if not exists "uuid-ossp";


-- ─── Enum Types ───────────────────────────────────────────────────────────────

create type document_type   as enum ('wasiat', 'general_will');
create type document_status as enum ('draft', 'completed');
create type payment_status  as enum ('pending', 'paid', 'failed');
create type locale_type     as enum ('ms', 'en');
create type gender_type     as enum ('male', 'female');
create type marital_status  as enum ('single', 'married', 'widowed', 'divorced');


-- ─── users ───────────────────────────────────────────────────────────────────
-- Extends Supabase auth.users. Created automatically on sign-up via trigger.

create table public.users (
  id                  uuid        primary key references auth.users(id) on delete cascade,
  email               text        not null,
  full_name           text,
  ic_number           text,
  phone               text,
  language_preference locale_type not null default 'ms',
  created_at          timestamptz not null default now()
);

comment on table public.users is 'Public user profile, extends auth.users';

-- Auto-create profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ─── documents ───────────────────────────────────────────────────────────────

create table public.documents (
  id          uuid            primary key default uuid_generate_v4(),
  user_id     uuid            not null references public.users(id) on delete cascade,
  type        document_type   not null,
  status      document_status not null default 'draft',
  language    locale_type     not null default 'ms',
  pdf_url     text,
  paid_at     timestamptz,
  created_at  timestamptz     not null default now(),
  updated_at  timestamptz     not null default now()
);

comment on table public.documents is 'One row per Wasiat or General Will document';

-- Auto-update updated_at on any row change
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger documents_updated_at
  before update on public.documents
  for each row execute procedure public.set_updated_at();

create index idx_documents_user_id on public.documents(user_id);
create index idx_documents_status  on public.documents(status);


-- ─── wasiat_data ─────────────────────────────────────────────────────────────
-- Stores all form data for a Wasiat document as a single JSONB blob per step.
-- Split into columns by section for easier partial updates.

create table public.wasiat_data (
  id                uuid primary key default uuid_generate_v4(),
  document_id       uuid not null unique references public.documents(id) on delete cascade,

  -- Step 1
  testator_info     jsonb,
  -- Step 2 & 3
  movable_assets    jsonb,
  immovable_assets  jsonb,
  -- Step 4
  beneficiaries     jsonb,
  -- Step 5
  executor          jsonb,
  backup_executor   jsonb,
  -- Step 6
  witnesses         jsonb,
  -- Step 7
  declaration       jsonb,

  updated_at        timestamptz not null default now()
);

comment on table public.wasiat_data    is 'Form data for Wasiat documents, one row per document';
comment on column public.wasiat_data.testator_info    is 'Step 1: pewasiat personal details';
comment on column public.wasiat_data.movable_assets   is 'Step 2: harta alih — mode + itemised list or general statement';
comment on column public.wasiat_data.immovable_assets is 'Step 3: harta tak alih — mode + itemised list or general statement';
comment on column public.wasiat_data.beneficiaries    is 'Step 4: penerima manfaat — max 1/3 of estate';
comment on column public.wasiat_data.executor         is 'Step 5: primary wasi details';
comment on column public.wasiat_data.backup_executor  is 'Step 5: backup wasi details';
comment on column public.wasiat_data.witnesses        is 'Step 6: saksi 1 and saksi 2';
comment on column public.wasiat_data.declaration      is 'Step 7: date, typed name, acknowledged flag';

create trigger wasiat_data_updated_at
  before update on public.wasiat_data
  for each row execute procedure public.set_updated_at();


-- ─── will_data ───────────────────────────────────────────────────────────────
-- Stores all form data for a General Will document.

create table public.will_data (
  id                          uuid primary key default uuid_generate_v4(),
  document_id                 uuid not null unique references public.documents(id) on delete cascade,

  -- Step 1
  testator_info               jsonb,
  -- Step 2
  assets                      jsonb,
  -- Step 3
  beneficiaries               jsonb,
  residual_estate_beneficiary text,
  -- Step 4
  guardianship                jsonb,
  -- Step 5
  executor                    jsonb,
  backup_executor             jsonb,
  -- Step 6
  witnesses                   jsonb,
  -- Step 7
  declaration                 jsonb,

  updated_at                  timestamptz not null default now()
);

comment on table public.will_data                              is 'Form data for General Will documents, one row per document';
comment on column public.will_data.testator_info               is 'Step 1: testator personal details';
comment on column public.will_data.assets                      is 'Step 2: all asset categories (property, bank, EPF, etc.)';
comment on column public.will_data.beneficiaries               is 'Step 3: beneficiary list with asset assignments';
comment on column public.will_data.residual_estate_beneficiary is 'Step 3: who receives unassigned residual estate';
comment on column public.will_data.guardianship                is 'Step 4: minor children + guardian details (null if none)';
comment on column public.will_data.executor                    is 'Step 5: primary executor details';
comment on column public.will_data.backup_executor             is 'Step 5: backup executor details';
comment on column public.will_data.witnesses                   is 'Step 6: witness 1 and witness 2';
comment on column public.will_data.declaration                 is 'Step 7: date, typed name, acknowledged flag';

create trigger will_data_updated_at
  before update on public.will_data
  for each row execute procedure public.set_updated_at();


-- ─── payments ────────────────────────────────────────────────────────────────

create table public.payments (
  id               uuid           primary key default uuid_generate_v4(),
  document_id      uuid           not null references public.documents(id) on delete cascade,
  user_id          uuid           not null references public.users(id) on delete cascade,
  billplz_bill_id  text           unique,
  amount           numeric(10, 2) not null,
  currency         char(3)        not null default 'MYR',
  status           payment_status not null default 'pending',
  paid_at          timestamptz,
  created_at       timestamptz    not null default now()
);

comment on table public.payments is 'Billplz payment records, one row per payment attempt';
comment on column public.payments.billplz_bill_id is 'Bill ID returned by Billplz API on bill creation';

create index idx_payments_document_id    on public.payments(document_id);
create index idx_payments_user_id        on public.payments(user_id);
create index idx_payments_billplz_bill_id on public.payments(billplz_bill_id);

-- When payment is confirmed paid, update document status and paid_at
create or replace function public.handle_payment_confirmed()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status = 'paid' and old.status != 'paid' then
    update public.documents
    set status  = 'completed',
        paid_at = new.paid_at
    where id = new.document_id;
  end if;
  return new;
end;
$$;

create trigger on_payment_confirmed
  after update on public.payments
  for each row execute procedure public.handle_payment_confirmed();


-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

alter table public.users       enable row level security;
alter table public.documents   enable row level security;
alter table public.wasiat_data enable row level security;
alter table public.will_data   enable row level security;
alter table public.payments    enable row level security;


-- ─── users policies ──────────────────────────────────────────────────────────

create policy "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);


-- ─── documents policies ──────────────────────────────────────────────────────

create policy "Users can view their own documents"
  on public.documents for select
  using (auth.uid() = user_id);

create policy "Users can create their own documents"
  on public.documents for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own documents"
  on public.documents for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own draft documents"
  on public.documents for delete
  using (auth.uid() = user_id and status = 'draft');


-- ─── wasiat_data policies ────────────────────────────────────────────────────

create policy "Users can view their own wasiat data"
  on public.wasiat_data for select
  using (
    exists (
      select 1 from public.documents d
      where d.id = wasiat_data.document_id
        and d.user_id = auth.uid()
    )
  );

create policy "Users can insert their own wasiat data"
  on public.wasiat_data for insert
  with check (
    exists (
      select 1 from public.documents d
      where d.id = wasiat_data.document_id
        and d.user_id = auth.uid()
    )
  );

create policy "Users can update their own wasiat data"
  on public.wasiat_data for update
  using (
    exists (
      select 1 from public.documents d
      where d.id = wasiat_data.document_id
        and d.user_id = auth.uid()
    )
  );


-- ─── will_data policies ──────────────────────────────────────────────────────

create policy "Users can view their own will data"
  on public.will_data for select
  using (
    exists (
      select 1 from public.documents d
      where d.id = will_data.document_id
        and d.user_id = auth.uid()
    )
  );

create policy "Users can insert their own will data"
  on public.will_data for insert
  with check (
    exists (
      select 1 from public.documents d
      where d.id = will_data.document_id
        and d.user_id = auth.uid()
    )
  );

create policy "Users can update their own will data"
  on public.will_data for update
  using (
    exists (
      select 1 from public.documents d
      where d.id = will_data.document_id
        and d.user_id = auth.uid()
    )
  );


-- ─── payments policies ───────────────────────────────────────────────────────

create policy "Users can view their own payments"
  on public.payments for select
  using (auth.uid() = user_id);

-- Inserts and updates only via service role (API routes) — no direct client access
-- (no insert/update policy = blocked for anon and authenticated roles)


-- ============================================================
-- Storage Bucket for PDFs
-- ============================================================

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false);

-- Only the owner can read their own PDFs
create policy "Users can read their own PDFs"
  on storage.objects for select
  using (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Only service role can upload PDFs (via API route after payment confirmed)
-- No insert policy for authenticated role intentionally


-- ============================================================
-- Helper Views
-- ============================================================

-- Convenient joined view: document + its data row + payment status
create or replace view public.documents_with_status as
select
  d.id,
  d.user_id,
  d.type,
  d.status,
  d.language,
  d.pdf_url,
  d.paid_at,
  d.created_at,
  d.updated_at,
  p.status        as payment_status,
  p.amount        as payment_amount,
  p.billplz_bill_id
from public.documents d
left join public.payments p
  on p.document_id = d.id
  and p.status = 'paid';

comment on view public.documents_with_status is 'Documents joined with their confirmed payment, for dashboard display';
