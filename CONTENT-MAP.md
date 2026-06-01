# Content Map — Liberty Life Perth

> Maps each website page and section to its Sanity content source.
> Use this as a guide when adding or editing content in the Studio.

---

## Website pages → Sanity content

### Home (`/`)

| Section | Sanity source | Notes |
|---|---|---|
| Hero | Hardcoded | Text and CTAs are in code |
| Service bar (time, location, YouTube Live) | Hardcoded | Update in code if details change |
| What to Expect | Hardcoded | 4 cards: Worship, Message, Kids, Community |
| Latest Sermon | `sermon` (most recent by date) | Shows automatically when sermons are added |
| Upcoming Events | Planning Center API | Not Sanity — from Planning Center calendar |
| Give CTA | Hardcoded | Links to `/give` |

---

### About (`/about`)

| Section | Sanity source | Required slug / type |
|---|---|---|
| Page hero | Hardcoded | — |
| Our story | `page` | slug: `about` |
| What we believe | `page` | slug: `beliefs` |
| Meet the team | `staff` | All published staff entries |
| Kids & youth | Hardcoded | Text is in code |
| Join us CTA | Hardcoded | Links to `/contact` |

> **Note:** "Our story" and "What we believe" are hidden until their respective `page` documents are published in Sanity. "Meet the team" is hidden until at least one `staff` entry exists.

---

### Sermons (`/sermons`)

| Section | Sanity source | Notes |
|---|---|---|
| Sermon list | `sermon` | Ordered by date descending |
| Series filter | `sermonSeries` | Filter tabs appear when series exist |
| Sermon card | `sermon` | Title, speaker, date, YouTube thumbnail |

---

### Sermon detail (`/sermons/[slug]`)

| Section | Sanity source | Notes |
|---|---|---|
| YouTube embed | `sermon.youtubeUrl` | |
| Title, date, scripture | `sermon` | |
| Speaker | `sermon.speaker` → `staff` | Links to a staff entry |
| Series | `sermon.series` → `sermonSeries` | |
| Notes / transcript | `sermon.notes` | Rich text |
| Related sermons | `sermonSeries` | Other sermons in the same series |

---

### Events (`/events`)

| Section | Sanity source | Notes |
|---|---|---|
| Event list | **Planning Center API** | Not Sanity — managed in Planning Center |

---

### Give (`/give`)

| Section | Sanity source | Required slug |
|---|---|---|
| Page copy | `page` | slug: `give` |
| Bank details, giving links | Inside `page` body | Added as rich text in the `give` page body |

> **Note:** The Give page shows a hardcoded fallback until the `give` page is published in Sanity.

---

### Contact (`/contact`)

| Section | Sanity source | Notes |
|---|---|---|
| Entire page | **Hardcoded** | Address, map, socials, form are all in code |
| Contact form | Sends email via AWS SES | Not Sanity |

---

## Sanity content types → where they appear

| Content type | Studio section | Appears on |
|---|---|---|
| `sermon` | Sermon | Home (latest), Sermons list, Sermon detail |
| `sermonSeries` | Sermon Series | Sermons list (filter), Sermon detail |
| `staff` | Staff | About → Meet the team, Sermon detail (speaker) |
| `page` (slug: `about`) | Page | About → Our story |
| `page` (slug: `beliefs`) | Page | About → What we believe |
| `page` (slug: `give`) | Page | Give page |
| `siteSettings` | Site Settings | Available globally — not yet wired to UI |
| `announcement` | Announcements | Not yet wired to UI |

---

## Hardcoded sections (not editable via Sanity)

These sections require a code change to update:

- Home hero text and CTAs
- Home service bar (Sunday time, location, YouTube Live link)
- Home "What to Expect" cards
- Home Give CTA
- About hero
- About Kids & Youth cards
- About "Join us" CTA
- Contact page (address, map embed, social links, form)
- Nav and Footer structure (social links are hardcoded — not from `siteSettings` yet)

---

## Required Sanity entries (minimum for a complete site)

| Priority | Type | Slug / detail |
|---|---|---|
| 1 | `page` | slug: `about` |
| 2 | `page` | slug: `beliefs` |
| 3 | `page` | slug: `give` |
| 4 | `staff` | One entry per team member |
| 5 | `sermonSeries` | One entry per series |
| 6 | `sermon` | One entry per message |

---

*Last updated: June 2026*
