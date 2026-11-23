-- Marma Translator – starter data. Run AFTER 1-setup-database.sql. Safe to run again (adds nothing twice).
-- Only topics and Bangla/English sentences. NO Marma words (those come from Marma speakers).

insert into public.categories (id, name_bn, name_en, sort) values
  ('greet', 'শুভেচ্ছা', 'Greetings', 0),
  ('help', 'সাহায্য', 'Help', 1),
  ('health', 'স্বাস্থ্য', 'Health', 2),
  ('market', 'বাজার', 'Market', 3),
  ('travel', 'যাতায়াত', 'Travel', 4),
  ('family', 'পরিবার', 'Family', 5),
  ('food', 'খাবার', 'Food', 6),
  ('nature', 'প্রকৃতি', 'Nature', 7),
  ('animals', 'পশুপাখি', 'Animals', 8),
  ('body', 'শরীর', 'Body', 9),
  ('time', 'সময় ও দিন', 'Time & days', 10),
  ('numbers', 'সংখ্যা', 'Numbers', 11),
  ('school', 'স্কুল', 'School', 12),
  ('farming', 'চাষাবাদ', 'Farming', 13),
  ('other', 'অন্যান্য', 'Other', 14)
on conflict (id) do nothing;

insert into public.prompts (bn, en, category_id)
select v.bn, v.en, v.cat from (values
  ('আপনি কেমন আছেন?', 'How are you?', 'greet'),
  ('আমি ভালো আছি।', 'I am fine.', 'greet'),
  ('আপনার নাম কী?', 'What is your name?', 'greet'),
  ('আমার নাম ___।', 'My name is ___.', 'greet'),
  ('ধন্যবাদ।', 'Thank you.', 'greet'),
  ('শুভ সকাল।', 'Good morning.', 'greet'),
  ('আবার দেখা হবে।', 'See you again.', 'greet'),
  ('দয়া করে ভেতরে আসুন।', 'Please come in.', 'greet'),
  ('আপনি কোথা থেকে এসেছেন?', 'Where are you from?', 'greet'),
  ('হ্যাঁ।', 'Yes.', 'help'),
  ('না।', 'No.', 'help'),
  ('আমি বুঝতে পারছি না।', 'I don''t understand.', 'help'),
  ('দয়া করে আস্তে বলুন।', 'Please speak slowly.', 'help'),
  ('আপনি কি আমাকে সাহায্য করতে পারবেন?', 'Can you help me?', 'help'),
  ('দয়া করে অপেক্ষা করুন।', 'Please wait.', 'help'),
  ('টয়লেট কোথায়?', 'Where is the toilet?', 'help'),
  ('আমার ক্ষুধা লেগেছে।', 'I am hungry.', 'help'),
  ('দয়া করে আমার পরিবারকে ফোন করুন।', 'Please call my family.', 'help'),
  ('আমি অসুস্থ।', 'I am sick.', 'health'),
  ('আমার ডাক্তার দরকার।', 'I need a doctor.', 'health'),
  ('হাসপাতাল কোথায়?', 'Where is the hospital?', 'health'),
  ('আমার মাথা ব্যথা করছে।', 'My head hurts.', 'health'),
  ('আমার জ্বর হয়েছে।', 'I have a fever.', 'health'),
  ('কেউ কি আহত হয়েছে?', 'Is anyone hurt?', 'health'),
  ('এই ওষুধ দিনে দুইবার খাবেন।', 'Take this medicine twice a day.', 'health'),
  ('এটার দাম কত?', 'How much is this?', 'market'),
  ('এটা অনেক দামি।', 'It is too expensive.', 'market'),
  ('আমি এটা কিনতে চাই।', 'I want to buy this.', 'market'),
  ('আমাকে চাল দিন।', 'Please give me rice.', 'market'),
  ('আপনার কাছে পানি আছে?', 'Do you have water?', 'market'),
  ('এটা কত দূর?', 'How far is it?', 'travel'),
  ('বাস কখন ছাড়বে?', 'When does the bus leave?', 'travel'),
  ('বান্দরবান যাওয়ার রাস্তা কোথায়?', 'Where is the road to Bandarban?', 'travel'),
  ('আমি পথ হারিয়ে ফেলেছি।', 'I am lost.', 'travel'),
  ('ইনি আমার মা।', 'This is my mother.', 'family'),
  ('ইনি আমার বাবা।', 'This is my father.', 'family'),
  ('আপনার গ্রাম কোথায়?', 'Where is your village?', 'family'),
  ('আপনার কয়টি সন্তান আছে?', 'How many children do you have?', 'family')
) as v(bn, en, cat)
where not exists (select 1 from public.prompts p where p.bn = v.bn);
