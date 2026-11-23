-- =====================================================================
--  Marma Translator – LEARNING (lessons) tables
--  HOW TO USE: Supabase → SQL Editor → New query → paste ALL → Run.
--  Run AFTER 1-setup-database.sql. Safe to run again.
--
--  Lessons are made ONLY from approved words (table "entries").
--  If you create no units here, the app builds lessons by itself
--  from the topics (categories). A Marma teacher can arrange better
--  lessons on the Checker page → "Lessons".
-- =====================================================================

-- UNITS: a group of lessons, e.g. "Greetings", "My family"
create table if not exists public.units (
  id           uuid primary key default gen_random_uuid(),
  title_bn     text not null,
  title_en     text not null,
  icon         text not null default '⭐',        -- an emoji shown on the path
  color        text not null default 'green',     -- green, blue, orange, purple, pink, teal
  sort         int  not null default 0,
  is_published boolean not null default true,     -- hidden from learners when false
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- LESSONS: one small lesson (about 5 words) inside a unit
create table if not exists public.lessons (
  id           uuid primary key default gen_random_uuid(),
  unit_id      uuid not null references public.units(id) on delete cascade,
  title_bn     text not null,
  title_en     text not null,
  sort         int  not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- LESSON ITEMS: which approved words/sentences are taught in a lesson
create table if not exists public.lesson_items (
  id        uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  entry_id  uuid not null references public.entries(id) on delete cascade,
  sort      int  not null default 0,
  unique (lesson_id, entry_id)
);
create index if not exists lesson_items_lesson_idx on public.lesson_items (lesson_id, sort);

drop trigger if exists units_touch on public.units;
create trigger units_touch before update on public.units for each row execute function public.touch_updated_at();
drop trigger if exists lessons_touch on public.lessons;
create trigger lessons_touch before update on public.lessons for each row execute function public.touch_updated_at();

-- ---------------- Security rules ----------------
alter table public.units        enable row level security;
alter table public.lessons      enable row level security;
alter table public.lesson_items enable row level security;

grant select on public.units, public.lessons, public.lesson_items to anon, authenticated;
grant select, insert, update, delete on public.units, public.lessons, public.lesson_items to authenticated;

-- Learners see published units/lessons; checkers see everything
drop policy if exists "read units" on public.units;
create policy "read units" on public.units for select using (is_published or public.is_reviewer());
drop policy if exists "read lessons" on public.lessons;
create policy "read lessons" on public.lessons for select using (is_published or public.is_reviewer());
drop policy if exists "read lesson items" on public.lesson_items;
create policy "read lesson items" on public.lesson_items for select using (true);

-- Only checkers create or change lessons
drop policy if exists "checkers write units" on public.units;
create policy "checkers write units" on public.units for all to authenticated using (public.is_reviewer()) with check (public.is_reviewer());
drop policy if exists "checkers write lessons" on public.lessons;
create policy "checkers write lessons" on public.lessons for all to authenticated using (public.is_reviewer()) with check (public.is_reviewer());
drop policy if exists "checkers write lesson items" on public.lesson_items;
create policy "checkers write lesson items" on public.lesson_items for all to authenticated using (public.is_reviewer()) with check (public.is_reviewer());
