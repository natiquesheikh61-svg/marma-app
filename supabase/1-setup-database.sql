-- =====================================================================
--  Marma Translator – database setup for Supabase
--  HOW TO USE: Supabase → SQL Editor → New query → paste ALL of this → Run.
--  It is SAFE TO RUN AGAIN: anything already created is kept, nothing is deleted.
--
--  RULE: No Marma words are put in here by the computer. Every Marma
--  word comes from a Marma speaker and is approved by a checker.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. CATEGORIES  (topics like Greetings, Health, Market…)
-- ---------------------------------------------------------------------
create table if not exists public.categories (
  id       text primary key,                 -- short code, e.g. 'health'
  name_bn  text not null,                    -- Bangla name shown in the app
  name_en  text not null,                    -- English name shown in the app
  sort     int  not null default 0           -- order in the app
);


-- ---------------------------------------------------------------------
-- 2. REVIEWERS  (trusted people who check words. Private.)
--    You add people here yourself (see the guide). Nobody can add
--    themselves from the app.
-- ---------------------------------------------------------------------
create table if not exists public.reviewers (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,                -- shown as "checked by"
  is_admin     boolean not null default false,
  created_at   timestamptz not null default now()
);

-- Small helper: "is the person using the app right now a reviewer?"
create or replace function public.is_reviewer() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.reviewers where user_id = auth.uid());
$$;


-- ---------------------------------------------------------------------
-- 3. ENTRIES  (the APPROVED Marma words & sentences everyone sees)
-- ---------------------------------------------------------------------
create table if not exists public.entries (
  id              uuid primary key default gen_random_uuid(),
  kind            text not null default 'word' check (kind in
                    ('word','phrase','sentence','question','proverb','idiom',
                     'number','name','song_line','other')),
  marma           text not null,             -- in Marma script
  marma_bn_script text,                      -- the same Marma, written in Bangla letters
  pronunciation   text,                      -- how it sounds, in English letters
  bn              text,                      -- Bangla meaning
  en              text,                      -- English meaning
  part_of_speech  text check (part_of_speech in ('noun','verb','adjective','adverb','pronoun','number','other')),
  category_id     text references public.categories(id),
  example_marma   text,                      -- example sentence using this word
  example_bn      text,
  example_en      text,
  notes           text,
  dialect         text,                      -- area / way of speaking, e.g. 'Bandarban'
  audio_path      text,                      -- main voice file (in storage bucket "media")
  image_path      text,                      -- picture (in storage bucket "media")
  source          text,                      -- where it came from (speaker, notebook page…)
  checked_by      text,                      -- reviewer's name
  is_deleted      boolean not null default false,   -- removed entries stay hidden
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint entries_has_meaning check (coalesce(bn,'') <> '' or coalesce(en,'') <> '')
);
create index if not exists entries_updated_at_idx on public.entries (updated_at);


-- ---------------------------------------------------------------------
-- 4. SUBMISSIONS  (new words sent by anyone, WAITING for a checker. Private.)
-- ---------------------------------------------------------------------
create table if not exists public.submissions (
  id                   uuid primary key default gen_random_uuid(),
  kind                 text not null default 'word' check (kind in
                         ('word','phrase','sentence','question','proverb','idiom',
                          'number','name','song_line','other')),
  marma                text not null,
  marma_bn_script      text,
  pronunciation        text,
  bn                   text,
  en                   text,
  part_of_speech       text,
  category_id          text references public.categories(id),
  example_marma        text,
  example_bn           text,
  example_en           text,
  notes                text,
  dialect              text,
  audio_path           text,                 -- in private bucket "submissions"
  image_path           text,                 -- in private bucket "submissions"
  contributor_name     text,                 -- PRIVATE: only reviewers can see
  speaker_label        text,                 -- nickname for the voice, e.g. 'Speaker 3'
  speaker_gender       text check (speaker_gender in ('female','male','other')),
  age_group            text check (age_group in ('child','young','adult','elder')),
  consent_for_training boolean not null default false, -- may this voice teach the computer?
  device_id            text,                 -- random code of the phone (to stop spam)
  status               text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewer_note        text,
  reviewed_by          uuid references auth.users(id),
  reviewed_at          timestamptz,
  entry_id             uuid references public.entries(id),
  created_at           timestamptz not null default now(),
  constraint submissions_has_meaning check (coalesce(bn,'') <> '' or coalesce(en,'') <> '')
);
create index if not exists submissions_status_idx on public.submissions (status, created_at);


-- ---------------------------------------------------------------------
-- 5. RECORDINGS  (every approved voice clip, many speakers per word.
--    This is the collection that can later train a Marma computer voice.)
-- ---------------------------------------------------------------------
create table if not exists public.recordings (
  id                   uuid primary key default gen_random_uuid(),
  entry_id             uuid not null references public.entries(id) on delete cascade,
  audio_path           text not null,        -- in bucket "media"
  speaker_label        text,
  speaker_gender       text,
  age_group            text,
  dialect              text,
  consent_for_training boolean not null default false,
  created_at           timestamptz not null default now()
);


-- ---------------------------------------------------------------------
-- 6. PROMPTS  (Bangla/English sentences we WANT in Marma – the phrasebook list)
-- ---------------------------------------------------------------------
create table if not exists public.prompts (
  id          uuid primary key default gen_random_uuid(),
  bn          text,
  en          text,
  category_id text references public.categories(id),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);


-- ---------------------------------------------------------------------
-- 7. REPORTS  ("this word is wrong" messages from users. Private.)
-- ---------------------------------------------------------------------
create table if not exists public.reports (
  id         uuid primary key default gen_random_uuid(),
  entry_id   uuid not null references public.entries(id) on delete cascade,
  message    text not null check (length(message) between 1 and 1000),
  device_id  text,
  status     text not null default 'open' check (status in ('open','closed')),
  created_at timestamptz not null default now()
);


-- ---------------------------------------------------------------------
-- Keep "updated_at" correct automatically (phones use it to download only what changed)
-- ---------------------------------------------------------------------
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at := now(); return new; end $$;
drop trigger if exists entries_touch on public.entries;
create trigger entries_touch before update on public.entries for each row execute function public.touch_updated_at();
drop trigger if exists prompts_touch on public.prompts;
create trigger prompts_touch before update on public.prompts for each row execute function public.touch_updated_at();


-- =====================================================================
--  SECURITY RULES  (Row Level Security: who may read / write what)
-- =====================================================================
alter table public.categories  enable row level security;
alter table public.reviewers   enable row level security;
alter table public.entries     enable row level security;
alter table public.submissions enable row level security;
alter table public.recordings  enable row level security;
alter table public.prompts     enable row level security;
alter table public.reports     enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.categories, public.entries, public.prompts to anon, authenticated;
grant insert on public.submissions, public.reports to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;

-- Everyone may READ approved words, categories and the phrase list
drop policy if exists "public reads categories" on public.categories;
create policy "public reads categories" on public.categories for select using (true);
drop policy if exists "public reads entries" on public.entries;
create policy "public reads entries"    on public.entries    for select using (true);
drop policy if exists "public reads prompts" on public.prompts;
create policy "public reads prompts"    on public.prompts    for select using (true);

-- Only reviewers may ADD or CHANGE them
drop policy if exists "reviewers write categories" on public.categories;
create policy "reviewers write categories" on public.categories for all to authenticated using (public.is_reviewer()) with check (public.is_reviewer());
drop policy if exists "reviewers insert entries" on public.entries;
create policy "reviewers insert entries"   on public.entries    for insert to authenticated with check (public.is_reviewer());
drop policy if exists "reviewers update entries" on public.entries;
create policy "reviewers update entries"   on public.entries    for update to authenticated using (public.is_reviewer()) with check (public.is_reviewer());
drop policy if exists "reviewers write prompts" on public.prompts;
create policy "reviewers write prompts"    on public.prompts    for all to authenticated using (public.is_reviewer()) with check (public.is_reviewer());

-- Anyone may SEND a new word, but only as "pending". Only reviewers can read them.
drop policy if exists "anyone sends submissions" on public.submissions;
create policy "anyone sends submissions" on public.submissions for insert to anon, authenticated
  with check (status = 'pending' and reviewed_by is null and entry_id is null);
drop policy if exists "reviewers read submissions" on public.submissions;
create policy "reviewers read submissions"   on public.submissions for select to authenticated using (public.is_reviewer());
drop policy if exists "reviewers update submissions" on public.submissions;
create policy "reviewers update submissions" on public.submissions for update to authenticated using (public.is_reviewer()) with check (public.is_reviewer());
drop policy if exists "reviewers delete submissions" on public.submissions;
create policy "reviewers delete submissions" on public.submissions for delete to authenticated using (public.is_reviewer());

-- Recordings: only reviewers (speaker details stay private)
drop policy if exists "reviewers manage recordings" on public.recordings;
create policy "reviewers manage recordings" on public.recordings for all to authenticated using (public.is_reviewer()) with check (public.is_reviewer());

-- Reports: anyone may send, only reviewers read/close
drop policy if exists "anyone sends reports" on public.reports;
create policy "anyone sends reports"     on public.reports for insert to anon, authenticated with check (status = 'open');
drop policy if exists "reviewers read reports" on public.reports;
create policy "reviewers read reports"   on public.reports for select to authenticated using (public.is_reviewer());
drop policy if exists "reviewers update reports" on public.reports;
create policy "reviewers update reports" on public.reports for update to authenticated using (public.is_reviewer()) with check (public.is_reviewer());

-- Reviewers: a logged-in person can see only their own reviewer row
drop policy if exists "see own reviewer row" on public.reviewers;
create policy "see own reviewer row" on public.reviewers for select to authenticated using (user_id = auth.uid());


-- =====================================================================
--  APPROVE: one safe step that copies a submission into the public list
-- =====================================================================
create or replace function public.approve_submission(
  p_id uuid,
  p_audio_path text default null,  -- new path in bucket "media" (the app copies the file first)
  p_image_path text default null,
  p_kind text default null,        -- the reviewer may correct these before approving
  p_marma text default null,
  p_bn text default null,
  p_en text default null,
  p_category text default null
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  s public.submissions;
  new_id uuid;
  rname text;
begin
  if not public.is_reviewer() then raise exception 'Only reviewers can approve'; end if;
  select * into s from public.submissions where id = p_id for update;
  if not found then raise exception 'Submission not found'; end if;
  if s.status <> 'pending' then raise exception 'Already reviewed'; end if;
  select display_name into rname from public.reviewers where user_id = auth.uid();

  insert into public.entries (kind, marma, marma_bn_script, pronunciation, bn, en, part_of_speech,
      category_id, example_marma, example_bn, example_en, notes, dialect,
      audio_path, image_path, source, checked_by)
  values (coalesce(nullif(p_kind,''), s.kind), coalesce(nullif(p_marma,''), s.marma), s.marma_bn_script,
      s.pronunciation, coalesce(p_bn, s.bn), coalesce(p_en, s.en), s.part_of_speech,
      coalesce(nullif(p_category,''), s.category_id), s.example_marma, s.example_bn, s.example_en,
      s.notes, s.dialect, p_audio_path, p_image_path, 'Marma speaker (community)', rname)
  returning id into new_id;

  if p_audio_path is not null then
    insert into public.recordings (entry_id, audio_path, speaker_label, speaker_gender, age_group, dialect, consent_for_training)
    values (new_id, p_audio_path, s.speaker_label, s.speaker_gender, s.age_group, s.dialect, s.consent_for_training);
  end if;

  update public.submissions
     set status = 'approved', reviewed_by = auth.uid(), reviewed_at = now(), entry_id = new_id
   where id = p_id;
  return new_id;
end $$;
revoke execute on function public.approve_submission(uuid,text,text,text,text,text,text,text) from public, anon;
grant  execute on function public.approve_submission(uuid,text,text,text,text,text,text,text) to authenticated;


-- =====================================================================
--  FILE STORAGE (voices and pictures)
--   "submissions" = private, waiting for checking
--   "media"       = public, approved files everyone can play/see
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('submissions', 'submissions', false, 5242880,
     array['audio/webm','audio/ogg','audio/mp4','audio/mpeg','audio/wav','audio/aac','image/jpeg','image/png','image/webp']),
  ('media', 'media', true, 5242880,
     array['audio/webm','audio/ogg','audio/mp4','audio/mpeg','audio/wav','audio/aac','image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

drop policy if exists "anyone uploads to submissions" on storage.objects;
create policy "anyone uploads to submissions" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'submissions');
drop policy if exists "reviewers read submissions files" on storage.objects;
create policy "reviewers read submissions files" on storage.objects for select to authenticated
  using (bucket_id = 'submissions' and public.is_reviewer());
drop policy if exists "reviewers delete submissions files" on storage.objects;
create policy "reviewers delete submissions files" on storage.objects for delete to authenticated
  using (bucket_id = 'submissions' and public.is_reviewer());
drop policy if exists "reviewers add media" on storage.objects;
create policy "reviewers add media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_reviewer());
drop policy if exists "reviewers change media" on storage.objects;
create policy "reviewers change media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_reviewer());
drop policy if exists "reviewers delete media" on storage.objects;
create policy "reviewers delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_reviewer());
