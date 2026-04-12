# Kestrel Studios Website — Design Spec

## Overview

A modern, high-converting marketing website for **Kestrel Studios Ltd**, a UK drone services business based in Kent. The site presents 9 aerial services, builds credibility, and drives quote requests.

**Primary CTA:** Request a Quote
**Secondary CTA:** View Services

---

## Tech Stack

- **Framework:** Astro
- **Styling:** Tailwind CSS
- **Architecture:** Data-driven service pages (single template, service data in a shared file)
- **Build output:** Static site
- **Hosting:** User's VPS
- **Form handling:** Frontend-only for now (success state, no backend submission)
- **Images:** Placeholder aerials + Kestrel Studios logos from `/home/chris/GoogleDrive/KESTREL_STUDIOS/LOGOS/`

---

## Brand

### Fonts
- **Bebas Neue** — hero headings, section titles
- **Barlow Condensed** — nav, labels, card headings, badges, UI text (uppercase)
- **Barlow** — body copy

### Colour Palette
| Token | Value |
|-------|-------|
| Background | `#07080c` |
| Surface | `#0d0f15` |
| Panel | `#131620` |
| Alt background | `#0a0b10` |
| Primary orange | `#e06218` |
| Hover orange | `#f07828` |
| Dark orange | `#c8520e` |
| Cream text | `#dde0e8` |
| Silver text | `#9aa0b0` |
| Muted text | `#616878` |
| Border | `rgba(224, 98, 24, 0.2)` |
| Subtle border | `rgba(224, 98, 24, 0.08)` |

### Visual Direction
- Dark, premium, near-black aesthetic
- Orange accent used sparingly for emphasis, CTAs, icons, highlights
- Radial gradient glows as subtle background effects
- Grid overlay pattern in hero
- Clean layout, high readability, mobile-first
- Fast loading, no heavy media dependencies

### Logo Usage
- **Nav:** Bird icon (`KESTREL_BIRD_ONLY.png`) + "KESTREL STUDIOS" in Bebas Neue text
- **Hero:** Bird icon with orange drop-shadow glow
- **Footer:** Bird icon + "KESTREL STUDIOS" text
- **Favicon:** Bird icon

---

## Navigation

Sticky top nav with frosted glass backdrop-blur effect.

**Items:** Home | Services | Sectors | About | Contact | **Get a Quote** (orange button)

**Mobile:** Hamburger menu

**Future nav items (not built now):** Portfolio, Pricing, FAQs

---

## Pages

### 1. Homepage

**Sections in scroll order:**

1. **Hero** — eyebrow label with decorative lines ("Aerial Photo · Video · Inspection · Mapping"), bird icon with glow, Bebas headline ("AERIAL VISUALS THAT ELEVATE PROPERTY, CONSTRUCTION AND BUSINESS" with "ELEVATE" in orange), subheading, two CTA buttons (Request a Quote primary, View Services secondary), subtle grid overlay background with radial glow
2. **Trust strip** — 5 items in a horizontal bar with icon boxes: Professional Aerial Imagery, Fast Turnaround, Visual Inspections, Mapping Outputs, Quote-Based Service
3. **Services grid** — 3x3 grid of service cards. Each card: SVG icon in bordered box, Barlow Condensed title, one-line description, hover animation (lift + top orange glow line + sliding arrow). Links to service page.
4. **Why Choose Us** — split layout. Left: section label, Bebas title ("BUILT FOR REAL BUSINESS RESULTS"), description. Right: 2x2 grid of value cards with orange left-border accent (Premium Quality, Business-Ready Outputs, Flexible Service, Clear Deliverables)
5. **Sectors** — centered layout with tag blocks: Estate Agents, Property Developers, Construction, Roofing & Property Maintenance, Homeowners, Landlords, Farms & Rural Estates, Local Businesses, Hospitality & Tourism
6. **Process** — 4-step horizontal flow with numbered circles, connecting gradient line: Enquire, Plan, Capture, Deliver
7. **CTA section** — contained card with radial glow, Bebas headline, description, primary CTA button
8. **Footer** — bird icon + text logo, company info (Kestrel Studios Ltd, Company No. 17149140, Kent, United Kingdom), 3-column link layout (Navigation, Services, Contact), bottom bar with copyright and legal links

### 2. Service Pages (x9, data-driven)

All 9 service pages share a single Astro layout template. Content is driven from a service data file.

**Sections:**

1. **Hero** — breadcrumb (Services > Service Name), Bebas headline with orange highlight word, summary paragraph, CTA button, placeholder image
2. **What's Included** — 3x2 grid of check items with icon, title and description
3. **Who It's For** — split layout. Left: audience list with diamond bullet points. Right: placeholder image
4. **What You Could Receive** — subtitle: "Deliverables vary depending on your project scope and quote. Below are examples of what we can provide." 2x2 cards with title, description, and file format tags
5. **CTA** — closing conversion block with service-specific headline
6. **Footer**

### 3. About Page

**Sections:**

1. **Hero** — centered, section label, Bebas headline ("AERIAL SERVICES BUILT FOR REAL RESULTS"), summary
2. **Our Story** — split layout. Left: text (who we are, what we do, how we work). Right: placeholder image with "UK CAA Registered" badge overlay
3. **Our Values** — 3-card grid with SVG icons and top orange accent bar (No Wasted Time, Honest Outputs, Quality First)
4. **Our Approach** — 2x2 grid with large faded numbers (01-04): Scoped to Your Needs, Clear Quoting, Professional Capture, Delivered Ready to Use
5. **Credentials** — icon strip: CAA Registered, Fully Insured, Risk Assessed, Professional Service
6. **CTA + Footer**

### 4. Quote Page

**Sections:**

1. **Hero** — centered headline ("TELL US ABOUT YOUR PROJECT"), description
2. **Form layout** — two columns: form (left, wider), sidebar (right)

**Form fields:**
- Full Name (required)
- Email Address (required)
- Phone Number
- Business Name
- Service Required (required) — dropdown with all 9 services + "Not sure — need advice"
- Project Location (required)
- Preferred Date
- Project Details (required) — textarea
- Reference Images (optional) — file upload area

**Sidebar cards:**
- "What Happens Next" — 4-step mini process (Review, Quote, Schedule, Deliver)
- "Response Time" — note about 24-hour response
- "Contact Us Directly" — email, phone placeholder, location

**Form behaviour:** Frontend-only. On submit, show a success confirmation message. No backend wiring yet.

### 5. Contact Page

The Contact page and Quote page are combined — the Quote page serves as the primary contact point. The nav "Contact" link routes to the Quote page.

---

## Services Data

9 services, defined in a shared data file:

```json
[
  {
    "title": "Property Photography and Video",
    "slug": "property-photography-video",
    "shortDescription": "Aerial imagery and video for estate agents, developers and property marketing."
  },
  {
    "title": "Roof, Exterior and Storm Damage Inspections",
    "slug": "roof-exterior-storm-damage-inspections",
    "shortDescription": "Visual inspection and evidence capture for roofs, exteriors and storm damage."
  },
  {
    "title": "Construction Progress Updates",
    "slug": "construction-progress-updates",
    "shortDescription": "Recurring aerial updates for site documentation, milestones and marketing."
  },
  {
    "title": "Business and Social Media Content",
    "slug": "business-social-media-content",
    "shortDescription": "Short-form aerial clips, reels and promo visuals for local businesses."
  },
  {
    "title": "Land and Plot Overviews",
    "slug": "land-plot-overviews",
    "shortDescription": "Site overview imagery and access context for landowners and developers."
  },
  {
    "title": "Agriculture and Rural Property Visuals",
    "slug": "agriculture-rural-property-visuals",
    "shortDescription": "Aerial farm overviews, estate visuals and rural property promotional content."
  },
  {
    "title": "2D Mapping and Site Overviews",
    "slug": "2d-mapping-site-overviews",
    "shortDescription": "Orthomosaic maps and aerial site overview outputs for planning and construction."
  },
  {
    "title": "3D Site Models and Measurements",
    "slug": "3d-site-models-measurements",
    "shortDescription": "Visual 3D models with area, length and height measurements from processed imagery."
  },
  {
    "title": "Stockpile Volume Estimates",
    "slug": "stockpile-volume-estimates",
    "shortDescription": "Volume estimates and progress comparisons for aggregates, earthworks and materials."
  }
]
```

Each service entry will also include: `icon` (SVG component reference), `includes` (array of what's included items), `audience` (array of who it's for), `deliverables` (array of example deliverable cards), `highlightWord` (the word to highlight orange in the hero title).

---

## Content Constraints

### Mapping and measurement wording
**Allowed:** visual site models, processed aerial measurements, site overviews, orthomosaic outputs, stockpile estimates
**Avoid:** chartered survey, certified survey, guaranteed accuracy, legal boundary survey, measured building survey, engineering certification

### Inspection wording
**Allowed:** visual inspection, evidence capture, high-resolution imagery and video, roof and exterior assessment imagery
**Avoid:** structural certification, engineering report, compliance sign-off

### Services to exclude entirely
No pages, sections or mentions of: crowd/event coverage, festivals, concerts, sports, public gatherings, industrial payload, drone delivery, spraying, thermal surveys, legal boundary surveys, certified land surveying, guaranteed survey-grade accuracy, BVLOS claims

---

## Components

Reusable Astro components:

| Component | Purpose |
|-----------|---------|
| `Nav` | Sticky nav with logo, links, CTA, mobile hamburger |
| `Footer` | Company info, link columns, legal bar |
| `Hero` | Configurable hero section (centered or split) |
| `ServiceCard` | Card for the services grid |
| `ValueCard` | Card with icon, title, description |
| `SectionHeader` | Label + title + optional description |
| `CTASection` | Closing conversion block |
| `QuoteForm` | Form with all fields and success state |
| `Button` | Primary and secondary button variants |
| `ProcessSteps` | Horizontal numbered step flow |
| `IncludedItem` | Check icon + title + description |
| `DeliverableCard` | Title + description + format tags |

---

## Responsive Behaviour

- **Mobile-first** design
- Nav collapses to hamburger menu on mobile
- Service grid: 3 columns → 2 columns → 1 column
- Split layouts (hero, why, who it's for): stack vertically on mobile
- Trust strip: wraps or becomes scrollable
- Process steps: stack vertically on mobile
- Quote form: sidebar stacks below form on mobile
- Footer: stacks vertically

---

## Performance

- Static HTML output (Astro)
- Minimal/zero client-side JavaScript
- Google Fonts loaded with `display=swap`
- Placeholder images replaced with optimised assets later
- SVG icons inline (no icon font library)

---

## Future Expansion

The architecture supports adding:
- Portfolio/gallery page
- Pricing page
- Blog/articles
- FAQs
- Client portal (via Astro React islands)
- New services (add entry to data file)
- Email form submission (wire up backend endpoint)
- Analytics integration

---

## Reference Mockups

Approved mockup files stored in `.superpowers/brainstorm/`:
- `homepage-layout-v2.html`
- `service-page-template.html`
- `about-page.html`
- `quote-page.html`
