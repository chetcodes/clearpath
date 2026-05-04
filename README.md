# ClearPath — ERP Transformation Scoping & Cost Estimation

> Build a defensible ERP transformation business case in minutes.
> Compare Workday, Oracle, SAP and more with industry-benchmark cost models.

---

## Deploying ClearPath: A to Z

Follow these steps exactly, in order. Takes about 20–30 minutes the first time.

---

### PART 1 — One-time setup (do these once, never again)

---

#### Step 1 — Install Node.js

Node.js is the JavaScript runtime that builds the app.

1. Go to **https://nodejs.org**
2. Download the **LTS** version (the left button)
3. Run the installer, click through all defaults
4. Verify it worked: open Terminal (Mac) or Command Prompt (Windows) and type:
   ```
   node --version
   ```
   You should see something like `v20.x.x`. If so, you're good.

---

#### Step 2 — Install Git

Git tracks your code changes and connects to GitHub.

**Mac:** Git is usually already installed. Open Terminal and type `git --version` to check.
If not installed, it will prompt you to install it automatically.

**Windows:** Download from **https://git-scm.com/download/win** and run the installer.
Accept all defaults.

---

#### Step 3 — Create a GitHub account

GitHub is where your code lives. Vercel deploys directly from it.

1. Go to **https://github.com** and sign up (free)
2. Choose a username — this will appear in your repo URL
3. Verify your email

---

#### Step 4 — Create a Vercel account

Vercel is the hosting platform. Free tier is more than enough to start.

1. Go to **https://vercel.com**
2. Click **Sign Up** → choose **Continue with GitHub**
3. Authorize Vercel to access your GitHub
4. You now have a Vercel account linked to your GitHub — no credit card needed

---

### PART 2 — Set up your project locally

---

#### Step 5 — Create a new GitHub repository

1. Go to **https://github.com/new**
2. Repository name: `clearpath` (or whatever you want)
3. Set to **Private** for now (you can make it public later)
4. Check **"Add a README file"**
5. Click **Create repository**

---

#### Step 6 — Clone the repository to your computer

This downloads the empty repo to your machine.

1. On your new repo page, click the green **Code** button
2. Copy the URL (looks like `https://github.com/yourusername/clearpath.git`)
3. Open Terminal / Command Prompt
4. Navigate to where you want the project (e.g. your Desktop):
   ```
   cd ~/Desktop
   ```
5. Clone it:
   ```
   git clone https://github.com/yourusername/clearpath.git
   cd clearpath
   ```

---

#### Step 7 — Copy the ClearPath project files in

Take all the files from this deployment package and copy them into your cloned folder.

Your folder should look exactly like this when done:
```
clearpath/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── .gitignore
├── README.md
├── public/
│   └── favicon.svg
├── api/
│   └── lookup.js
└── src/
    ├── main.jsx
    └── ClearPath.jsx
```

**Important:** Do NOT copy the `node_modules/` or `dist/` folders if they exist.

---

#### Step 8 — Install dependencies

In Terminal, from inside your `clearpath` folder:
```
npm install
```

This downloads React, Vite, and all other dependencies into `node_modules/`.
It takes about 30 seconds. You'll see a progress bar.

---

#### Step 9 — Run it locally to confirm it works

```
npm run dev
```

Your browser should automatically open to **http://localhost:3000** and you'll see ClearPath running.

If the browser doesn't open automatically, open it manually and go to http://localhost:3000.

Press `Ctrl+C` in Terminal to stop the local server when done.

---

### PART 3 — Push to GitHub

---

#### Step 10 — Push your code to GitHub

In Terminal, from your `clearpath` folder:
```
git add .
git commit -m "Initial ClearPath deployment"
git push origin main
```

If it asks for your GitHub username/password, enter them.
(If you have 2FA enabled on GitHub, you'll need to use a Personal Access Token instead of your password —
GitHub will prompt you with instructions.)

Go to your GitHub repo page and refresh — you should see all your files there.

---

### PART 4 — Deploy to Vercel

---

#### Step 11 — Import your repo into Vercel

1. Go to **https://vercel.com/dashboard**
2. Click **Add New → Project**
3. Under "Import Git Repository", find your `clearpath` repo and click **Import**
4. Vercel will auto-detect it as a Vite project
5. Leave all settings as defaults
6. Click **Deploy**

Vercel will build and deploy your app. Takes about 60 seconds.
When done, you'll see a success screen with your live URL — something like:
`https://clearpath-yourusername.vercel.app`

**That URL is your live public website.** Share it with anyone.

---

#### Step 12 — Add your Anthropic API key (unlocks lookup for any company)

Without this, auto-fill only works for the 30 companies in the embedded database.
With this, it works for any public company in the world.

1. Go to **https://console.anthropic.com** and sign in
2. Click **API Keys** → **Create Key**
3. Name it "clearpath-production", copy the key (starts with `sk-ant-...`)
4. Go to your **Vercel dashboard** → click your `clearpath` project
5. Click **Settings** → **Environment Variables**
6. Click **Add New**:
   - Name: `ANTHROPIC_API_KEY`
   - Value: paste your key
   - Environment: check all three (Production, Preview, Development)
7. Click **Save**
8. Go to **Deployments** → click the three dots on your latest deployment → **Redeploy**

The API key is now stored securely on Vercel's servers. It is never visible to users.

---

### PART 5 — Custom domain (optional but recommended)

---

#### Step 13 — Buy a domain

Go to **https://www.namecheap.com** (or Google Domains, Cloudflare Registrar).
Search for a domain — suggestions: `clearpath.tools`, `clearpath.finance`, `getclrpath.com`.
Expect to pay ~$10–15/year.

---

#### Step 14 — Connect the domain to Vercel

1. In your Vercel project, go to **Settings → Domains**
2. Type your domain (e.g. `clearpath.tools`) and click **Add**
3. Vercel will show you DNS records to add
4. Log into your domain registrar (Namecheap etc.), find **DNS Settings**
5. Add the records Vercel shows you (usually one A record and one CNAME)
6. Wait 5–30 minutes for DNS to propagate
7. Vercel will auto-issue an SSL certificate (the padlock in the browser)

Your site is now live at your custom domain with HTTPS. Done.

---

### PART 6 — Ongoing updates

---

#### Step 15 — How to update the app going forward

Whenever you make changes to ClearPath (new features, bug fixes, etc.):

```
git add .
git commit -m "describe what you changed"
git push origin main
```

Vercel automatically detects the push and redeploys within 60 seconds.
Zero downtime — your old version stays live until the new one is ready.

---

## Quick Reference

| Thing | Where |
|---|---|
| Your live site | `https://clearpath-[username].vercel.app` or your custom domain |
| Vercel dashboard | https://vercel.com/dashboard |
| GitHub repo | https://github.com/yourusername/clearpath |
| Anthropic API keys | https://console.anthropic.com |
| Local development | `npm run dev` → http://localhost:3000 |
| Deploy update | `git add . && git commit -m "..." && git push` |

---

## Costs at a glance

| Item | Cost |
|---|---|
| Vercel hosting (Hobby tier) | Free |
| Custom domain | ~$12/year |
| Anthropic API (company lookup) | ~$0.01 per lookup — negligible |
| Total to launch | ~$12/year |

---

## Next features to build

Once live and getting traffic, these are the natural next steps:

1. **PowerPoint export** — already stubbed in the UI, just needs the generator
2. **PDF export** — same, already stubbed
3. **Save & share estimates** — add Supabase for a database + Supabase Auth for login
4. **Paywall** — gate exports behind Stripe, $49–99/month or one-time
5. **CRM leads** — add a "Book a demo / consultation" button that emails you

---

## Troubleshooting

**`npm install` fails:** Make sure Node.js is installed (`node --version`).

**`npm run dev` — port already in use:** Change port in `vite.config.js` from `3000` to `3001`.

**Vercel build fails:** Check the build logs in Vercel dashboard. Most common cause:
a missing file or an import path typo.

**API key not working after adding to Vercel:** Make sure you redeployed after saving the env var.
Env vars only take effect on new deployments.

**Domain not connecting:** DNS changes take up to 48 hours in rare cases. Wait and check again.
