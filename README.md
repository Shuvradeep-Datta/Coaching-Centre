# Student Management Portal

A React + Vite + Tailwind CSS portal for a school (classes 5–10). All data is stored
in the browser's `localStorage`, so it persists on the device with no backend.

## Features
- **Dashboard** — stat cards, students-per-class bar chart, unpaid-fee alerts.
- **Students** — add / edit / delete, class filter pills, search, sortable table.
- **Fees** — per-month, per-class fee tracking with WhatsApp + SMS reminder buttons
  (Banglish message template). The browser can't auto-send SMS — the buttons just
  pre-fill the messaging app; you tap Send.
- **Attendance** — daily Present/Absent marking with All-present / All-absent shortcuts.
- **Reports** — month-wise fee collection + per-student attendance % with colored bars.
- **Settings** — school name / default fee / country code, CSV export (UTF-8 BOM),
  full JSON backup and restore.

## Run it

```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build into dist/
npm run preview  # preview the production build
```

### ⚠️ Windows note — NODE_ENV
This machine has `NODE_ENV=production` set globally, which makes npm skip
`devDependencies` (Vite, Tailwind). If `npm install` only pulls a handful of
packages, run it in development mode for this project:

```powershell
$env:NODE_ENV="development"; npm install
$env:NODE_ENV="development"; npm run dev
```

## Deploy to GitHub Pages

The build uses relative asset paths (`base: './'` in `vite.config.js`), so it works
on GitHub Pages under any repo name. `npm run deploy` pushes **only the `dist/` folder**
to a separate `gh-pages` branch — your source stays on `main`.

### One-time setup

1. Create an empty repo on GitHub (e.g. `student-portal`) — no README.
2. Init git and push your source to `main`:

   ```powershell
   cd C:\Users\2101897\student-portal
   git init
   git add .
   git commit -m "Student Management Portal"
   git branch -M main
   git remote add origin https://github.com/<your-username>/student-portal.git
   git push -u origin main
   ```

### Deploy (only the dist folder)

```powershell
$env:NODE_ENV="development"   # this machine skips devDeps without it
npm run deploy
```

`npm run deploy` runs `predeploy` (builds into `dist/`) then `gh-pages -d dist`, which
force-pushes only the built files to the `gh-pages` branch.

3. Enable Pages: GitHub repo → **Settings → Pages** → Source = **Deploy from a branch**
   → Branch = **`gh-pages`** / `/ (root)` → Save.

Your site goes live at `https://<your-username>.github.io/student-portal/` in a minute or two.

### Re-deploying later

Just run `npm run deploy` again after making changes — it rebuilds and re-pushes automatically.

**Notes**
- `npm run deploy` needs the git remote from step 2 already set.
- On this machine, keep the `$env:NODE_ENV="development"` prefix or the build tools won't be found.

## Tech
- React 18, Vite 6, Tailwind CSS v4 (`@tailwindcss/vite` plugin).
- Custom theme colors defined in `src/index.css` via `@theme`.
- Data layer in `src/lib/storage.js`; helpers in `src/lib/utils.js`.
