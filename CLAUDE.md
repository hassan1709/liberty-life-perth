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
| Email (transactional) | AWS SES | Contact form submissions — to be set up after domain is live. Swap Resend code for SES. |
| Email (mailboxes) | Google Workspace | Church staff email addresses with custom domain ($6/user/month) |
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

- File: `public/logo-white.png` (copied from `Assets/LogoLibertyLifePerth.png`)
- Used in Nav and Footer
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
│       │   └── route.ts        # POST → Resend email
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
│       ├── Button.tsx          # primary / outline / ghost variants, Link or button
│       └── SectionHeader.tsx   # eyebrow + title + subtitle pattern
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

# Resend (contact form email)
RESEND_API_KEY=                      # From resend.com dashboard
CONTACT_EMAIL_TO=                    # Church admin email address that receives contact messages

# App
NEXT_PUBLIC_SITE_URL=https://libertylifeperth.church
```

> **Build note:** The app builds successfully without real env vars (Sanity falls back to
> `"placeholder"` projectId, Resend client is instantiated per-request). Pages that depend
> on Sanity will show empty/fallback states until real credentials are set.

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
- `"use client"` only on components that need browser APIs (Nav hamburger, SeriesFilter, ContactForm, Studio)

---

## Known gotchas (Next.js 16 + Tailwind v4)

**`revalidateTag` requires 2 arguments (Next.js 16):**
```ts
revalidateTag(tag, { expire: 0 })  // NOT revalidateTag(tag)
```

**`@sanity/image-url` — use named export:**
```ts
import { createImageUrlBuilder } from "@sanity/image-url"  // NOT default import
```

**Tailwind v4 — no `tailwind.config.ts`:**  
Custom tokens (colors, fonts) go in `globals.css` inside `@theme { }`. No JavaScript config file.

**`node_modules/.bin/next` must be a symlink:**  
On some npm versions it gets created as a flat copy, breaking relative `require()` paths.  
Fix: `rm node_modules/.bin/next && ln -s ../next/dist/bin/next node_modules/.bin/next`

**Resend client — do not instantiate at module level:**  
Instantiate inside the request handler after checking `process.env.RESEND_API_KEY` exists,  
otherwise the module fails to load at build time.

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
**CORS origins:** `http://localhost:3000` (add `https://libertylifeperth.org` when live)  
**Webhook secret:** `llp-webhook-2026` (set in `.env.local` — configure in Sanity when domain is live)

Content editors are invited via sanity.io/manage → Members → Invite (set role to Editor).

---

## Email setup (post-domain)

1. Buy domain on Route 53
2. Verify domain in AWS SES → replace Resend code in `app/api/contact/route.ts`
3. Set up Google Workspace → migrate existing free Gmail accounts to new domain addresses
4. Old emails can be imported via Google Workspace Data Migration Service

---

## AWS Amplify setup

1. Push repo to GitHub
2. Connect GitHub repo to Amplify (new app → from Git)
3. Add all environment variables in Amplify console → App settings → Environment variables
4. Build settings are in `amplify.yml` at the repo root — Amplify auto-detects it
5. Custom domain: Amplify → Domain management → add `libertylifeperth.church`
6. SSL: provisioned automatically

---

## Pending / TODO

### Done
- [x] Create Sanity project — ID `9ba0wd09`
- [x] Fill in `.env.local` with Sanity credentials
- [x] Confirm church street address — Contact page + Footer updated
- [x] Update Footer + Contact page social links (Facebook, Instagram, YouTube)
- [x] GitHub repo set up — public, branch protection on main, collaborator added

### In progress / next session
- [x] Buy domains via AWS Route 53 — main: libertylifeperth.org, redirects: libertylifecentre.org, libertylifecentre.com, libertylifeperth.com
- [ ] Connect GitHub repo to AWS Amplify
- [ ] Add domain in Amplify Domain management
- [ ] Set up Google Workspace for church emails (migrate old Gmail accounts)
- [ ] Verify domain in AWS SES — update contact form to use SES instead of Resend
- [ ] Set up Sanity webhook → `POST https://libertylifeperth.org/api/revalidate?secret=llp-webhook-2026`
- [ ] Update Give page bank transfer details (BSB, account number)
- [ ] Update Give page Planning Center Giving URL
- [ ] Add Planning Center credentials to `.env.local` and Amplify env vars
- [ ] Add staff photos and content in Sanity Studio (`/studio`)

---

*Last updated: May 2026 — Sanity connected, GitHub configured, address + socials updated*
