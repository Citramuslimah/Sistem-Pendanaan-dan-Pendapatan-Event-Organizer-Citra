create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete set null,
  name text not null,
  event_date date not null,
  location text not null default '',
  status text not null default 'planning'
    check (status in ('planning', 'active', 'completed', 'cancelled')),
  budget numeric(14, 2) not null default 0 check (budget >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.fundings (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  funder text not null,
  amount numeric(14, 2) not null check (amount > 0),
  funded_on date not null default current_date,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.incomes (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  source text not null,
  amount numeric(14, 2) not null check (amount > 0),
  received_on date not null default current_date,
  description text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists events_category_id_idx on public.events (category_id);
create index if not exists fundings_event_id_idx on public.fundings (event_id);
create index if not exists incomes_event_id_idx on public.incomes (event_id);

alter table public.categories enable row level security;
alter table public.events enable row level security;
alter table public.fundings enable row level security;
alter table public.incomes enable row level security;

grant all on public.categories, public.events, public.fundings, public.incomes to service_role;

grant select, insert, update, delete on public.categories, public.events, public.fundings, public.incomes to authenticated;

drop policy if exists "authenticated users manage categories" on public.categories;
create policy "authenticated users manage categories"
  on public.categories for all to authenticated
  using (true) with check (true);

drop policy if exists "authenticated users manage events" on public.events;
create policy "authenticated users manage events"
  on public.events for all to authenticated
  using (true) with check (true);

drop policy if exists "authenticated users manage fundings" on public.fundings;
create policy "authenticated users manage fundings"
  on public.fundings for all to authenticated
  using (true) with check (true);

drop policy if exists "authenticated users manage incomes" on public.incomes;
create policy "authenticated users manage incomes"
  on public.incomes for all to authenticated
  using (true) with check (true);
