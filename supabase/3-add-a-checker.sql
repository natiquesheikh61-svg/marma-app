-- Make someone a CHECKER (reviewer).
-- First create their login: Supabase → Authentication → Users → "Add user" → "Create new user"
--   (type their email and a password, tick "Auto Confirm User").
-- Then change the email and name below, and Run this in the SQL Editor.

insert into public.reviewers (user_id, display_name, is_admin)
select id, 'Capt Natique', true            -- ← the name shown as "checked by"
from auth.users
where email = 'your-email@example.com'     -- ← their email
on conflict (user_id) do update set display_name = excluded.display_name, is_admin = excluded.is_admin;

-- To check who the checkers are:
-- select r.display_name, u.email from public.reviewers r join auth.users u on u.id = r.user_id;
-- To remove a checker:
-- delete from public.reviewers where user_id = (select id from auth.users where email = 'their-email@example.com');
