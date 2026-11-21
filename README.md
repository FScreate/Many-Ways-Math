# Many Ways Math

A math practice app for Kindergarten through Grade 5. Parents sign in with an email link, then their children pick their own profile.

This is a static site (no build step). It runs on Vercel, and progress is saved to Supabase.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole app: lessons, games, tests, badges, music, and the sign-in screen |
| `config.js` | Your Supabase project URL and public anon key |
| `supabase/schema.sql` | The database table and security rules |
| `vercel.json` | Vercel settings |

## One-time setup (do these in order)

### 1. Create the Supabase project and database

1. Go to https://supabase.com, sign in, and create a new project. Choose a region near you and save the database password.
2. Open **SQL Editor**, paste the contents of `supabase/schema.sql`, and click **Run**.
3. Open **Authentication > Providers** and confirm **Email** is enabled. Magic links use this provider.
4. Open **Project Settings > API** and copy the **Project URL** and the **anon public** key. You'll need them in step 3.

### 2. Put the code on GitHub

1. On GitHub, create a new **empty** repository named `many-ways-math`. Don't add a README, .gitignore or license, so the first push works cleanly.
2. In a terminal, from the `many-ways-math` folder:

```bash
git init
git add .
git commit -m "Many Ways Math"
git branch -M main
git remote add origin https://github.com/YOUR-USER/many-ways-math.git
git push -u origin main
```

### 3. Deploy on Vercel

1. Go to https://vercel.com, sign in with GitHub, and click **Add New > Project**.
2. Import the `many-ways-math` repository.
3. Framework preset: **Other**. Leave the build command and output directory empty.
4. Click **Deploy**. Vercel gives you an address such as `https://many-ways-math.vercel.app`.

### 4. Connect Supabase to your Vercel address

1. In Supabase, open **Authentication > URL Configuration**.
2. Set **Site URL** to your Vercel address.
3. Add the same address under **Redirect URLs**.

### 5. Add your keys and redeploy

1. Open `config.js` and paste the two values from step 1.4:

```js
window.MWM_CONFIG = {
  supabaseUrl: 'https://YOUR-PROJECT.supabase.co',
  supabaseAnonKey: 'YOUR-ANON-PUBLIC-KEY'
};
```

The anon key is designed to be public. Row-level security in `schema.sql` is what keeps each family's data private. Never use the `service_role` key here.

2. Commit and push the change:

```bash
git add config.js
git commit -m "Add Supabase keys"
git push
```

Vercel redeploys automatically after each push.

### 6. Test it

Open your Vercel address, enter a parent email, and open the sign-in link. Add a child, play a lesson, and check the **kids** table in Supabase's Table Editor. The child's row should appear within a few seconds.

## How it works

- A parent signs in with an email link. The app stores only what the parent's account can see.
- Each child is one row in `kids`, with their progress in a single JSON column.
- Saving is automatic. Changes are sent about 0.7 seconds after the last tap.
- Without Supabase settings, the app runs on one device with no sign-in (the original behavior).

## Privacy before launch

This app stores children's names and learning progress. Before inviting families:

- Add a privacy policy that says what is collected, why, and how parents can delete their data.
- Check the rules that apply where you live. In the US, COPPA requires verifiable parental consent for children under 13. In the UK and EU, parental consent rules also apply.
- Only collect the child's first name and age. The app never asks for a last name, school or photo.
- Let parents delete a child's profile (already in the app) and their whole account (not yet built).

## Not yet tested against a live project

The sign-in and saving logic were tested with a mock Supabase client. Run through the steps above on a real project before inviting families.
