# Austria Tech Masters Tracker

A self-contained project tracking Austrian Master's programmes in Computer
Science, Data Science, AI, Cybersecurity, Cloud Computing, Computer
Engineering and Software Engineering — deadlines, fees, teaching language,
and direct links to each institution's application portal.

```
austria-masters-project/
├── frontend/            static HTML/CSS/JS page (works standalone, no build step)
│   └── index.html
├── backend/              tiny FastAPI service that serves the dataset as JSON
│   ├── app.py
│   └── requirements.txt
├── scraper/               change-detection scraper (see "How updates work" below)
│   ├── scrape.py
│   ├── sources.json      list of URLs to monitor per programme
│   └── requirements.txt
├── data/
│   ├── programs.json      ← the single source of truth for all programme data
│   ├── meta.json           written by the scraper: last run time, warnings
│   ├── snapshots/          raw text snapshots of each monitored page
│   ├── review_needed.json  machine-readable diff report from the last scrape
│   └── REVIEW_NEEDED.md    human-readable version of the same report
├── scripts/
│   └── build_frontend.py  syncs data/programs.json → frontend's embedded fallback
└── .github/workflows/
    └── update.yml          runs the scraper weekly, opens a PR if pages changed
```

---

## 1. Quick start (just view it)

The frontend works **completely standalone** — open `frontend/index.html` in
a browser and it renders using the data embedded directly in the file. No
server, no build step, no internet required (other than the "Apply here" /
"Programme details" links, which are just normal outbound links).

This is the same page already published as a Claude artifact; this project
just gives you the source, plus the machinery to keep it current yourself.

## 2. Running the full stack locally (live data)

```bash
# 1. Backend
cd backend
uv pip install -r requirements.txt
uvicorn app:app --reload --port 8000
# now visit http://localhost:8000/api/programs and http://localhost:8000/docs

# 2. Frontend
# open frontend/index.html in a text editor and change:
#     const API_BASE_URL = "";
# to:
#     const API_BASE_URL = "http://localhost:8000";
# then open frontend/index.html in a browser (or run any static file server,
# e.g. `python3 -m http.server` from inside frontend/, and visit it)
```

With `API_BASE_URL` set, the page fetches `/api/programs` and `/api/meta` on
load and shows a badge ("Live data · last scraped …"). If the backend isn't
reachable for any reason, it silently falls back to the embedded snapshot —
**the page never breaks**, it just tells you which data source it's using.

## 3. Deploying it for real

- **Frontend**: any static host works (GitHub Pages, Netlify, Vercel,
  Cloudflare Pages, S3+CloudFront, or just keep publishing it as a Claude
  artifact). It's one HTML file.
- **Backend**: any place that can run a small Python process — Render,
  Railway, Fly.io, a `$5/mo` VPS, or a serverless function wrapping the same
  FastAPI app. Set the `ADMIN_TOKEN` environment variable in production so
  `/api/refresh` isn't world-writable.
- Point the deployed frontend's `API_BASE_URL` at the deployed backend's URL.

---

## 4. How "always updating" actually works

Be realistic about what's automatable here: Austrian university admissions
pages are wildly inconsistent — different languages, different structures,
deadlines sometimes only in a linked PDF, some pages split EU vs. non-EU
deadlines and some don't. A scraper that tries to auto-extract "the new
deadline" with regex across 25+ different sites *will* eventually parse
something wrong and silently corrupt the dataset. That's worse than stale
data. So this project uses a **change-detection + human-confirmation**
model instead of a fully autonomous one:

1. **`scraper/scrape.py`** fetches every URL listed in `scraper/sources.json`
   (one entry per tracked programme), strips it down to visible text, and
   compares it against the last saved snapshot in `data/snapshots/`.
2. If a page's text changed at all, the scraper pulls out just the
   lines near "watch keywords" (deadline, Bewerbungsfrist, tuition,
   Studiengebühr, etc.) from both the old and new version, and writes a
   before/after diff to `data/REVIEW_NEEDED.md` and `data/review_needed.json`.
3. It **never edits `data/programs.json` automatically.** You (or anyone
   with write access) read the diff, open the actual page, confirm what
   changed, and hand-edit the relevant entry in `data/programs.json`.
4. Run `python3 scripts/build_frontend.py` afterwards to sync your edit
   into `frontend/index.html`'s embedded fallback, then commit both files.

### Keeping this running unattended

`.github/workflows/update.yml` runs `scraper/scrape.py` every Monday
(cron: `0 6 * * 1`, editable) via GitHub Actions — free on public repos,
and free for a generous quota on private ones. If any monitored page
changed, it **opens a Pull Request** containing the new snapshots and the
`REVIEW_NEEDED.md` report, so review becomes "read a PR, confirm a date,
edit one JSON file, merge" rather than "remember to check 25 websites
yourself." If nothing changed, it exits quietly — no noise, no PR.

You can also trigger a run manually any time from the repo's **Actions**
tab ("Run workflow" button) — useful right before a deadline you know is
coming up, without waiting for Monday.

### If you want it fully live (no manual review step)

If at some point you're confident enough in structured data for a specific
institution (e.g. one that exposes deadlines via a JSON API or a very
consistently formatted page), you can extend `scrape.py` to parse and write
directly into `data/programs.json` for *that specific source* — the
architecture supports mixing "trusted, auto-updated" sources with
"flag-for-review" ones. That's a deliberate future extension, not something
this project does by default, because guessing wrong here means someone
misses a real deadline.

---

## 5. Adding a new programme

1. Add an entry to `data/programs.json` (copy the shape of an existing one).
2. Add a matching entry to `scraper/sources.json` so it gets monitored going
   forward.
3. Run `python3 scripts/build_frontend.py` to sync the frontend.
4. Commit all three files.

## 6. Data model

Each entry in `data/programs.json` has (see any existing entry for the full
shape): `title`, `inst`, `field`, `status` (`open`/`soon`/`unknown`/`closed`),
`sortDate`, `deadlineEU`, `deadlineNonEU`, `windowLabel`, `desc`, `tags`,
`lang`, `url` (programme info page), `applyUrl` (institution's application
portal), `feeEU`, `feeEUNote`, `feeNonEU`, `feeNonEUNote`, `feeApp`,
`feeFree`.

`status` drives the grouping/sort order on the page (open → opening soon →
check current window → closed); `sortDate` drives ordering *within* a group,
and by convention is set to the **non-EU/third-country deadline** where the
two differ, since that's the tighter constraint applicants face.

## 7. Limitations, honestly

- The scraper flags *page changed*, not *deadline changed specifically* —
  a page could change for an unrelated reason (a typo fix, a new photo) and
  still get flagged. That's an acceptable false-positive rate for the
  safety it buys.
- 25 institutional pages is a moderate but real list; keeping
  `scraper/sources.json` current as universities restructure their sites
  is an ongoing task, not a one-time setup.
- Some institutions (noted directly in `data/programs.json` via
  `feeEUNote`/`feeNonEUNote`/status `"unknown"`) don't publish clean,
  single-source-of-truth deadlines at all — those need periodic manual
  re-verification regardless of tooling.
