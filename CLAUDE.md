# CLAUDE.md — Liberty Life Perth Website

> This file is the authoritative spec for the Liberty Life Perth church website.
> Read it fully before writing any code. All architectural decisions are documented here.

---

## Project overview

**Church:** Liberty Life Perth  
**Tagline:** "A church where you're not a member but you're family"  
**Location:** Perth, Western Australia  
**Domain:** libertylifeperth.org (main) — libertylifecentre.org, libertylifecentre.com, libertylifeperth.com redirect to main  
**Address:** Unit 1/16 Roxby Ln, Willetton WA 6155  
**Purpose:** Public-facing church website for first-time visitors and regular attendees

---

## Tech stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 16.2.6 (App Router) | Use App Router, not Pages Router. Turbopack enabled by default. |
| Language | TypeScript 5 | Strict mode enabled |
| Styling | Tailwind CSS v4 | **No tailwind.config.ts** — brand tokens live in `globals.css` `@theme` block |
| CMS | Sanity v3 (via `next-sanity`) | Content for testimonies, pages, staff, announcements |
| Church data | Planning Center API | Events, groups, giving — via REST + Basic Auth |
| Hosting | AWS Amplify | Git-push deploys, auto SSL, CDN. Config in `amplify.yml` |
| Email (transactional) | Nodemailer + Gmail SMTP | Contact form + prayer requests + testimony notifications via `webadmin@libertylifeperth.org` |
| Email (mailboxes) | Google Workspace (Nonprofits) | Applied for free nonprofit plan — pending approval. Legal entity: Liberty Christian Centre Inc (ABN 81 763 203 730) |
| AI | Anthropic Claude Haiku | Prayer request pipeline (3-stage) + testimony moderation |
| Video | YouTube embeds + Sanity CDN | Hero background video hosted as Sanity file asset |
| Analytics | None initially | Add later if needed |

**Runtime:** Node.js v24.3.0  
**React:** 19.2.4

---

## Brand

### Colours

Defined in `app/globals.css` `@theme` block (Tailwind v4 pattern — not in a config file):

```css
@theme {
  --color-navy: #1E1B5E;
  --color-navy-dark: #16144A;
  --color-rosegold: #C9956A;
  --color-rosegold-light: #d9a87d;
}
```

Use as Tailwind utilities: `bg-navy`, `text-rosegold`, `border-navy-dark`, etc.

### Typography

Also in `@theme`:

```css
--font-sans: "Inter", system-ui, sans-serif;
--font-display: "Cormorant Garamond", Georgia, serif;
```

Loaded via `next/font/google` in `app/layout.tsx` (Inter + Cormorant Garamond, weights 400 and 500).  
Use `font-display` for headings/hero, `font-sans` for body (default).

### Logo

- File: `public/logo-no-bg.png` — transparent background, 1920×1080, used in Nav (`h-28 w-auto`) and Footer (`h-16 w-auto`)
- Old file `public/logo-white.png` still exists but no longer used
- The circular motif is echoed as decorative background rings in hero/CTA sections

### Design principles

- Navy + rose gold throughout — never use off-brand colours
- Circle motif as subtle background decoration in dark sections (concentric border rings)
- Warm, personal tone — small church, not corporate
- Mobile-first — base Tailwind classes are mobile, `md:` and `lg:` for larger screens

---

## Project structure

```
libertylifeperth/
├── app/
│   ├── layout.tsx              # Root layout, loads fonts, renders Nav + Footer
│   ├── globals.css             # @import tailwindcss + @theme brand tokens
│   ├── page.tsx                # Home (ISR, revalidate 3600s)
│   ├── about/
│   │   └── page.tsx            # SSG (revalidate: false)
│   ├── announcements/
│   │   └── page.tsx            # Dynamic — active announcements from Sanity (auto-expires)
│   ├── testimonies/
│   │   ├── page.tsx            # Testimony list (dynamic, 12/page, paginated)
│   │   ├── [slug]/
│   │   │   └── page.tsx        # Individual testimony (revalidate: 60)
│   │   └── submit/
│   │       ├── page.tsx        # SSG shell
│   │       └── TestimonySubmitForm.tsx  # "use client" form with image upload
│   ├── events/
│   │   └── page.tsx            # SSR (dynamic: force-dynamic) — Planning Center
│   ├── give/
│   │   └── page.tsx            # ISR (revalidate: 60)
│   ├── contact/
│   │   ├── page.tsx            # ISR (revalidate: 60) — pulls from siteSettings
│   │   └── ContactForm.tsx     # "use client" form component
│   ├── studio/
│   │   └── [[...tool]]/
│   │       └── page.tsx        # Embedded Sanity Studio ("use client")
│   └── api/
│       ├── contact/
│       │   └── route.ts        # POST → Nodemailer (Gmail SMTP). Accepts type="prayer" for subject line
│       ├── prayer/
│       │   ├── route.ts        # POST → 3-stage Claude Haiku pipeline + emails
│       │   ├── prompts.ts      # Stage 1/2/3 system prompts
│       │   ├── fallback.ts     # Hardcoded fallback prayer response
│       │   └── types.ts        # TypeScript types for the pipeline
│       ├── testimonies/
│       │   ├── submit/
│       │   │   └── route.ts    # POST → LLM moderation + Sanity write + team email
│       │   └── approve/
│       │       └── route.ts    # GET → patch testimony status to published + revalidate
│       ├── events/
│       │   └── route.ts        # GET → Planning Center proxy (revalidate 3600)
│       └── revalidate/
│           └── route.ts        # POST → Sanity webhook → revalidateTag
├── components/
│   ├── layout/
│   │   ├── Nav.tsx             # Fixed header, mobile hamburger ("use client")
│   │   └── Footer.tsx          # 3-column footer, social links
│   ├── home/
│   │   ├── Hero.tsx            # Video banner hero — fetches video URLs from siteSettings (async server component)
│   │   ├── ServiceBar.tsx      # Service times / location / YouTube strip — from siteSettings
│   │   ├── WhatToExpect.tsx    # Tagline + social icons + 5-card grid — from siteSettings
│   │   ├── UpcomingEvents.tsx  # List of upcoming Planning Center events
│   │   └── GiveCta.tsx         # Dark section with give button — from siteSettings
│   ├── testimonies/
│   │   └── TestimonyCard.tsx   # Card with image, title, truncated body, Read more link
│   ├── prayer/
│   │   └── VerseCard.tsx       # Bible verse card with BibleGateway link
│   ├── events/
│   │   └── EventItem.tsx       # Event article with date badge, location, register link
│   └── ui/
│       ├── Button.tsx               # primary / outline / ghost variants, Link or button
│       ├── PageBanner.tsx           # Reusable page banner — eyebrow, title, optional background image + overlay
│       ├── PrayerRequestButton.tsx  # "use client" button + modal (3-stage AI pipeline)
│       └── SectionHeader.tsx        # eyebrow + title + subtitle pattern
├── lib/
│   ├── sanity/
│   │   ├── client.ts           # sanityClient (read) + sanityWriteClient (@sanity/client, not next-sanity)
│   │   ├── queries.ts          # All GROQ queries — keep centralised here
│   │   └── image.ts            # urlFor() using createImageUrlBuilder (named export)
│   └── planningcenter/
│       ├── client.ts           # pcFetch() — Basic Auth, server-side only
│       └── types.ts            # PCEvent, PCEventsResponse TypeScript types
├── sanity/
│   ├── schemaTypes/
│   │   ├── sermon.ts           # Kept in schema (not used in nav/pages) — easy to restore
│   │   ├── sermonSeries.ts
│   │   ├── testimony.ts        # NEW — public testimonies with status workflow
│   │   ├── staff.ts
│   │   ├── page.ts
│   │   ├── siteSettings.ts
│   │   ├── announcement.ts
│   │   └── index.ts            # Exports schemaTypes array
│   └── sanity.config.ts        # Sanity Studio config (structure + vision plugins)
├── public/
│   ├── logo-no-bg.png
│   ├── testimonies.png         # Fallback banner image (overridable via siteSettings)
│   ├── announcements.png
│   ├── events.png
│   └── give.jpg
├── amplify.yml                 # AWS Amplify build config
├── .env.local.example          # Copy to .env.local and fill in real values
├── next.config.ts              # images.remotePatterns for cdn.sanity.io
├── postcss.config.mjs          # @tailwindcss/postcss plugin
└── CLAUDE.md
```

---

## Environment variables

Copy `.env.local.example` to `.env.local` and fill in real values before running `npm run dev`:

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=       # Get from sanity.io/manage
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=                    # Read (Viewer) token — create in Sanity project settings
SANITY_WRITE_TOKEN=                  # Editor token — create in Sanity project settings → API → Tokens
SANITY_WEBHOOK_SECRET=               # Any random string — set the same in Sanity webhook config

# Planning Center
PLANNING_CENTER_APP_ID=              # From api.planningcenteronline.com/oauth/applications
PLANNING_CENTER_SECRET=

# Contact form email (Gmail SMTP via Nodemailer)
CONTACT_EMAIL_FROM=                  # Gmail address used to send (e.g. webadmin@libertylifeperth.org)
CONTACT_EMAIL_APP_PASSWORD=          # Gmail App Password (Google Account → Security → App Passwords)
CONTACT_EMAIL_TO=                    # Email address(es) that receive messages — comma-separate for multiple

# Anthropic (prayer request pipeline + testimony moderation)
ANTHROPIC_API_KEY=                   # From console.anthropic.com

# Testimonies
TESTIMONY_APPROVE_SECRET=            # Any random string — secures the approve endpoint

# App
NEXT_PUBLIC_SITE_URL=https://libertylifeperth.org
```

> **Build note:** The app builds successfully without real env vars (Sanity falls back to
> `"placeholder"` projectId). Pages that depend on Sanity will show empty/fallback states until real credentials are set.

> **Amplify runtime env vars:** Amplify SSR Lambda functions do not have access to `process.env` from the console at runtime. The `amplify.yml` build step pipes env vars into `.env.production` before `npm run build` so Next.js API routes can read them. Always add new server-side env vars to the grep pattern in `amplify.yml`. Current pattern: `CONTACT_EMAIL|SANITY|PLANNING_CENTER|NEXT_PUBLIC|ANTHROPIC|TESTIMONY`

---

## Sanity content types

| Type | Who edits | Key fields |
|---|---|---|
| `testimony` | Public (pending→review) / Admin (direct) | title, slug, authorName, authorEmail, body, image, youtubeUrl, status, source, submittedAt |
| `staff` | Admin | name, role, photo, bio, order |
| `siteSettings` | Admin | siteName, tagline, address, serviceTimeLabel, serviceTime, serviceTime2Label, serviceTime2, contactEmail, socialLinks, heroVideoMp4, heroVideoWebm, testimoniesImage, announcementsImage, eventsImage, giveImage, bankDetails, whatToExpect, giveCta |
| `page` | Admin | title, slug, body (rich text) — used for About story, beliefs, Give copy |
| `announcement` | Pastor / admin | title, body, publishedAt, expiresAt |

> **Sermons removed:** `sermon` and `sermonSeries` schema files still exist on disk but are not registered in `sanity/schemaTypes/index.ts` and do not appear in Studio. Keep the files for easy restoration if needed.

**Testimony status workflow:**
- `pending` — submitted by public, awaiting review
- `published` — visible on `/testimonies`
- `rejected` — hidden, stays in Sanity for reference

**Page slugs expected by queries:**
- `about` — About page story (`getAboutPage`)
- `beliefs` — What we believe section (`getAboutPage`)
- `give` — Give page copy (`getGivePage`)

---

## Testimonies feature

### Public submission flow
1. Visitor fills in form at `/testimonies/submit` (name, email optional, title, body, image optional, YouTube URL optional)
2. POST to `/api/testimonies/submit` — Claude Haiku screens for spam/abuse/profanity
3. If rejected by LLM: gentle error message shown, no document created
4. If approved by LLM: document created in Sanity with `status: "pending"`, team email sent
5. Team email contains a **"Review in Studio"** button linking to `/studio` — editor reviews image and content, then sets status to `published` manually

### Approve via API (alternative path)
`GET /api/testimonies/approve?id=DOCUMENT_ID&secret=TESTIMONY_APPROVE_SECRET`  
Patches the document to `status: "published"` and calls `revalidateTag("testimony", { expire: 0 })`.  
Returns a branded HTML page (not JSON) since it's opened in a browser.

### Image upload gotcha
`sanityWriteClient.assets.upload()` from `@sanity/client` fails with 403 inside Next.js API routes even with a valid Editor token. Use raw `fetch()` to the Sanity assets endpoint instead:
```ts
await fetch(`https://${projectId}.api.sanity.io/v2024-01-01/assets/images/${dataset}?filename=...`, {
  method: "POST",
  headers: { Authorization: `Bearer ${process.env.SANITY_WRITE_TOKEN}`, "Content-Type": imageFile.type },
  body: buffer,
})
```

### Write client
`sanityWriteClient` in `lib/sanity/client.ts` uses `createClient` from `@sanity/client` directly (not `next-sanity`). The `next-sanity` wrapper adds stega/perspective layers that interfere with mutations and asset uploads.

---

## Prayer request feature

Three-stage Claude Haiku pipeline on every submission:
1. **Stage 1** — validates input (screens spam/abuse/gibberish/obvious non-requests)
2. **Stage 2** — generates a pastoral response with 2–3 verified Bible verses (NIV)
3. **Stage 3** — audits verse existence and relevance; retries Stage 2 once if it fails
4. Falls back to hardcoded response if both Stage 2+3 attempts fail

Sends two emails in parallel:
- Church team notification (to `CONTACT_EMAIL_TO`)
- Confirmation email to submitter with branded HTML (verses, closing line, service invite) — only if email provided

Cost: ~$0.002/request at Haiku pricing (~$0.21/month at 100 requests).

---

## Planning Center API

**Auth:** Basic Auth with App ID + Secret (server-side only, never exposed to client).

```ts
// lib/planningcenter/client.ts
export async function pcFetch(path: string, revalidate = 3600) {
  const credentials = Buffer.from(
    `${process.env.PLANNING_CENTER_APP_ID}:${process.env.PLANNING_CENTER_SECRET}`
  ).toString("base64");

  const res = await fetch(`https://api.planningcenteronline.com${path}`, {
    headers: { Authorization: `Basic ${credentials}` },
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`Planning Center API error: ${res.status}`);
  return res.json();
}
```

**Endpoints used:**

| Endpoint | Used for | Revalidate |
|---|---|---|
| `GET /calendar/v2/events?filter=upcoming&order=starts_at` | Events page, home section | 60 min (home) / SSR (events page) |

---

## Rendering strategy

| Page | Strategy | Revalidation |
|---|---|---|
| Home | ISR | 60 min (`revalidate = 3600`) |
| About | SSG | On Sanity webhook (`revalidate: false`) |
| Announcements | Dynamic | Every request (`dynamic = "force-dynamic"`) |
| Testimonies (list) | Dynamic | Every request (`dynamic = "force-dynamic"`) |
| Testimonies (detail) | ISR | 60 s (`revalidate = 60`) |
| Testimonies (submit) | SSG | Static shell, form is client-side |
| Events | SSR | Every request (`dynamic = "force-dynamic"`) |
| Give | ISR | 60 s (`revalidate = 60`) |
| Contact | ISR | 60 s (`revalidate = 60`) — pulls from siteSettings |

**Sanity webhook → cache invalidation:**  
`POST /api/revalidate?secret=SANITY_WEBHOOK_SECRET`  
Body: `{ "_type": "testimony" }` (or any schema type name)  
Calls `revalidateTag(tag, { expire: 0 })` — Next.js 16 requires the second argument.

---

## Key conventions

- All Planning Center API calls go through `lib/planningcenter/client.ts` — never call PC directly from components
- All Sanity queries go through `lib/sanity/queries.ts` — keep GROQ centralised
- No `any` types — use proper TypeScript throughout
- All images go through `urlFor()` from `lib/sanity/image.ts` or `next/image`
- Testimony images use plain `<img>` tags (not `next/image`) on the detail page to avoid forced cropping — `urlFor` should not have `.height()` set, only `.width()`
- Mobile-first Tailwind — base styles are mobile, use `md:` and `lg:` for larger screens
- Components are named with PascalCase, files match component names
- Route Handlers live in `app/api/` — all external API calls are server-side only
- `"use client"` only on components that need browser APIs (Nav hamburger, ContactForm, PrayerRequestButton, TestimonySubmitForm, Studio)

---

## Known gotchas (Next.js 16 + Tailwind v4)

**`revalidateTag` requires 2 arguments (Next.js 16):**
```ts
revalidateTag(tag, { expire: 0 })  // NOT revalidateTag(tag)
```

**`revalidateTag` on Amplify requires two requests to see updated content:**  
After the webhook fires and `revalidateTag` is called, the first request to the page serves the stale cache and triggers background regeneration. The second request serves fresh content. This is standard ISR stale-while-revalidate behaviour — it works correctly, just not instantly on the first hit.

**`@sanity/image-url` — use named export:**
```ts
import { createImageUrlBuilder } from "@sanity/image-url"  // NOT default import
```

**Tailwind v4 — no `tailwind.config.ts`:**  
Custom tokens (colors, fonts) go in `globals.css` inside `@theme { }`. No JavaScript config file.

**`node_modules/.bin/next` must be a symlink:**  
On some npm versions it gets created as a flat copy, breaking relative `require()` paths.  
Fix: `rm node_modules/.bin/next && ln -s ../next/dist/bin/next node_modules/.bin/next`

**Nodemailer (Gmail SMTP) — instantiate inside the request handler:**  
Create the transporter inside the POST handler after checking env vars exist, not at module level.

**About and Give pages use `revalidate = 60` (not `revalidate = false`):**  
These were changed from fully static to ISR with a 60-second revalidation as a safety net for Amplify. The webhook still triggers on-demand revalidation — the 60s is just a fallback.

**Amplify password protection blocks the Sanity Studio iframe on sanity.io:**  
When password protection is enabled, sanity.io cannot embed the studio in an iframe. Content editors should use `https://libertylifeperth.org/studio` directly. The direct URL works fine with or without password protection.

**`sanityWriteClient.assets.upload()` fails with 403 in Next.js API routes:**  
Use raw `fetch()` to the Sanity assets endpoint directly. See Testimonies feature section above.

**Hydration mismatch `cz-shortcut-listen="true"`:**  
Injected by the ColorZilla browser extension. Not a code bug — safe to ignore in dev.

**Hero video upload — use raw fetch for file assets:**  
Same pattern as image uploads — `sanityWriteClient.assets.upload()` fails with 403 for file assets too. Upload via raw fetch to `https://${projectId}.api.sanity.io/v2024-01-01/assets/files/${dataset}`. The returned `_id` (e.g. `file-abc123-mp4`) can then be used as a reference in the siteSettings document.

**Hero video compression:**  
Source video compressed with `ffmpeg` before upload: `libx264 -crf 28` for MP4, `libvpx-vp9 -crf 35` for WebM. Both ~2.5 MB. Videos are stored as Sanity file assets and referenced in `siteSettings.heroVideoMp4` / `heroVideoWebm`.

---

## GitHub

**Repo:** https://github.com/hassan1709/liberty-life-perth (public)  
**Branch protection:** `main` requires PR + 1 approval before merge  
**Collaborators:** maragir (write access)

---

## Sanity

**Project ID:** `9ba0wd09`  
**Dataset:** `production`  
**Organisation ID:** `oDlX6GhYF`  
**Studio (local):** http://localhost:3000/studio  
**Studio (production):** https://libertylifeperth.org/studio  
**CORS origins:** `http://localhost:3000`, `https://libertylifeperth.org` — both with **Allow credentials enabled**  
**Webhook:** `POST https://libertylifeperth.org/api/revalidate?secret=llp-webhook-2026` ✅ configured  
**Studio hosts:** `https://libertylifeperth.org/studio` registered  
**Tokens:** `SANITY_API_TOKEN` = Viewer (read-only) · `SANITY_WRITE_TOKEN` = Editor (`liberty-life-website-write`)

> **Gotcha:** CORS origins for the studio MUST have "Allow credentials" enabled. Without it the studio throws a CorsOriginError and shows "Register this studio" instead of the editor.

Content editors are invited via sanity.io/manage → Members → Invite (set role to Editor).  
They access the studio at `https://libertylifeperth.org/studio` directly (not via the sanity.io iframe).

---

## Email setup

All transactional email uses **Nodemailer + Gmail SMTP** (`webadmin@libertylifeperth.org`).  
To switch senders (e.g. when Google Workspace Nonprofits is approved), update env vars — no code changes needed:
- `CONTACT_EMAIL_FROM` — sending address
- `CONTACT_EMAIL_APP_PASSWORD` — Gmail App Password for that account
- `CONTACT_EMAIL_TO` — receiving address(es), comma-separated for multiple

**Email types:**
- Contact form → subject: `New message from [Name] via libertylifeperth.org`
- Prayer request → subject: `New prayer request from [Name]`
- Prayer confirmation → subject: `We're praying for you — Liberty Life Perth` (HTML, branded)
- Testimony notification → subject: `New testimony pending review — Liberty Life Perth` (HTML, branded, includes "Review in Studio" button)

**Google Workspace for Nonprofits** — applied June 2026. Entity: Liberty Christian Centre Inc (ABN 81 763 203 730). Qualifies via ACNC registration + ATO income tax exempt status. DGR status not required.

---

## AWS Amplify setup

1. Push repo to GitHub
2. Connect GitHub repo to Amplify (new app → from Git)
3. Add all environment variables in Amplify console → App settings → Environment variables
4. Build settings are in `amplify.yml` at the repo root — Amplify auto-detects it
5. Custom domain: Amplify → Domain management → add `libertylifeperth.org`
6. SSL: provisioned automatically

---

## Pending / TODO

### Done
- [x] Create Sanity project — ID `9ba0wd09`
- [x] Fill in `.env.local` with Sanity credentials
- [x] Confirm church street address — Contact page + Footer updated
- [x] Update Footer + Contact page social links (Facebook, Instagram, YouTube)
- [x] GitHub repo set up — public, branch protection on main, collaborator added
- [x] Buy domains via AWS Route 53 — main: libertylifeperth.org, redirects: libertylifecentre.org, libertylifecentre.com, libertylifeperth.com
- [x] Connect GitHub repo to AWS Amplify (ap-southeast-2 / Sydney)
- [x] All 4 domains configured in Amplify Domain management
- [x] Sanity CORS origins configured (localhost + production, both with Allow credentials)
- [x] Sanity webhook configured and verified working
- [x] Sanity Studio working at https://libertylifeperth.org/studio
- [x] ISR revalidation verified working on Amplify (About + Give pages set to revalidate = 60)
- [x] CONTENT-MAP.md created — maps website sections to Sanity content types
- [x] Contact form swapped from Resend to Nodemailer + Gmail SMTP — verified working in production
- [x] Amplify runtime env var fix — vars piped into `.env.production` via `amplify.yml`
- [x] New logo (`logo-no-bg.png`) in Nav and Footer
- [x] "Prayer request" modal (portal-based) replacing "Plan a visit" button in Nav + Hero
- [x] Prayer request: 3-stage Claude Haiku pipeline with fallback + branded confirmation email
- [x] Give page: removed "Give online" card, added real bank transfer details (Liberty Life Centre, BSB 016-268, Acc 4956 4301 5)
- [x] All YouTube links updated to `@libertylifeperth5011`
- [x] "Website under renovation" banner added to all pages via layout
- [x] Applied for Google Workspace for Nonprofits (June 2026)
- [x] Sermons removed from Studio and nav (schema files kept on disk, not registered)
- [x] Testimonies: public submission, LLM moderation, image upload, paginated list (12/page), detail page, team email with Studio review link
- [x] Announcements page — `/announcements`, auto-expires by date, managed in Studio
- [x] Hero video banner — compressed MP4 + WebM uploaded to Sanity CDN, set via siteSettings
- [x] PageBanner component — reusable banner with optional background image + overlay, used on Testimonies, Announcements, Events, Give
- [x] Banner images (testimonies, announcements, events, give) editable via Studio siteSettings
- [x] siteSettings fully wired up — tagline, service times + labels, address, social links, bank details, whatToExpect cards, giveCta, banner images
- [x] Footer async — pulls address, service time, social links from siteSettings
- [x] Contact page ISR — pulls service times (with labels), address, social links from siteSettings
- [x] Social icons (Facebook, Instagram, YouTube) in home page WhatToExpect section and footer
- [x] Location links to Google Maps in ServiceBar and Footer
- [x] Home nav link added
- [x] Saturday Spanish service card added to WhatToExpect (fortnightly, shown first)
- [x] Spanish/Australian flag SVGs added to WhatToExpect Spanish service card (replaces emoji flags)
- [x] "Under renovation" banner removed from all pages
- [x] Planning Center connected — Events page uses `event_instances` endpoint for correct dates
- [x] Home page events section reuses EventItem component, endpoint fixed to event_instances
- [x] About dropdown in nav fixed for touch/Android landscape (click + hover)
- [x] AI moderation (Claude Haiku) added to contact form API route
- [x] Event location links to Google Maps
- [x] Gmail App Password regenerated — update `CONTACT_EMAIL_APP_PASSWORD` in Amplify env vars

### Next session
- [ ] Update `CONTACT_EMAIL_APP_PASSWORD` in Amplify env vars (new App Password generated)
- [ ] Activate Google Workspace once approved — set up church email accounts (pending Google approval)
- [ ] Update contact form env vars to use new Workspace email accounts (blocked on Google Workspace)
- [ ] Add staff photos and content in Sanity Studio (`/studio`)

> **Give page:** Planning Center Giving URL not needed — bank transfer details are used instead (BSB 016-268, Acc 4956 4301 5)
> **Events page:** Uses `/calendar/v2/event_instances` endpoint with Personal Access Token auth. Managed in PC Calendar app — delegate to church staff for event entry.
> **Planning Center auth:** Personal Access Token (not OAuth app credentials). Token ID + secret stored as `PLANNING_CENTER_APP_ID` + `PLANNING_CENTER_SECRET`.

---

*Last updated: June 2026 — Planning Center events, AI contact moderation, nav touch fix, flag SVGs*
