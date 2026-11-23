-- =====================================================================
--  Marma Translator – LEARNING update (run once in SQL Editor; safe to run again)
--  Adds the course (12 units, from greetings to everyday talk).
--  Only Bangla/English is added here. The Marma for each item comes from
--  Marma speakers (Add page) and is approved by a checker.
--  Marma is written in ENGLISH LETTERS in this app.
-- =====================================================================

-- 1. Course units (the big coloured sections of the learning path)
create table if not exists public.course_units (
  code     text primary key,      -- e.g. 'u01'
  sort     int  not null,         -- order on the path
  emoji    text,
  color    text,                  -- colour of the unit banner
  title_bn text not null,
  title_en text not null,
  desc_bn  text,
  desc_en  text
);

-- 2. Each phrase-list item can now belong to a unit of the course
alter table public.prompts add column if not exists code      text unique;   -- e.g. 'u01-03'
alter table public.prompts add column if not exists unit      text references public.course_units(code);
alter table public.prompts add column if not exists sort      int;
alter table public.prompts add column if not exists item_type text check (item_type in ('word','sentence'));

-- 3. Link the Marma answer to the course item it belongs to
alter table public.entries     add column if not exists prompt_code text;
alter table public.submissions add column if not exists prompt_code text;
create index if not exists entries_prompt_code_idx on public.entries (prompt_code);

-- 4. Security: everyone may read the course, only reviewers change it
alter table public.course_units enable row level security;
grant select on public.course_units to anon, authenticated;
grant select, insert, update, delete on public.course_units to authenticated;
drop policy if exists "public reads units" on public.course_units;
create policy "public reads units" on public.course_units for select using (true);
drop policy if exists "reviewers write units" on public.course_units;
create policy "reviewers write units" on public.course_units for all to authenticated using (public.is_reviewer()) with check (public.is_reviewer());

-- 5. Approve: now also keeps the link to the course item
create or replace function public.approve_submission(
  p_id uuid, p_audio_path text default null, p_image_path text default null,
  p_kind text default null, p_marma text default null, p_bn text default null,
  p_en text default null, p_category text default null
) returns uuid
language plpgsql security definer set search_path = public as $$
declare s public.submissions; new_id uuid; rname text;
begin
  if not public.is_reviewer() then raise exception 'Only reviewers can approve'; end if;
  select * into s from public.submissions where id = p_id for update;
  if not found then raise exception 'Submission not found'; end if;
  if s.status <> 'pending' then raise exception 'Already reviewed'; end if;
  select display_name into rname from public.reviewers where user_id = auth.uid();
  insert into public.entries (kind, marma, marma_bn_script, pronunciation, bn, en, part_of_speech,
      category_id, example_marma, example_bn, example_en, notes, dialect,
      audio_path, image_path, source, checked_by, prompt_code)
  values (coalesce(nullif(p_kind,''), s.kind), coalesce(nullif(p_marma,''), s.marma), s.marma_bn_script,
      s.pronunciation, coalesce(p_bn, s.bn), coalesce(p_en, s.en), s.part_of_speech,
      coalesce(nullif(p_category,''), s.category_id), s.example_marma, s.example_bn, s.example_en,
      s.notes, s.dialect, p_audio_path, p_image_path, 'Marma speaker (community)', rname, s.prompt_code)
  returning id into new_id;
  if p_audio_path is not null then
    insert into public.recordings (entry_id, audio_path, speaker_label, speaker_gender, age_group, dialect, consent_for_training)
    values (new_id, p_audio_path, s.speaker_label, s.speaker_gender, s.age_group, s.dialect, s.consent_for_training);
  end if;
  update public.submissions set status = 'approved', reviewed_by = auth.uid(), reviewed_at = now(), entry_id = new_id where id = p_id;
  return new_id;
end $$;
revoke execute on function public.approve_submission(uuid,text,text,text,text,text,text,text) from public, anon;
grant  execute on function public.approve_submission(uuid,text,text,text,text,text,text,text) to authenticated;

-- 6. The 12 units
insert into public.course_units (code, sort, emoji, color, title_bn, title_en, desc_bn, desc_en) values
  ('u01', 1, '👋', '#1fa36b', 'শুভেচ্ছা ও ভদ্রতা', 'Greetings & manners', 'প্রথম দেখায় যা বলা হয়', 'What you say when you meet someone'),
  ('u02', 2, '🙋', '#2d9cdb', 'নিজের পরিচয়', 'About me', 'নাম, কোথা থেকে, আমি-আপনি', 'Names, where you are from, I and you'),
  ('u03', 3, '👨‍👩‍👧', '#ff8a3d', 'পরিবার', 'Family', 'মা, বাবা, ভাই, বোন', 'Mother, father, brothers, sisters'),
  ('u04', 4, '🔢', '#7b5cff', 'সংখ্যা ১–১০', 'Numbers 1–10', 'এক থেকে দশ গোনা', 'Counting from one to ten'),
  ('u05', 5, '🍚', '#e0a100', 'খাবার ও পানীয়', 'Food & drink', 'ভাত, পানি, মাছ — আর খাওয়ার কথা', 'Rice, water, fish — and talking about food'),
  ('u06', 6, '🏠', '#ff5c8a', 'প্রতিদিনের কাজ', 'Daily actions', 'খাওয়া, ঘুম, যাওয়া, আসা', 'Eat, sleep, go, come'),
  ('u07', 7, '📅', '#2fb5a8', 'সময় ও দিন', 'Time & days', 'আজ, কাল, সকাল, রাত', 'Today, tomorrow, morning, night'),
  ('u08', 8, '🛒', '#1fa36b', 'বাজারে', 'At the market', 'দাম জিজ্ঞেস করা, কেনা', 'Asking prices and buying'),
  ('u09', 9, '🧭', '#2d9cdb', 'পথ চলা', 'Getting around', 'রাস্তা, গ্রাম, কাছে, দূরে', 'Roads, villages, near and far'),
  ('u10', 10, '🩺', '#ff8a3d', 'শরীর ও স্বাস্থ্য', 'Body & health', 'মাথা, হাত, জ্বর, ডাক্তার', 'Head, hand, fever, doctor'),
  ('u11', 11, '😊', '#7b5cff', 'অনুভূতি', 'Feelings', 'খুশি, ক্লান্ত, ভালো লাগা', 'Happy, tired, likes and dislikes'),
  ('u12', 12, '💬', '#ff5c8a', 'প্রতিদিনের কথাবার্তা', 'Everyday talk', 'প্রশ্ন করা ও ছোট আলাপ', 'Asking questions and small talk')
on conflict (code) do update set sort = excluded.sort, emoji = excluded.emoji, color = excluded.color,
  title_bn = excluded.title_bn, title_en = excluded.title_en, desc_bn = excluded.desc_bn, desc_en = excluded.desc_en;

-- 7. The course items (Bangla + English). Items already in the phrase list are reused, not copied.
create temporary table course_items (code text, unit text, sort int, item_type text, bn text, en text, cat text) on commit drop;
insert into course_items values
  ('u01-01', 'u01', 1, 'word', 'হ্যালো', 'Hello', 'greet'),
  ('u01-02', 'u01', 2, 'sentence', 'আপনি কেমন আছেন?', 'How are you?', 'greet'),
  ('u01-03', 'u01', 3, 'sentence', 'আমি ভালো আছি।', 'I am fine.', 'greet'),
  ('u01-04', 'u01', 4, 'word', 'ধন্যবাদ', 'Thank you', 'greet'),
  ('u01-05', 'u01', 5, 'word', 'হ্যাঁ', 'Yes', 'greet'),
  ('u01-06', 'u01', 6, 'word', 'না', 'No', 'greet'),
  ('u01-07', 'u01', 7, 'word', 'দয়া করে', 'Please', 'greet'),
  ('u01-08', 'u01', 8, 'sentence', 'দুঃখিত।', 'Sorry.', 'greet'),
  ('u01-09', 'u01', 9, 'sentence', 'স্বাগতম।', 'Welcome.', 'greet'),
  ('u01-10', 'u01', 10, 'sentence', 'আবার দেখা হবে।', 'See you again.', 'greet'),
  ('u02-01', 'u02', 1, 'word', 'আমি', 'I', 'greet'),
  ('u02-02', 'u02', 2, 'word', 'আপনি', 'You', 'greet'),
  ('u02-03', 'u02', 3, 'word', 'সে', 'He / She', 'greet'),
  ('u02-04', 'u02', 4, 'word', 'আমরা', 'We', 'greet'),
  ('u02-05', 'u02', 5, 'sentence', 'আপনার নাম কী?', 'What is your name?', 'greet'),
  ('u02-06', 'u02', 6, 'sentence', 'আমার নাম ___।', 'My name is ___.', 'greet'),
  ('u02-07', 'u02', 7, 'sentence', 'আপনি কোথা থেকে এসেছেন?', 'Where are you from?', 'greet'),
  ('u02-08', 'u02', 8, 'sentence', 'আমি ___ থেকে এসেছি।', 'I am from ___.', 'greet'),
  ('u02-09', 'u02', 9, 'sentence', 'আপনার সাথে দেখা হয়ে ভালো লাগলো।', 'Nice to meet you.', 'greet'),
  ('u02-10', 'u02', 10, 'sentence', 'আমি একটু মারমা বলতে পারি।', 'I speak a little Marma.', 'greet'),
  ('u03-01', 'u03', 1, 'word', 'মা', 'Mother', 'family'),
  ('u03-02', 'u03', 2, 'word', 'বাবা', 'Father', 'family'),
  ('u03-03', 'u03', 3, 'word', 'বড় ভাই', 'Elder brother', 'family'),
  ('u03-04', 'u03', 4, 'word', 'ছোট ভাই', 'Younger brother', 'family'),
  ('u03-05', 'u03', 5, 'word', 'বড় বোন', 'Elder sister', 'family'),
  ('u03-06', 'u03', 6, 'word', 'ছোট বোন', 'Younger sister', 'family'),
  ('u03-07', 'u03', 7, 'word', 'শিশু', 'Child', 'family'),
  ('u03-08', 'u03', 8, 'word', 'দাদি / নানি', 'Grandmother', 'family'),
  ('u03-09', 'u03', 9, 'word', 'দাদা / নানা', 'Grandfather', 'family'),
  ('u03-10', 'u03', 10, 'word', 'স্বামী', 'Husband', 'family'),
  ('u03-11', 'u03', 11, 'word', 'স্ত্রী', 'Wife', 'family'),
  ('u03-12', 'u03', 12, 'sentence', 'ইনি আমার মা।', 'This is my mother.', 'family'),
  ('u03-13', 'u03', 13, 'sentence', 'ইনি আমার বাবা।', 'This is my father.', 'family'),
  ('u03-14', 'u03', 14, 'sentence', 'আপনার কয়টি সন্তান আছে?', 'How many children do you have?', 'family'),
  ('u04-01', 'u04', 1, 'word', 'এক', 'One', 'numbers'),
  ('u04-02', 'u04', 2, 'word', 'দুই', 'Two', 'numbers'),
  ('u04-03', 'u04', 3, 'word', 'তিন', 'Three', 'numbers'),
  ('u04-04', 'u04', 4, 'word', 'চার', 'Four', 'numbers'),
  ('u04-05', 'u04', 5, 'word', 'পাঁচ', 'Five', 'numbers'),
  ('u04-06', 'u04', 6, 'word', 'ছয়', 'Six', 'numbers'),
  ('u04-07', 'u04', 7, 'word', 'সাত', 'Seven', 'numbers'),
  ('u04-08', 'u04', 8, 'word', 'আট', 'Eight', 'numbers'),
  ('u04-09', 'u04', 9, 'word', 'নয়', 'Nine', 'numbers'),
  ('u04-10', 'u04', 10, 'word', 'দশ', 'Ten', 'numbers'),
  ('u05-01', 'u05', 1, 'word', 'ভাত', 'Rice (cooked)', 'food'),
  ('u05-02', 'u05', 2, 'word', 'পানি', 'Water', 'food'),
  ('u05-03', 'u05', 3, 'word', 'মাছ', 'Fish', 'food'),
  ('u05-04', 'u05', 4, 'word', 'ডিম', 'Egg', 'food'),
  ('u05-05', 'u05', 5, 'word', 'সবজি', 'Vegetables', 'food'),
  ('u05-06', 'u05', 6, 'word', 'চা', 'Tea', 'food'),
  ('u05-07', 'u05', 7, 'word', 'লবণ', 'Salt', 'food'),
  ('u05-08', 'u05', 8, 'word', 'মুরগি', 'Chicken', 'food'),
  ('u05-09', 'u05', 9, 'sentence', 'আমার ক্ষুধা লেগেছে।', 'I am hungry.', 'food'),
  ('u05-10', 'u05', 10, 'sentence', 'আমি পানি চাই।', 'I want water.', 'food'),
  ('u05-11', 'u05', 11, 'sentence', 'খুব মজা হয়েছে।', 'It is delicious.', 'food'),
  ('u05-12', 'u05', 12, 'sentence', 'দয়া করে খান।', 'Please eat.', 'food'),
  ('u06-01', 'u06', 1, 'word', 'খাওয়া', 'To eat', 'other'),
  ('u06-02', 'u06', 2, 'word', 'পান করা', 'To drink', 'other'),
  ('u06-03', 'u06', 3, 'word', 'ঘুমানো', 'To sleep', 'other'),
  ('u06-04', 'u06', 4, 'word', 'যাওয়া', 'To go', 'other'),
  ('u06-05', 'u06', 5, 'word', 'আসা', 'To come', 'other'),
  ('u06-06', 'u06', 6, 'word', 'বসা', 'To sit', 'other'),
  ('u06-07', 'u06', 7, 'word', 'কাজ করা', 'To work', 'other'),
  ('u06-08', 'u06', 8, 'sentence', 'আমি বাড়ি যাচ্ছি।', 'I am going home.', 'other'),
  ('u06-09', 'u06', 9, 'sentence', 'এখানে আসুন।', 'Come here.', 'other'),
  ('u06-10', 'u06', 10, 'sentence', 'বসুন।', 'Please sit.', 'other'),
  ('u06-11', 'u06', 11, 'sentence', 'আপনি কী করছেন?', 'What are you doing?', 'other'),
  ('u07-01', 'u07', 1, 'word', 'আজ', 'Today', 'time'),
  ('u07-02', 'u07', 2, 'word', 'আগামীকাল', 'Tomorrow', 'time'),
  ('u07-03', 'u07', 3, 'word', 'গতকাল', 'Yesterday', 'time'),
  ('u07-04', 'u07', 4, 'word', 'সকাল', 'Morning', 'time'),
  ('u07-05', 'u07', 5, 'word', 'রাত', 'Night', 'time'),
  ('u07-06', 'u07', 6, 'word', 'এখন', 'Now', 'time'),
  ('u07-07', 'u07', 7, 'word', 'পরে', 'Later', 'time'),
  ('u07-08', 'u07', 8, 'sentence', 'শুভ সকাল।', 'Good morning.', 'time'),
  ('u07-09', 'u07', 9, 'sentence', 'এখন কয়টা বাজে?', 'What time is it?', 'time'),
  ('u07-10', 'u07', 10, 'sentence', 'কাল দেখা হবে।', 'See you tomorrow.', 'time'),
  ('u08-01', 'u08', 1, 'word', 'টাকা', 'Money', 'market'),
  ('u08-02', 'u08', 2, 'word', 'দোকান', 'Shop', 'market'),
  ('u08-03', 'u08', 3, 'word', 'বাজার', 'Market', 'market'),
  ('u08-04', 'u08', 4, 'word', 'সস্তা', 'Cheap', 'market'),
  ('u08-05', 'u08', 5, 'sentence', 'এটার দাম কত?', 'How much is this?', 'market'),
  ('u08-06', 'u08', 6, 'sentence', 'এটা অনেক দামি।', 'It is too expensive.', 'market'),
  ('u08-07', 'u08', 7, 'sentence', 'দাম একটু কমান।', 'Please reduce the price.', 'market'),
  ('u08-08', 'u08', 8, 'sentence', 'আমি এটা কিনতে চাই।', 'I want to buy this.', 'market'),
  ('u08-09', 'u08', 9, 'sentence', 'আমাকে চাল দিন।', 'Please give me rice.', 'market'),
  ('u08-10', 'u08', 10, 'sentence', 'আপনার কাছে পানি আছে?', 'Do you have water?', 'market'),
  ('u09-01', 'u09', 1, 'word', 'রাস্তা', 'Road', 'travel'),
  ('u09-02', 'u09', 2, 'word', 'গ্রাম', 'Village', 'travel'),
  ('u09-03', 'u09', 3, 'word', 'বাড়ি', 'House', 'travel'),
  ('u09-04', 'u09', 4, 'word', 'কাছে', 'Near', 'travel'),
  ('u09-05', 'u09', 5, 'word', 'দূরে', 'Far', 'travel'),
  ('u09-06', 'u09', 6, 'word', 'বাম', 'Left', 'travel'),
  ('u09-07', 'u09', 7, 'word', 'ডান', 'Right', 'travel'),
  ('u09-08', 'u09', 8, 'sentence', '___ কোথায়?', 'Where is ___?', 'travel'),
  ('u09-09', 'u09', 9, 'sentence', 'সোজা যান।', 'Go straight.', 'travel'),
  ('u09-10', 'u09', 10, 'sentence', 'এটা কত দূর?', 'How far is it?', 'travel'),
  ('u09-11', 'u09', 11, 'sentence', 'আমি পথ হারিয়ে ফেলেছি।', 'I am lost.', 'travel'),
  ('u09-12', 'u09', 12, 'sentence', 'আপনার গ্রাম কোথায়?', 'Where is your village?', 'travel'),
  ('u10-01', 'u10', 1, 'word', 'মাথা', 'Head', 'health'),
  ('u10-02', 'u10', 2, 'word', 'হাত', 'Hand', 'health'),
  ('u10-03', 'u10', 3, 'word', 'পেট', 'Stomach', 'health'),
  ('u10-04', 'u10', 4, 'word', 'চোখ', 'Eye', 'health'),
  ('u10-05', 'u10', 5, 'word', 'ওষুধ', 'Medicine', 'health'),
  ('u10-06', 'u10', 6, 'sentence', 'আমি অসুস্থ।', 'I am sick.', 'health'),
  ('u10-07', 'u10', 7, 'sentence', 'আমার জ্বর হয়েছে।', 'I have a fever.', 'health'),
  ('u10-08', 'u10', 8, 'sentence', 'আমার মাথা ব্যথা করছে।', 'My head hurts.', 'health'),
  ('u10-09', 'u10', 9, 'sentence', 'আমার ডাক্তার দরকার।', 'I need a doctor.', 'health'),
  ('u10-10', 'u10', 10, 'sentence', 'হাসপাতাল কোথায়?', 'Where is the hospital?', 'health'),
  ('u11-01', 'u11', 1, 'word', 'ভালো', 'Good', 'other'),
  ('u11-02', 'u11', 2, 'word', 'খারাপ', 'Bad', 'other'),
  ('u11-03', 'u11', 3, 'word', 'খুশি', 'Happy', 'other'),
  ('u11-04', 'u11', 4, 'word', 'ক্লান্ত', 'Tired', 'other'),
  ('u11-05', 'u11', 5, 'sentence', 'আমি খুশি।', 'I am happy.', 'other'),
  ('u11-06', 'u11', 6, 'sentence', 'আমি ক্লান্ত।', 'I am tired.', 'other'),
  ('u11-07', 'u11', 7, 'sentence', 'আমার এটা ভালো লাগে।', 'I like it.', 'other'),
  ('u11-08', 'u11', 8, 'sentence', 'আমার এটা ভালো লাগে না।', 'I don''t like it.', 'other'),
  ('u11-09', 'u11', 9, 'sentence', 'আমি বুঝতে পেরেছি।', 'I understand.', 'other'),
  ('u11-10', 'u11', 10, 'sentence', 'আমি বুঝতে পারছি না।', 'I don''t understand.', 'other'),
  ('u11-11', 'u11', 11, 'sentence', 'দয়া করে আস্তে বলুন।', 'Please speak slowly.', 'other'),
  ('u12-01', 'u12', 1, 'word', 'কী?', 'What?', 'help'),
  ('u12-02', 'u12', 2, 'word', 'কোথায়?', 'Where?', 'help'),
  ('u12-03', 'u12', 3, 'word', 'কখন?', 'When?', 'help'),
  ('u12-04', 'u12', 4, 'word', 'কে?', 'Who?', 'help'),
  ('u12-05', 'u12', 5, 'word', 'কেন?', 'Why?', 'help'),
  ('u12-06', 'u12', 6, 'word', 'কীভাবে?', 'How?', 'help'),
  ('u12-07', 'u12', 7, 'sentence', 'আপনি কোথায় যাচ্ছেন?', 'Where are you going?', 'help'),
  ('u12-08', 'u12', 8, 'sentence', 'আমি বাজারে যাচ্ছি।', 'I am going to the market.', 'help'),
  ('u12-09', 'u12', 9, 'sentence', 'আপনি খেয়েছেন?', 'Have you eaten?', 'help'),
  ('u12-10', 'u12', 10, 'sentence', 'হ্যাঁ, আমি খেয়েছি।', 'Yes, I have eaten.', 'help'),
  ('u12-11', 'u12', 11, 'sentence', 'আপনি কি আমাকে সাহায্য করতে পারবেন?', 'Can you help me?', 'help'),
  ('u12-12', 'u12', 12, 'sentence', 'দয়া করে অপেক্ষা করুন।', 'Please wait.', 'help');

update public.prompts p set code = c.code, unit = c.unit, sort = c.sort, item_type = c.item_type
  from course_items c where p.code is null and p.bn = c.bn
  and not exists (select 1 from public.prompts x where x.code = c.code);

insert into public.prompts (code, unit, sort, item_type, bn, en, category_id, is_active)
select c.code, c.unit, c.sort, c.item_type, c.bn, c.en, c.cat, true from course_items c
on conflict (code) do update set unit = excluded.unit, sort = excluded.sort, item_type = excluded.item_type,
  bn = excluded.bn, en = excluded.en;

-- 8. Link Marma that was ALREADY approved to its course item (by matching Bangla or English)
update public.entries e set prompt_code = p.code
  from public.prompts p
 where e.prompt_code is null and p.code is not null and e.is_deleted = false
   and (lower(trim(e.bn)) = lower(trim(p.bn)) or lower(trim(e.en)) = lower(trim(p.en)));

-- Check: should show 12 units and 130+ course items
select (select count(*) from public.course_units) as units,
       (select count(*) from public.prompts where code is not null) as course_items;
