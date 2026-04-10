# IronArman Strava Widget — Deployment Guide

## Files in this project
- `api/strava.js`  → Vercel serverless function (the backend proxy)
- `widget.html`    → The HTML to embed in Wix
- `vercel.json`    → Vercel configuration
- `package.json`   → Project metadata

---

## STEP 1 — Push to GitHub

1. Go to github.com → New repository → name it `ironarman-strava` → Create
2. Upload all these files (drag and drop works)

---

## STEP 2 — Deploy to Vercel

1. Go to vercel.com → Add New Project
2. Import your `ironarman-strava` GitHub repo
3. Click Deploy (no build settings needed)
4. Wait ~30 seconds — you'll get a URL like `ironarman-strava.vercel.app`

---

## STEP 3 — Add Environment Variables in Vercel

In your Vercel project → Settings → Environment Variables, add these 3:

| Name                   | Value                          |
|------------------------|--------------------------------|
| STRAVA_CLIENT_ID       | 222363                         |
| STRAVA_CLIENT_SECRET   | 3cca24b0fc0c40b2c1293452364ec99b6fbbcb95 |
| STRAVA_REFRESH_TOKEN   | 58d52668f8d14a37082ab010cd6137521217b696 |

Then go to Deployments → Redeploy (so it picks up the new variables).

---

## STEP 4 — Test your API

Open this in your browser (replace with your actual Vercel URL):
```
https://ironarman-strava.vercel.app/api/strava?per_page=5
```
You should see JSON with your Strava activities. ✅

---

## STEP 5 — Update widget.html

Open widget.html and replace line:
```
const API_URL = 'https://YOUR-PROJECT.vercel.app/api/strava';
```
with your actual Vercel URL:
```
const API_URL = 'https://ironarman-strava.vercel.app/api/strava';
```

---

## STEP 6 — Embed in Wix

1. Open Wix Editor on ironarman.com
2. Click Add → Embed → HTML iFrame
3. Paste the entire contents of widget.html into the code box
4. Resize the iFrame to fit your Performance Dashboard section
5. Publish ✅

---

## That's it!
The widget auto-refreshes your Strava token — no maintenance needed.
