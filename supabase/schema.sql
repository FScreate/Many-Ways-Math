-- Many Ways Math: run this once in the Supabase SQL editor.
-- Each row is one child's profile and progress. A parent can only see and change their own children.

create table if not exists public.kids (
  id          text primary key,                       -- the child's id from the app
  parent_id   uuid not null references auth.users(id) on delete cascade,
  data        jsonb not null,                         -- the child's progress, badges, tests and settings
  updated_at  timestamptz not null default now()
);

create index if not exists kids_parent_idx on public.kids (parent_id);

alter table public.kids enable row level security;

create policy "parents read own kids"
  on public.kids for select
  using (auth.uid() = parent_id);

create policy "parents add own kids"
  on public.kids for insert
  with check (auth.uid() = parent_id);

create policy "parents update own kids"
  on public.kids for update
  using (auth.uid() = parent_id)
  with check (auth.uid() = parent_id);

create policy "parents delete own kids"
  on public.kids for delete
  using (auth.uid() = parent_id);
