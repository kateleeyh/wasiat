-- ============================================================
-- WasiatHub — Dev Seed Data
-- Only run this in LOCAL / DEVELOPMENT environment.
-- DO NOT run in production.
-- ============================================================

-- This seed creates a test user profile (auth user must be created
-- separately via Supabase Auth dashboard or sign-up flow first).
-- Replace the UUID below with a real auth.users id after signing up.

-- Example draft Wasiat document (uncomment and replace user_id after signup):

/*
insert into public.documents (id, user_id, type, status, language)
values (
  'aaaaaaaa-0000-0000-0000-000000000001',
  '<your-auth-user-id-here>',
  'wasiat',
  'draft',
  'ms'
);

insert into public.wasiat_data (document_id, testator_info)
values (
  'aaaaaaaa-0000-0000-0000-000000000001',
  '{
    "fullName": "Ahmad bin Abdullah",
    "icNumber": "800101-01-1234",
    "dob": "1980-01-01",
    "gender": "male",
    "maritalStatus": "married",
    "address": "No. 10, Jalan Bahagia, 50000 Kuala Lumpur",
    "phone": "0123456789",
    "email": "ahmad@example.com",
    "state": "Wilayah Persekutuan Kuala Lumpur"
  }'
);
*/
