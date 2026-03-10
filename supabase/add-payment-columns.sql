-- Esegui in Supabase → SQL Editor
alter table sessions
add column if not exists therapist_price integer not null default 55,
add column if not exists platform_fee integer default 1000,
add column if not exists amount_paid integer,
add column if not exists payment_status text default 'pending'
  check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
add column if not exists payment_intent_id text,
add column if not exists paid_at timestamp;
