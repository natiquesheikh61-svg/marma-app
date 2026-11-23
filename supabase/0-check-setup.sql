-- CHECK: is the database set up correctly? Paste in SQL Editor and Run.
-- Every line should say "yes".
select 'tables (need 7)' as item, case when count(*) = 7 then 'yes' else 'NO – only ' || count(*) end as ok
  from information_schema.tables where table_schema = 'public'
  and table_name in ('categories','reviewers','entries','submissions','recordings','prompts','reports')
union all
select 'approve function', case when exists (select 1 from pg_proc where proname = 'approve_submission') then 'yes' else 'NO' end
union all
select 'security rules (need 22+)', case when count(*) >= 22 then 'yes' else 'NO – only ' || count(*) end
  from pg_policies where schemaname in ('public','storage')
union all
select 'file folders (need 2)', case when count(*) = 2 then 'yes' else 'NO – only ' || count(*) end
  from storage.buckets where id in ('submissions','media')
union all
select 'topics (need 15)', case when count(*) >= 15 then 'yes' else 'NO – only ' || count(*) end from public.categories
union all
select 'phrasebook sentences (need 38)', case when count(*) >= 38 then 'yes' else 'NO – only ' || count(*) end from public.prompts
union all
select 'checkers (need 1+)', case when count(*) >= 1 then 'yes' else 'NO – run 3-add-a-checker.sql' end from public.reviewers;
