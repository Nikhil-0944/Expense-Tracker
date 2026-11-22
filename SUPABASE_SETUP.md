# Supabase setup for Pocket Ledger

1. Create a Supabase project. In **Project Settings → API**, copy the Project URL and the publishable key (or legacy anon key).
2. Put those values in `supabase-config.js`, replacing the two `YOUR_...` placeholders. The publishable/anon key is intended for browser apps. Never put a secret or service-role key in this file.
3. In the Supabase dashboard, open **SQL Editor**, paste the contents of `supabase-setup.sql`, and run it. The table is protected so each signed-in user can access only their own data.
4. In **Authentication → Providers → Email**, enable email/password sign-in. Configure email confirmation as you prefer.
5. Commit and push `index.html`, `script.js`, `style.css`, `supabase-config.js`, and `supabase-setup.sql` to the GitHub repository used by the website. Redeploy if the host does not deploy automatically.
6. Open the website, create an account, and sign in. Existing browser expenses are imported to the first account that connects on that browser. New expenses and settings sync to Supabase.

The site remains usable with local browser storage if the Supabase values have not been filled in yet. After Supabase is configured, sign-in is required for the cloud-synced version.
