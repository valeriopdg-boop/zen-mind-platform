-- Profiles + Terapeuti + Test + Sessioni (con Daily)
create table if not exists profiles (
  id uuid references auth.users primary key,
  role text check (role in ('patient', 'therapist')) not null,
  full_name text,
  avatar_url text,
  created_at timestamp default now()
);

create table if not exists therapists (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles unique,
  verified_order boolean default true,
  years_exp int default 8,
  orientations text[],
  style_scores jsonb,
  specialties text[],
  hourly_rate int default 49
);

create table if not exists patient_tests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles not null,
  answers jsonb not null,
  completed_at timestamp default now(),
  match_results jsonb[]
);

create table if not exists sessions (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid references profiles not null,
  therapist_id uuid references profiles not null,
  status text default 'scheduled',
  scheduled_at timestamp not null,
  daily_room_name text,
  daily_room_url text,
  platform_fee int default 10
);

alter table patient_tests enable row level security;
alter table sessions enable row level security;
