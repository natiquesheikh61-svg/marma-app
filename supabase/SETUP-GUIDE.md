# Connecting the Marma app to Supabase — step by step

Everything here is free. No credit card is needed.

## Part A — Make the Supabase project (10 minutes)

1. Go to **supabase.com** and click **Start your project**.
2. Click **Continue with GitHub** and use the same GitHub account as your app.
3. If it asks for an **organization**, type `Marma App`, choose **Free**, and click **Create organization**.
4. Click **New project**:
   - Project name: `marma-app`
   - Database password: click **Generate a password**, then **copy it and keep it safe** (on paper is fine).
   - Region: **Southeast Asia (Singapore)**, the closest to Bangladesh.
   - Click **Create new project** and wait about 2 minutes.

## Part B — Create the database (5 minutes)

1. On the left, click **SQL Editor**, then **+ New query**.
2. Open the file `supabase/1-setup-database.sql` on your laptop with Notepad. Select all (**Ctrl+A**), copy (**Ctrl+C**), paste it into Supabase (**Ctrl+V**), and click **Run**. You should see **"Success. No rows returned"**.
3. Click **+ New query** again and do the same with `supabase/2-starter-data.sql`.
4. Check that it worked: on the left, click **Table Editor**. You should see `categories`, `entries`, `prompts`, `recordings`, `reports`, `reviewers` and `submissions`.

## Part C — Make yourself a checker (3 minutes)

1. On the left, click **Authentication**, then **Users**, then **Add user**, then **Create new user**.
   Type your email and a password, tick **Auto Confirm User**, and click **Create user**.
2. Go to **SQL Editor**, then **+ New query**. Paste in `supabase/3-add-a-checker.sql`.
   Change `your-email@example.com` to your email and `Capt Natique` to the name you want shown, then click **Run**.
3. For safety, stop strangers from creating accounts: go to **Authentication**, then **Sign In / Providers**, turn **OFF** "Allow new users to sign up", and click **Save**.
   (Ordinary people don't need an account. Only checkers do, and you create those yourself, as in step 1.)

## Part D — Connect the app (5 minutes)

1. In Supabase, click **Project Settings** (the ⚙ at the bottom left), then **Data API**. Copy the **Project URL**.
2. Then click **API Keys** and copy the **Publishable key** (it starts with `sb_publishable_`).
   Older projects instead show an **anon public** key, which is also fine.
   ⚠ **Never** use the key called **secret** or **service_role**.
3. Open `config.js` with Notepad and paste the two values between the quotes:
   ```
   SUPABASE_URL: 'https://xxxxxxxx.supabase.co',
   SUPABASE_KEY: 'sb_publishable_xxxxxxxx'
   ```
   Save the file.
4. Upload **all** the app files to GitHub, the same way as before: **Add file**, then **Upload files**, drag everything in, then **Commit changes**.
5. On your phone, open the website **twice**. The home page should say **"✔ Connected to database"**.

## Every day use

- **Marma speakers:** they use **Add**, then **Save & send**. It works without internet too; the word is sent by itself when internet comes.
- **Checkers:** they use **Add**, then **Page for checkers**, then log in and go to **Waiting**. They listen, correct if needed, and press **Correct**. The word then goes to every phone.
- **Many words at once:** on the checker page, use **Import list**. Download the empty sample file, fill it in Google Sheets, then choose **File**, then **Download**, then **CSV**, and import it.
- **Adding another checker:** repeat Part C, steps 1 and 2, with their email.
- **Backup:** in Supabase, go to **Table Editor**, choose `entries`, and click **Export to CSV**. Do this once a month.

## Good to know

- On the free plan, Supabase **pauses a project after about one week with no use**. If the app says "Could not reach the database", log in to supabase.com and click **Restore project**. The phones keep working offline the whole time.
- The free plan holds about 1 GB of voices and pictures, which is thousands of short clips.
