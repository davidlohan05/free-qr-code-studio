create extension if not exists pgcrypto;

create table if not exists public.qr_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Untitled QR',
  target_url text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.scan_events (
  id bigint generated always as identity primary key,
  qr_id uuid not null references public.qr_codes(id) on delete cascade,
  scanned_at timestamptz not null default now(),
  user_agent text,
  referrer text,
  ip_hash text
);

create index if not exists qr_codes_user_idx on public.qr_codes(user_id);
create index if not exists scan_events_qr_idx on public.scan_events(qr_id, scanned_at desc);

alter table public.qr_codes enable row level security;
alter table public.scan_events enable row level security;

create policy "Users read own QR codes" on public.qr_codes for select using (auth.uid() = user_id);
create policy "Users create own QR codes" on public.qr_codes for insert with check (auth.uid() = user_id);
create policy "Users update own QR codes" on public.qr_codes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users delete own QR codes" on public.qr_codes for delete using (auth.uid() = user_id);

-- Scan events are written/read by trusted server functions only.
revoke all on public.scan_events from anon, authenticated;
