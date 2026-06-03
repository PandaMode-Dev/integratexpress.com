# Publish tonight — GitHub Pages + Squarespace forms

Your **marketing site** runs from GitHub. **Form submissions** are collected in Squarespace when you set the form page URL in `assets/js/site-config.js`.

---

## Part A — Squarespace form (≈15 minutes)

Do this first so you have a URL to paste into the config file.

1. Log in at [squarespace.com](https://www.squarespace.com).
2. **Pages → + → Page** → name it **Get Started** (slug `/get-started` if you can).
3. Add a **Form** block with these fields:

   | Field | Type | Required |
   |-------|------|----------|
   | First name | Text | Yes |
   | Last name | Text | Yes |
   | Email | Email | Yes |
   | Phone | Phone | No |
   | Services of interest | Checkbox | No |
   | Project details | Text area | Yes |

   Checkbox options: ERP Integration, Infrastructure, Change Management, Cloud Migration, Accounting, Other.

4. **Form settings → Storage:** email notifications to `Services@IntegrateXpress.com`.
5. **Publish** the Squarespace site (even a minimal one-page site is fine).
6. Copy the **full public URL** of that page, e.g.  
   `https://yoursite.squarespace.com/get-started`  
   or `https://www.integratexpress.com/get-started` if the domain still points to Squarespace for that path.

7. Open `assets/js/site-config.js` in this folder and set:

   ```javascript
   window.INTEGRATEXPRESS_SQUARESPACE_FORM_URL = "https://YOUR-ACTUAL-SQUARESPACE-URL/get-started";
   ```

8. Save the file.

Visitors on **get-started.html** will see your page design on the left and the Squarespace form embedded on the right. Submissions show in **Squarespace → Analytics / Form & Button Conversions** (or Form storage).

---

## Part B — GitHub Pages (≈20 minutes)

### 1. Create the repository

1. Go to [github.com/new](https://github.com/new).
2. Repository name: e.g. `integratexpress-website`.
3. **Public** → Create repository (empty, no README).

### 2. Push this folder

In PowerShell (from this `Website` folder):

```powershell
cd "c:\Users\aguzm\Downloads\Website\Website"
git init
git add .
git commit -m "Publish IntegrateXpress site for GitHub Pages"
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/integratexpress-website.git
git push -u origin main
```

Replace `YOUR-GITHUB-USERNAME` and repo name with yours.

### 3. Turn on GitHub Pages

1. GitHub repo → **Settings → Pages**.
2. **Source:** Deploy from branch **main**, folder **/ (root)**.
3. Save. Wait 2–5 minutes.
4. Open `https://YOUR-GITHUB-USERNAME.github.io/integratexpress-website/` and click through pages.

### 4. Custom domain (your domain)

1. Copy `CNAME.example` to a new file named **`CNAME`** (no extension).
2. Edit `CNAME` — one line, your real hostname, usually:

   ```
   www.integratexpress.com
   ```

3. Commit and push:

   ```powershell
   git add CNAME assets/js/site-config.js
   git commit -m "Add custom domain and Squarespace form URL"
   git push
   ```

4. GitHub repo → **Settings → Pages → Custom domain** → enter `www.integratexpress.com` → Save → enable **Enforce HTTPS** when offered.

5. At your **domain registrar** (or Squarespace DNS if the domain is managed there), set:

   | Type | Host | Value |
   |------|------|--------|
   | CNAME | `www` | `YOUR-GITHUB-USERNAME.github.io` |

   GitHub shows the exact CNAME target under Pages settings.

   For **apex** (`integratexpress.com` without www), GitHub documents A records — or redirect apex → www at your registrar.

---

## Part C — Domain already on Squarespace

You cannot have the **same** hostname serving both Squarespace and GitHub at once. Pick one:

### Option 1 — Main site on GitHub (recommended)

- Point **`www`** DNS to GitHub (CNAME above).
- Keep a **Squarespace** site only for the form:
  - Use URL like `https://YOURSITE.squarespace.com/get-started`, **or**
  - Subdomain `forms.integratexpress.com` → Squarespace (CNAME to Squarespace).
- Paste that URL into `site-config.js`.

### Option 2 — Form on Squarespace subdomain tonight (fastest)

1. Squarespace → **Settings → Domains → Add subdomain** → `forms` → `forms.integratexpress.com`.
2. Form page URL: `https://forms.integratexpress.com/get-started`.
3. Put that in `site-config.js`.
4. Point **`www`** to GitHub for the main site.

---

## Part D — Verify before you go live

- [ ] Home page loads, video plays, images show.
- [ ] All nav links work.
- [ ] **Get Started** shows Squarespace form (after URL is in `site-config.js`).
- [ ] Submit a test entry → appears in Squarespace form storage / email.
- [ ] Phone `tel:` and email `mailto:` links work on Contact.
- [ ] HTTPS padlock on your domain (may take up to 24h; often minutes).

---

## Updating the site later

```powershell
cd "c:\Users\aguzm\Downloads\Website\Website"
# edit files, then:
git add .
git commit -m "Describe your change"
git push
```

GitHub Pages redeploys automatically in 1–3 minutes.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| 404 on pages except home | Repo must deploy from **root** `/`, not `/docs`. |
| Images broken | File names are case-sensitive; keep names exactly as in HTML. |
| Form still opens email app | `INTEGRATEXPRESS_SQUARESPACE_FORM_URL` is empty — set it and push. |
| Squarespace iframe blank | Form page must be **published**; URL must be exact. Some Squarespace plans block embedding — use redirect: link button to Squarespace URL in new tab instead. |
| Domain shows old Squarespace site | DNS can take 1–48 hours; clear browser cache; check CNAME at [dnschecker.org](https://dnschecker.org). |

---

## If Squarespace blocks the iframe

Change get-started to open the form in the same window: set nav CTA links to your Squarespace URL directly, or ask for a one-line redirect added to `get-started.html`.
