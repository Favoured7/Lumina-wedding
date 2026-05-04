# Running Lumina Weddings online

## Step-by-step: see the site online (free tier — GitHub + Render)

Use this path once to get a **public URL** like `https://lumina-weddings.onrender.com`. Put your code on GitHub either with **Git on the PC** or with **GitHub in the web browser** (upload files — no Git install). See **GitHub web only** below.

### If you **already** have old files on GitHub

That’s normal — you’re **replacing/updating** that repo with your **current** computer folder (`claudett22243560luminaweddin_251`), which has the newer Lumina work (contact form, deployment, API fixes, etc.).

- **Don’t upload `node_modules`** — it makes the repo huge; Render installs deps during deploy. The project’s `.gitignore` excludes it.
- **`node_modules` on GitHub now:** delete that folder from the repo (GitHub → browse into `node_modules` → delete files/folders, or remove with Git: `git rm -r --cached node_modules` then push).
- **`.hg` folder:** Mercurial metadata — shouldn’t be on GitHub. Delete it from the repo on the web, or it stays ignored next time if you use Git with this project’s `.gitignore`.

**Two ways to refresh GitHub:**

1. **Git on PC — clone → copy → commit → push** (step-by-step below).
2. **GitHub web only:** delete outdated/large items (`node_modules`, `.hg`) then **Add file → Upload files** and upload your **current** `backend`, `frontend`, and root files (`package.json`, `render.yaml`, `Dockerfile`, `DEPLOYMENT.md`, `.gitignore`, …) — again **no** `node_modules**.

Then continue with **Part B (Render)** below so the **live** site builds from the updated repo.

#### GitHub **web only** (you did **not** install Git)

This works entirely in the browser.

1. Open your repo on [GitHub](https://github.com/Favoured7).
2. If **`node_modules`** or **`.hg`** are still in the tree, delete them from the repo (open the folder, delete files until those folders are gone — it can take many clicks for large trees).
3. **Add file** → **Upload files**.
4. From your PC folder `claudett22243560luminaweddin_251`, drag in:
   - the **`backend`** folder,
   - the **`frontend`** folder,
   - every **root file** (`package.json`, `render.yaml`, `Dockerfile`, `DEPLOYMENT.md`, `.gitignore`, `.dockerignore`, …).
5. **Never** upload **`node_modules`** — skip that folder.
6. Commit with a message like `Update Lumina` → **Commit changes**.

Then go to **Part B (Render)**. Same result as using Git on the PC; updates are just slower to upload by hand.

#### Clone → copy → commit → push (Windows PowerShell — requires Git installed)

Use this to replace what’s on GitHub with your **current** Lumina folder (here called `claudett22243560luminaweddin_251`). Adjust paths if yours differ.

1. **Install Git** once: [git-scm.com/download/win](https://git-scm.com/download/win).

2. Open **PowerShell**. Pick a parent folder, e.g. your Desktop:

```powershell
cd $env:USERPROFILE\OneDrive\Desktop
```

3. **Clone** your existing repo (change `Lumina-wedding` if your repo name is different):

```powershell
git clone https://github.com/Favoured7/Lumina-wedding.git lumina-gh-update
cd lumina-gh-update
```

4. **Empty the clone** but **keep** the hidden `.git` folder (that’s your link to GitHub):

```powershell
Get-ChildItem -Force | Where-Object { $_.Name -ne '.git' } | Remove-Item -Recurse -Force
```

5. **Copy** your current project **into this folder**, skipping `node_modules` and `.hg`. Replace the first path with your real project path:

```powershell
$src = "$env:USERPROFILE\OneDrive\Desktop\lumina\claudett22243560luminaweddin_251"
robocopy $src . /E /XD node_modules .hg /NFL /NDL /NJH /NJS
```

(`robocopy` prints numbers — exit code `0` or `1` usually still means OK.)

6. **Commit and push:**

```powershell
git add .
git status
git commit -m "Update Lumina Weddings (latest full-stack)"
git branch -M main
git push -u origin main
```

7. Sign in if Git asks (browser or **Personal Access Token**). Refresh GitHub — you should see the new files (and **no** `node_modules` if `.gitignore` is present).

If **`git push`** fails with “rejected” or “non-fast-forward”, someone else changed the repo or the histories differ. Try:

```powershell
git pull origin main --rebase
git push origin main
```

Resolve any conflict messages Git prints (or ask for help with the exact error text).

---

### Part A — Put the code on GitHub (new empty repo)

1. **Install Git** (one-time): [https://git-scm.com/download/win](https://git-scm.com/download/win) — accept defaults.
2. Open **GitHub** in the browser → log in → **New repository**.
   - Name it e.g. `lumina-weddings` (or use your existing [Lumina-wedding](https://github.com/Favoured7/Lumina-wedding) repo if it’s empty).
   - Leave **empty**: no README, no `.gitignore`, no license (avoids conflicts).
   - Click **Create repository**.
3. On your PC, open **PowerShell** in your project folder (`claudett22243560luminaweddin_251`).
4. Run **exactly** (replace `YOUR-REPO` with the repo name you created):

```powershell
git init
git branch -M main
git add .
git commit -m "Deploy Lumina Weddings"
git remote add origin https://github.com/Favoured7/YOUR-REPO.git
git push -u origin main
```

5. If GitHub asks you to log in, use the browser login or a **Personal Access Token** (GitHub → Settings → Developer settings → Tokens).
6. Refresh your repo page — you should see your files.  
   **Optional:** delete Git only on your PC: remove the hidden `.git` folder in the project directory — **your GitHub repo stays online.**

### Part B — Host it free on Render

7. Go to [https://render.com](https://render.com) → **Sign up** → choose **Connect GitHub** and allow access to your repos.
8. **New** → **Blueprint** → pick **`Favoured7`** / **`YOUR-REPO`**.
   - Render reads `render.yaml` and sets **build** and **start** commands.
   - Pick the **Free** instance type if offered.
9. Click **Apply** / **Create**. Wait for the first deploy (several minutes).
10. When it finishes, open the **URL** Render shows (e.g. `https://lumina-weddings.onrender.com`).  
    If login or API fails, open **Environment** on Render and add:
    - **`JWT_SECRET`** — any long random string (at least 32 characters).
    - **`CLIENT_ORIGIN`** — your Render URL **exactly**, e.g. `https://lumina-weddings.onrender.com`  
      Then **Manual Deploy → Deploy latest**.
11. **Seed demo data once** (optional): Render dashboard → your Web Service → **Shell**, run:

```bash
npm --prefix backend run seed
```

12. Test: visit **`/api/health`** on your URL and open the **home page**.  
    **Login:** after seed, admin is `admin@luminaweddings.rw` / `Admin123!` — change this for anything public-facing.

**Notes:** Free Render apps **sleep when idle** — the first load after sleep may take ~30–60 seconds. SQLite on free tiers may reset if the disk is recreated; for permanent data later, use Render Postgres + `DATABASE_URL`.

---

## What is included

- **One Node server** can host both the **API** and the **production React build** (same site, same cookies for login).
- **Health check:** `GET /api/health`
- **Development:** `npm run dev` from the repo root (Vite + API). The frontend uses `VITE_API_URL=http://localhost:3000` (see `frontend/.env.example`).

## Production: build and start (VPS, VM, or single container)

1. **Environment** — copy `backend/.env.example` to `backend/.env` and set at least:
   - `JWT_SECRET` — long random string (not the example value).
   - `CLIENT_ORIGIN` — your public site URL(s), comma-separated, e.g. `https://app.yourdomain.com` (add `http://localhost:5173` only for local dev testing).
   - `DATABASE_URL` — default SQLite file works for demos; for persistent hosted data use PostgreSQL/MySQL and set `DATABASE_URL` accordingly (already supported by Sequelize).
   - Optional: Gmail fields for contact-form alerts (`GMAIL_USER`, `GMAIL_APP_PASSWORD`, `LUMINA_CONTACT_NOTIFY_EMAIL`).

2. **Install and seed (first deploy):**
   ```bash
   npm install --prefix backend
   npm install --prefix frontend
   npm run build
   npm --prefix backend run seed
   ```

3. **Start:**
   ```bash
   npm start
   ```
   This runs the backend with `NODE_ENV=production` and serves `frontend/dist`. Open port **3000** (or set `PORT`).

4. **Admin login** — after seed: use `admin@luminaweddings.rw` / `Admin123!` once, then change the password strategy or rotate credentials in production.

## Docker

From the repository root:

```bash
docker build -t lumina-weddings .
docker run --rm -p 3000:3000 --env-file backend/.env lumina-weddings
```

Mount a volume for SQLite if you use the default `DATABASE_URL=sqlite:./lumina.sqlite` (path must be consistent inside the container).

## Split hosting (e.g. Netlify + Railway)

- Deploy the **API** and set `CLIENT_ORIGIN` to your **Netlify** site URL.
- Build the frontend with `VITE_API_URL=https://your-api-host` in `frontend/.env` so the browser calls the correct API.
- Use **HTTPS** on both; login cookies use `Secure` in production.

## Checklist before sharing the public link

- [ ] Unique `JWT_SECRET` in production.
- [ ] `CLIENT_ORIGIN` matches the exact browser origin of your site.
- [ ] `npm run build` completed and `frontend/dist` exists when not using Docker (Dockerfile runs the build for you).
- [ ] Run `GET /api/health` and open the home page in a browser.

## Going online **without Git**

Many “one-click” hosts expect a connected Git repo. If you prefer **not** to use Git, use one of these:

### A. Copy the project to a VPS (full control)

1. Zip your project folder (you can exclude `node_modules` and `frontend/dist` to keep it small).
2. Upload and unzip on a Linux server (FTP, SCP, or your host’s file manager).
3. Install Node 20+, then from the project root run `npm install --prefix backend`, `npm install --prefix frontend`, `npm run build`, configure `backend/.env`, then `npm start` (or use **PM2** so it stays running).
4. Point your domain (or the server’s IP) to port **3000** behind **Nginx** + HTTPS.

### B. Docker on any host that runs containers

On your machine (with Docker installed), from the project root:

```bash
docker build -t lumina-weddings .
```

Push that image to your host’s registry **through their website or Docker Desktop** (no Git required), then run the container with your env vars and publish port **3000**.

### C. Optional later

If you ever want automatic deploys from [GitHub](https://github.com/Favoured7), that is optional—not required for this project to work locally or on a server.
