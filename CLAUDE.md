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
| CMS | Sanity v3 (via `next-sanity`) | Content for sermons, pages, staff, announcements |
| Church data | Planning Center API | Events, groups, giving — via REST + Basic Auth |
| Hosting | AWS Amplify | Git-push deploys, auto SSL, CDN. Config in `amplify.yml` |
| Email (transactional) | Nodemailer + Gmail SMTP | Contact form submissions via `webadmin@libertylifeperth.org` — swap credentials when Workspace is ready |
| Email (mailboxes) | Google Workspace (Nonprofits) | Applied for free nonprofit plan — pending approval. Legal entity: Liberty Christian Centre Inc (ABN 81 763 203 730) |
| Video | YouTube embeds | No self-hosted video |
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
│   ├── sermons/
│   │   ├── page.tsx            # Sermon list (revalidate: 86400)
│   │   └── [slug]/
│   │       └── page.tsx        # Individual sermon (SSG + generateStaticParams)
│   ├── events/
│   │   └── page.tsx            # SSR (dynamic: force-dynamic)
│   ├── give/
│   │   └── page.tsx            # SSG (revalidate: false)
│   ├── contact/
│   │   ├── page.tsx            # SSG shell
│   │   └── ContactForm.tsx     # "use client" form component
│   ├── studio/
│   │   └── [[...tool]]/
│   │       └── page.tsx        # Embedded Sanity Studio ("use client")
│   └── api/
│       ├── contact/
│       │   └── route.ts        # POST → Nodemailer (Gmail SMTP)
│       ├── events/
│       │   └── route.ts        # GET → Planning Center proxy (revalidate 3600)
│       └── revalidate/
│           └── route.ts        # POST → Sanity webhook → revalidateTag
├── components/
│   ├── layout/
│   │   ├── Nav.tsx             # Fixed header, mobile hamburger ("use client")
│   │   └── Footer.tsx          # 3-column footer, social links
│   ├── home/
│   │   ├── Hero.tsx            # Full-height hero, circle motifs, CTAs
│   │   ├── ServiceBar.tsx      # Sunday time / location / YouTube live strip
│   │   ├── WhatToExpect.tsx    # 4-card grid (Worship, Message, Kids, Community)
│   │   ├── LatestSermon.tsx    # YouTube embed + sermon metadata
│   │   ├── UpcomingEvents.tsx  # List of upcoming Planning Center events
│   │   └── GiveCta.tsx         # Dark section with give button
│   ├── sermons/
│   │   ├── SermonCard.tsx      # Card with YouTube thumbnail, play overlay
│   │   ├── SermonGrid.tsx      # 3-column responsive grid
│   │   └── SeriesFilter.tsx    # Filter tabs ("use client", uses useSearchParams)
│   ├── events/
│   │   └── EventItem.tsx       # Event article with date badge, location, register link
│   └── ui/
│       ├── Button.tsx               # primary / outline / ghost variants, Link or button
│       ├── PrayerRequestButton.tsx  # "use client" button that opens prayer request modal via portal
│       └── SectionHeader.tsx        # eyebrow + title + subtitle pattern
├── lib/
│   ├── sanity/
│   │   ├── client.ts           # Sanity client (falls back to "placeholder" projectId at build)
│   │   ├── queries.ts          # All GROQ queries — keep centralised here
│   │   └── image.ts            # urlFor() using createImageUrlBuilder (named export)
│   └── planningcenter/
│       ├── client.ts           # pcFetch() — Basic Auth, server-side only
│       └── types.ts            # PCEvent, PCEventsResponse TypeScript types
├── sanity/
│   ├── schemaTypes/
│   │   ├── sermon.ts
│   │   ├── sermonSeries.ts
│   │   ├── staff.ts
│   │   ├── page.ts
│   │   ├── siteSettings.ts
│   │   ├── announcement.ts
│   │   └── index.ts            # Exports schemaTypes array
│   └── sanity.config.ts        # Sanity Studio config (structure + vision plugins)
├── public/
│   └── logo-white.png
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
SANITY_API_TOKEN=                    # Read token — create in Sanity project settings
SANITY_WEBHOOK_SECRET=               # Any random string — set the same in Sanity webhook config

# Planning Center
PLANNING_CENTER_APP_ID=              # From api.planningcenteronline.com/oauth/applications
PLANNING_CENTER_SECRET=

# Contact form email (Gmail SMTP via Nodemailer)
CONTACT_EMAIL_FROM=                  # Gmail address used to send (e.g. webadmin@libertylifeperth.org)
CONTACT_EMAIL_APP_PASSWORD=          # Gmail App Password (Google Account → Security → App Passwords)
CONTACT_EMAIL_TO=                    # Email address(es) that receive messages — comma-separate for multiple

# App
NEXT_PUBLIC_SITE_URL=https://libertylifeperth.org
```

> **Build note:** The app builds successfully without real env vars (Sanity falls back to
> `"placeholder"` projectId). Pages that depend on Sanity will show empty/fallback states until real credentials are set.

> **Amplify runtime env vars:** Amplify SSR Lambda functions do not have access to `process.env` from the console at runtime. The `amplify.yml` build step pipes env vars into `.env.production` before `npm run build` so Next.js API routes can read them. Always add new server-side env vars to the grep pattern in `amplify.yml`.

---

## Sanity content types

| Type | Who edits | Key fields |
|---|---|---|
| `sermon` | Pastor / admin | title, slug, speaker (→staff), date, series (→sermonSeries), scripture, youtubeUrl, audioUrl, notes, tags |
| `sermonSeries` | Admin | title, slug, artwork, description, startDate |
| `staff` | Admin | name, role, photo, bio, order |
| `siteSettings` | Admin | siteName, tagline, address, serviceTime, contactEmail, socialLinks |
| `page` | Admin | title, slug, body (rich text) — used for About story, beliefs, Give copy |
| `announcement` | Pastor / admin | title, body, publishedAt, expiresAt |

**Page slugs expected by queries:**
- `about` — About page story (`getAboutPage`)
- `beliefs` — What we believe section (`getAboutPage`)
- `give` — Give page copy (`getGivePage`)

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
| Sermons (list) | ISR | 24 h (`revalidate = 86400`) |
| Sermons (detail) | SSG | `generateStaticParams` — on webhook |
| Events | SSR | Every request (`dynamic = "force-dynamic"`) |
| Give | SSG | On Sanity webhook |
| Contact | SSG | Static shell, form is client-side |

**Sanity webhook → cache invalidation:**  
`POST /api/revalidate?secret=SANITY_WEBHOOK_SECRET`  
Body: `{ "_type": "sermon" }` (or any schema type name)  
Calls `revalidateTag(tag, { expire: 0 })` — Next.js 16 requires the second argument.

---

## Key conventions

- All Planning Center API calls go through `lib/planningcenter/client.ts` — never call PC directly from components
- All Sanity queries go through `lib/sanity/queries.ts` — keep GROQ centralised
- No `any` types — use proper TypeScript throughout
- All images go through `urlFor()` from `lib/sanity/image.ts` or `next/image`
- Mobile-first Tailwind — base styles are mobile, use `md:` and `lg:` for larger screens
- Components are named with PascalCase, files match component names
- Route Handlers live in `app/api/` — all external API calls are server-side only
- `"use client"` only on components that need browser APIs (Nav hamburger, SeriesFilter, ContactForm, PrayerRequestButton, Studio)

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

> **Gotcha:** CORS origins for the studio MUST have "Allow credentials" enabled. Without it the studio throws a CorsOriginError and shows "Register this studio" instead of the editor.

Content editors are invited via sanity.io/manage → Members → Invite (set role to Editor).  
They access the studio at `https://libertylifeperth.org/studio` directly (not via the sanity.io iframe).

---

## Email setup

Contact form currently uses **Nodemailer + Gmail SMTP** (`webadmin@libertylifeperth.org`).  
To switch senders (e.g. when Google Workspace Nonprofits is approved), just update three env vars — no code changes needed:
- `CONTACT_EMAIL_FROM` — sending address
- `CONTACT_EMAIL_APP_PASSWORD` — Gmail App Password for that account
- `CONTACT_EMAIL_TO` — receiving address(es), comma-separated for multiple

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
- [x] Give page: removed "Give online" card, added real bank transfer details (Liberty Life Centre, BSB 016-268, Acc 4956 4301 5)
- [x] All YouTube links updated to `@libertylifeperth5011`
- [x] "Website under renovation" banner added to all pages via layout
- [x] Applied for Google Workspace for Nonprofits (June 2026)

### Next session
- [ ] Activate Google Workspace once approved — set up church email accounts
- [ ] Update contact form env vars to use new Workspace email accounts
- [ ] Update Give page Planning Center Giving URL
- [ ] Add Planning Center credentials to `.env.local` and Amplify env vars
- [ ] Add staff photos and content in Sanity Studio (`/studio`)

---

*Last updated: June 2026 — contact form live, prayer request modal, new logo, bank transfer details added*
