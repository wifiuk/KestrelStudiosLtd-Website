# Kestrel Studios Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static marketing website for Kestrel Studios using Astro + Tailwind CSS with 4 page types (Homepage, 9 data-driven Service Pages, About, Quote) deployed to a VPS.

**Architecture:** Astro static site with Tailwind CSS. Service pages generated from a shared data file via a single Astro dynamic route template. Reusable Astro components for nav, footer, hero, CTAs, cards. Frontend-only quote form with success state.

**Tech Stack:** Astro 5, Tailwind CSS 4, TypeScript, Google Fonts (Bebas Neue, Barlow, Barlow Condensed)

**Spec:** `docs/superpowers/specs/2026-04-12-kestrel-studios-website-design.md`

**Logo source:** `/home/chris/GoogleDrive/KESTREL_STUDIOS/LOGOS/`

---

## File Structure

```
src/
├── layouts/
│   └── BaseLayout.astro          # HTML shell, fonts, meta, nav + footer
├── components/
│   ├── Nav.astro                  # Sticky nav with logo, links, mobile hamburger
│   ├── Footer.astro               # Footer with logo, company info, link columns
│   ├── Button.astro               # Primary and secondary button variants
│   ├── SectionHeader.astro        # Label + title + optional description
│   ├── ServiceCard.astro          # Card for homepage services grid
│   ├── ValueCard.astro            # Card with icon, title, description
│   ├── ProcessSteps.astro         # 4-step horizontal flow
│   ├── CTASection.astro           # Closing conversion block
│   ├── IncludedItem.astro         # Check icon + title + description
│   ├── DeliverableCard.astro      # Title + description + format tags
│   ├── QuoteForm.astro            # Form with all fields and success state
│   └── MobileMenu.astro           # Mobile hamburger menu overlay
├── data/
│   └── services.ts                # All 9 services with full content
├── pages/
│   ├── index.astro                # Homepage
│   ├── about.astro                # About page
│   ├── quote.astro                # Quote/contact page
│   └── services/
│       └── [slug].astro           # Dynamic service page template
├── styles/
│   └── global.css                 # Tailwind directives + custom CSS
public/
├── bird-icon.png                  # Bird-only logo
├── logo-white.png                 # Full logo white text
└── favicon.png                    # Favicon (bird icon)
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `tailwind.config.mjs`, `src/styles/global.css`

- [ ] **Step 1: Initialise Astro project**

```bash
cd /home/chris/GoogleDrive/KESTREL_STUDIOS/WEBSITE
npm create astro@latest . -- --template minimal --no-install --typescript strict
```

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install @astrojs/tailwind tailwindcss
```

- [ ] **Step 3: Configure Astro with Tailwind**

Update `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
});
```

- [ ] **Step 4: Configure Tailwind with brand tokens**

Create `tailwind.config.mjs`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: '#07080c',
        surface: '#0d0f15',
        panel: '#131620',
        'alt-bg': '#0a0b10',
        orange: {
          DEFAULT: '#e06218',
          hover: '#f07828',
          dark: '#c8520e',
        },
        cream: '#dde0e8',
        silver: '#9aa0b0',
        muted: '#616878',
        'border-orange': 'rgba(224, 98, 24, 0.2)',
        'border-subtle': 'rgba(224, 98, 24, 0.08)',
        'border-light': 'rgba(224, 98, 24, 0.12)',
        'border-strong': 'rgba(224, 98, 24, 0.3)',
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'sans-serif'],
        'barlow-condensed': ['"Barlow Condensed"', 'sans-serif'],
        barlow: ['Barlow', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 5: Create global CSS**

Create `src/styles/global.css`:

```css
@import 'tailwindcss';

@theme {
  --color-bg: #07080c;
  --color-surface: #0d0f15;
  --color-panel: #131620;
  --color-alt-bg: #0a0b10;
  --color-orange: #e06218;
  --color-orange-hover: #f07828;
  --color-orange-dark: #c8520e;
  --color-cream: #dde0e8;
  --color-silver: #9aa0b0;
  --color-muted: #616878;
  --color-border-orange: rgba(224, 98, 24, 0.2);
  --color-border-subtle: rgba(224, 98, 24, 0.08);
  --color-border-light: rgba(224, 98, 24, 0.12);
  --color-border-strong: rgba(224, 98, 24, 0.3);

  --font-bebas: "Bebas Neue", sans-serif;
  --font-barlow-condensed: "Barlow Condensed", sans-serif;
  --font-barlow: "Barlow", sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-bg);
  color: var(--color-cream);
  font-family: var(--font-barlow);
}
```

- [ ] **Step 6: Copy logo assets into public/**

```bash
cp "/home/chris/GoogleDrive/KESTREL_STUDIOS/LOGOS/KESTREL_BIRD_ONLY.png" public/bird-icon.png
cp "/home/chris/GoogleDrive/KESTREL_STUDIOS/LOGOS/KESTREL STUDIOS LOGO TRANSPARENT WHITE TEXT.png" public/logo-white.png
cp "/home/chris/GoogleDrive/KESTREL_STUDIOS/LOGOS/KESTREL_BIRD_ONLY.png" public/favicon.png
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```

Expected: Dev server runs on localhost:4321, blank page with dark background.

- [ ] **Step 8: Initialise git and commit**

```bash
git init
echo "node_modules/\ndist/\n.astro/\n.superpowers/" > .gitignore
git add -A
git commit -m "chore: scaffold Astro + Tailwind project with brand tokens"
```

---

### Task 2: Base Layout, Nav and Footer Components

**Files:**
- Create: `src/layouts/BaseLayout.astro`, `src/components/Nav.astro`, `src/components/Footer.astro`, `src/components/MobileMenu.astro`

- [ ] **Step 1: Create Nav component**

Create `src/components/Nav.astro`:

```astro
---
const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/#services' },
  { label: 'Sectors', href: '/#sectors' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/quote' },
];
---

<nav class="sticky top-0 z-50 bg-bg/85 backdrop-blur-xl border-b border-border-subtle">
  <div class="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
    <a href="/" class="flex items-center gap-3">
      <img src="/bird-icon.png" alt="Kestrel Studios" class="h-9 drop-shadow-[0_0_12px_rgba(224,98,24,0.2)]" />
      <span class="font-bebas text-xl tracking-[3px] text-cream">KESTREL STUDIOS</span>
    </a>

    <!-- Desktop nav -->
    <div class="hidden lg:flex items-center gap-7">
      {navLinks.map(link => (
        <a href={link.href} class="font-barlow-condensed text-sm font-medium uppercase tracking-[1.5px] text-silver hover:text-cream transition-colors">
          {link.label}
        </a>
      ))}
      <a href="/quote" class="bg-orange hover:bg-orange-hover text-white px-5 py-2 rounded font-barlow-condensed font-semibold text-sm uppercase tracking-wider transition-colors">
        Get a Quote
      </a>
    </div>

    <!-- Mobile hamburger -->
    <button id="mobile-menu-btn" class="lg:hidden text-cream p-2" aria-label="Open menu">
      <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M3 12h18M3 6h18M3 18h18"/>
      </svg>
    </button>
  </div>
</nav>

<!-- Mobile menu overlay -->
<div id="mobile-menu" class="fixed inset-0 z-50 bg-bg/95 backdrop-blur-xl hidden flex-col items-center justify-center gap-8">
  <button id="mobile-menu-close" class="absolute top-5 right-6 text-cream p-2" aria-label="Close menu">
    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  </button>
  {navLinks.map(link => (
    <a href={link.href} class="font-barlow-condensed text-2xl font-medium uppercase tracking-[2px] text-silver hover:text-cream transition-colors">
      {link.label}
    </a>
  ))}
  <a href="/quote" class="bg-orange hover:bg-orange-hover text-white px-8 py-3 rounded font-barlow-condensed font-semibold text-base uppercase tracking-wider transition-colors mt-4">
    Get a Quote
  </a>
</div>

<script>
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const close = document.getElementById('mobile-menu-close');
  btn?.addEventListener('click', () => menu?.classList.replace('hidden', 'flex'));
  close?.addEventListener('click', () => menu?.classList.replace('flex', 'hidden'));
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu?.classList.replace('flex', 'hidden')));
</script>
```

- [ ] **Step 2: Create Footer component**

Create `src/components/Footer.astro`:

```astro
---
const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/#services' },
  { label: 'Sectors', href: '/#sectors' },
  { label: 'About', href: '/about' },
];
const serviceLinks = [
  { label: 'Property Photography', href: '/services/property-photography-video' },
  { label: 'Inspections', href: '/services/roof-exterior-storm-damage-inspections' },
  { label: 'Construction Progress', href: '/services/construction-progress-updates' },
  { label: 'Mapping & Models', href: '/services/2d-mapping-site-overviews' },
];
const contactLinks = [
  { label: 'Get a Quote', href: '/quote' },
  { label: 'Email Us', href: '/quote' },
];
---

<footer class="bg-bg border-t border-border-subtle">
  <div class="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-8">
    <div class="flex flex-col lg:flex-row justify-between gap-12">
      <!-- Brand -->
      <div>
        <div class="flex items-center gap-3 mb-3">
          <img src="/bird-icon.png" alt="" class="h-8" />
          <span class="font-bebas text-xl tracking-[2px] text-cream">KESTREL STUDIOS</span>
        </div>
        <div class="font-barlow-condensed text-sm text-muted leading-relaxed">
          Kestrel Studios Ltd<br />
          Company No. 17149140<br />
          Kent, United Kingdom
        </div>
      </div>

      <!-- Link columns -->
      <div class="flex gap-16 flex-wrap">
        <div>
          <h5 class="font-barlow-condensed text-xs font-semibold uppercase tracking-[2px] text-orange mb-3">Navigation</h5>
          {navLinks.map(link => (
            <a href={link.href} class="block text-sm text-muted hover:text-cream transition-colors mb-2">{link.label}</a>
          ))}
        </div>
        <div>
          <h5 class="font-barlow-condensed text-xs font-semibold uppercase tracking-[2px] text-orange mb-3">Services</h5>
          {serviceLinks.map(link => (
            <a href={link.href} class="block text-sm text-muted hover:text-cream transition-colors mb-2">{link.label}</a>
          ))}
        </div>
        <div>
          <h5 class="font-barlow-condensed text-xs font-semibold uppercase tracking-[2px] text-orange mb-3">Contact</h5>
          {contactLinks.map(link => (
            <a href={link.href} class="block text-sm text-muted hover:text-cream transition-colors mb-2">{link.label}</a>
          ))}
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="mt-8 pt-6 border-t border-border-subtle flex flex-col sm:flex-row justify-between text-xs text-muted gap-4">
      <span>&copy; 2026 Kestrel Studios Ltd. All rights reserved.</span>
      <div class="flex gap-6">
        <a href="#" class="hover:text-cream transition-colors">Privacy Policy</a>
        <a href="#" class="hover:text-cream transition-colors">Terms of Service</a>
      </div>
    </div>
  </div>
</footer>
```

- [ ] **Step 3: Create BaseLayout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Professional drone photography, video, inspections, mapping and visual measurement services across Kent and beyond.' } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content={description} />
  <title>{title} | Kestrel Studios</title>
  <link rel="icon" type="image/png" href="/favicon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;500;600;700&family=Barlow:wght@300;400;500;600&display=swap" rel="stylesheet" />
</head>
<body class="min-h-screen">
  <Nav />
  <main>
    <slot />
  </main>
  <Footer />
</body>
</html>
```

- [ ] **Step 4: Create minimal index page to test layout**

Create `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Home">
  <div class="min-h-screen flex items-center justify-center">
    <h1 class="font-bebas text-6xl text-cream">KESTREL STUDIOS</h1>
  </div>
</BaseLayout>
```

- [ ] **Step 5: Verify in browser**

```bash
npm run dev
```

Expected: Dark page with sticky frosted nav (logo + links), centered "KESTREL STUDIOS" heading, footer with company info and link columns. Mobile hamburger works on narrow viewport.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/ src/components/Nav.astro src/components/Footer.astro src/pages/index.astro
git commit -m "feat: add base layout with nav and footer components"
```

---

### Task 3: Shared UI Components

**Files:**
- Create: `src/components/Button.astro`, `src/components/SectionHeader.astro`, `src/components/CTASection.astro`, `src/components/ProcessSteps.astro`

- [ ] **Step 1: Create Button component**

Create `src/components/Button.astro`:

```astro
---
interface Props {
  href: string;
  variant?: 'primary' | 'secondary';
  class?: string;
}

const { href, variant = 'primary', class: className = '' } = Astro.props;

const baseClasses = 'inline-block font-barlow-condensed font-semibold text-[15px] uppercase tracking-[1.5px] px-8 py-3.5 rounded transition-all duration-200';
const variants = {
  primary: 'bg-orange hover:bg-orange-hover text-white shadow-[0_4px_24px_rgba(224,98,24,0.25)] hover:shadow-[0_6px_32px_rgba(224,98,24,0.35)] hover:-translate-y-0.5',
  secondary: 'border border-border-strong text-cream hover:border-orange hover:bg-orange/[0.08]',
};
---

<a href={href} class:list={[baseClasses, variants[variant], className]}>
  <slot />
</a>
```

- [ ] **Step 2: Create SectionHeader component**

Create `src/components/SectionHeader.astro`:

```astro
---
interface Props {
  label?: string;
  title: string;
  description?: string;
  center?: boolean;
}

const { label, title, description, center = false } = Astro.props;
---

<div class:list={[center && 'text-center']}>
  {label && (
    <div class="font-barlow-condensed text-[13px] font-semibold uppercase tracking-[4px] text-orange mb-3">
      {label}
    </div>
  )}
  <h2 class="font-bebas text-[clamp(2rem,3.5vw,3.5rem)] tracking-[2px] leading-none mb-4" set:html={title} />
  {description && (
    <p class:list={['text-base font-light text-silver leading-relaxed max-w-xl', center && 'mx-auto']}>
      {description}
    </p>
  )}
</div>
```

- [ ] **Step 3: Create CTASection component**

Create `src/components/CTASection.astro`:

```astro
---
import Button from './Button.astro';
import SectionHeader from './SectionHeader.astro';

interface Props {
  label?: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonHref?: string;
}

const {
  label = 'Get Started',
  title,
  description,
  buttonText = 'Request a Quote',
  buttonHref = '/quote',
} = Astro.props;
---

<section class="py-24 px-6 lg:px-12">
  <div class="max-w-2xl mx-auto text-center bg-surface border border-border-light rounded-xl p-16 relative overflow-hidden">
    <div class="absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_at_center,rgba(224,98,24,0.04)_0%,transparent_70%)]"></div>
    <div class="relative z-10">
      <SectionHeader label={label} title={title} description={description} center />
      <div class="mt-8">
        <Button href={buttonHref}>{buttonText}</Button>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Create ProcessSteps component**

Create `src/components/ProcessSteps.astro`:

```astro
---
const steps = [
  { number: '1', title: 'Enquire', description: 'Tell us what you need and where.' },
  { number: '2', title: 'Plan', description: 'We scope the project and confirm your quote.' },
  { number: '3', title: 'Capture', description: 'On-site aerial photography, video and data capture.' },
  { number: '4', title: 'Deliver', description: 'Edited, processed files delivered to you.' },
];
---

<div class="flex flex-col md:flex-row justify-between relative max-w-4xl mx-auto">
  <!-- Connecting line (desktop only) -->
  <div class="hidden md:block absolute top-8 left-20 right-20 h-px bg-gradient-to-r from-border-subtle via-border-strong via-50% to-border-subtle"></div>

  {steps.map(step => (
    <div class="relative z-10 flex-1 text-center mb-8 md:mb-0">
      <div class="w-16 h-16 border-2 border-border-strong rounded-full flex items-center justify-center mx-auto mb-5 bg-alt-bg relative">
        <div class="absolute -inset-1.5 border border-border-subtle rounded-full"></div>
        <span class="font-bebas text-2xl text-orange">{step.number}</span>
      </div>
      <h4 class="font-barlow-condensed text-lg font-semibold uppercase tracking-wider text-cream mb-2">{step.title}</h4>
      <p class="text-sm text-muted">{step.description}</p>
    </div>
  ))}
</div>
```

- [ ] **Step 5: Commit**

```bash
git add src/components/Button.astro src/components/SectionHeader.astro src/components/CTASection.astro src/components/ProcessSteps.astro
git commit -m "feat: add shared UI components (Button, SectionHeader, CTA, ProcessSteps)"
```

---

### Task 4: Services Data File

**Files:**
- Create: `src/data/services.ts`

- [ ] **Step 1: Create the services data file with all 9 services**

Create `src/data/services.ts`:

```typescript
export interface ServiceInclude {
  title: string;
  description: string;
}

export interface ServiceAudience {
  name: string;
  detail: string;
}

export interface ServiceDeliverable {
  title: string;
  description: string;
  formats: string[];
}

export interface Service {
  title: string;
  slug: string;
  shortDescription: string;
  heroTitle: string;
  highlightWord: string;
  summary: string;
  icon: string;
  includes: ServiceInclude[];
  audience: ServiceAudience[];
  deliverables: ServiceDeliverable[];
}

export const services: Service[] = [
  {
    title: 'Property Photography and Video',
    slug: 'property-photography-video',
    shortDescription: 'Aerial imagery and video for estate agents, developers and property marketing.',
    heroTitle: 'PROPERTY PHOTOGRAPHY AND VIDEO',
    highlightWord: 'PHOTOGRAPHY',
    summary: 'Aerial photography and video that helps estate agents, developers and property owners market listings, showcase developments and stand out from the competition.',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    includes: [
      { title: 'Aerial Property Photos', description: 'High-resolution images from multiple angles showing the full property and its surroundings.' },
      { title: 'Listing Hero Shots', description: 'Standout lead images designed for use as the primary listing photo.' },
      { title: 'Exterior Showcase Video', description: 'Smooth, cinematic aerial video showcasing the property exterior and grounds.' },
      { title: 'Neighbourhood Context', description: 'Wider shots showing the surrounding area, access routes and local amenities.' },
      { title: 'Promotional Clips', description: 'Short-form video clips ready for use on listing sites, social media and websites.' },
      { title: 'Edited and Delivered', description: 'All imagery professionally processed and delivered in web and print-ready formats.' },
    ],
    audience: [
      { name: 'Estate Agents', detail: 'Elevate your listings with standout aerial imagery.' },
      { name: 'Property Developers', detail: 'Showcase developments from planning through to completion.' },
      { name: 'Holiday Lets and Airbnb', detail: 'Create visuals that drive bookings.' },
      { name: 'Homeowners', detail: 'Aerial visuals for selling or marketing your property.' },
      { name: 'Commercial Property', detail: 'Professional imagery for offices, retail and industrial units.' },
    ],
    deliverables: [
      { title: 'High-Resolution Aerial Stills', description: 'Multiple angles, professionally edited, ready for listings, brochures and web use.', formats: ['JPEG', 'PNG'] },
      { title: 'Showcase Video', description: 'Smooth cinematic aerial footage, edited with transitions and optional branding.', formats: ['MP4', '4K'] },
      { title: 'Social-Ready Clips', description: 'Short-form vertical and square cuts optimised for Instagram, TikTok and Facebook.', formats: ['Reel', 'Story'] },
      { title: 'Raw Files (Optional)', description: 'Unedited original files available on request for clients with in-house editing teams.', formats: ['DNG', 'MOV'] },
    ],
  },
  {
    title: 'Roof, Exterior and Storm Damage Inspections',
    slug: 'roof-exterior-storm-damage-inspections',
    shortDescription: 'Visual inspection and evidence capture for roofs, exteriors and storm damage.',
    heroTitle: 'ROOF, EXTERIOR AND STORM DAMAGE INSPECTIONS',
    highlightWord: 'INSPECTIONS',
    summary: 'High-resolution aerial imagery and video for visual roof inspections, exterior assessments and storm damage evidence capture — without scaffolding or ladders.',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
    includes: [
      { title: 'Roof Imagery', description: 'Detailed aerial photos of roof surfaces, ridgelines and flashing from multiple angles.' },
      { title: 'Gutter and Chimney Checks', description: 'Close-up visual checks of gutters, downpipes and chimney condition.' },
      { title: 'Facade Visuals', description: 'Full exterior imagery showing walls, cladding and render condition.' },
      { title: 'Solar Panel Visual Checks', description: 'Aerial imagery of solar panel arrays to check for visible damage or debris.' },
      { title: 'Storm Damage Evidence', description: 'Comprehensive image and video evidence of storm damage for insurance and repair planning.' },
      { title: 'Detailed Reports Ready', description: 'All imagery organised, annotated where needed, and delivered for your records.' },
    ],
    audience: [
      { name: 'Roofers', detail: 'Assess roofs before quoting without the cost of scaffolding.' },
      { name: 'Landlords', detail: 'Visual checks across your portfolio without site visits to every roof.' },
      { name: 'Property Managers', detail: 'Document property condition for maintenance planning.' },
      { name: 'Insurance Claimants', detail: 'Visual evidence to support damage claims.' },
      { name: 'Building Maintenance', detail: 'Identify visible issues across large or hard-to-access buildings.' },
    ],
    deliverables: [
      { title: 'High-Resolution Inspection Photos', description: 'Close-up and wide-angle images showing roof and exterior condition.', formats: ['JPEG', 'PNG'] },
      { title: 'Video Flyover', description: 'Full exterior video walkthrough for documentation and evidence.', formats: ['MP4', '4K'] },
      { title: 'Annotated Images', description: 'Key images marked up with notes highlighting areas of interest.', formats: ['PDF', 'JPEG'] },
      { title: 'Evidence Pack', description: 'Organised folder of all imagery, ready for insurance or contractor use.', formats: ['ZIP', 'PDF'] },
    ],
  },
  {
    title: 'Construction Progress Updates',
    slug: 'construction-progress-updates',
    shortDescription: 'Recurring aerial updates for site documentation, milestones and marketing.',
    heroTitle: 'CONSTRUCTION PROGRESS UPDATES',
    highlightWord: 'PROGRESS',
    summary: 'Recurring aerial photography and video to document construction progress, capture milestones and create marketing content throughout your build.',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M2 20h20M5 20V8l5-5 5 5v12M10 12h4M10 16h4"/></svg>',
    includes: [
      { title: 'Recurring Photo Updates', description: 'Scheduled aerial photography at regular intervals throughout your project.' },
      { title: 'Recurring Video Updates', description: 'Aerial video captures at each visit showing site progress over time.' },
      { title: 'Milestone Captures', description: 'Key-stage documentation at foundations, frame, roof and completion.' },
      { title: 'Marketing Footage', description: 'Polished aerial content for completed phases, ready for marketing use.' },
      { title: 'Project Documentation', description: 'Consistent imagery from the same angles for clear before-and-after comparison.' },
      { title: 'Flexible Scheduling', description: 'Visit frequency tailored to your project timeline — weekly, fortnightly or monthly.' },
    ],
    audience: [
      { name: 'Builders', detail: 'Document progress and keep clients informed with aerial updates.' },
      { name: 'Contractors', detail: 'Visual records for project management and reporting.' },
      { name: 'Property Developers', detail: 'Marketing content and stakeholder updates throughout the build.' },
      { name: 'Project Managers', detail: 'Consistent aerial documentation for progress tracking.' },
      { name: 'Architects', detail: 'Visual records of the build matching your design intent.' },
    ],
    deliverables: [
      { title: 'Progress Photo Sets', description: 'Consistent aerial photos from the same vantage points at each visit.', formats: ['JPEG', 'PNG'] },
      { title: 'Progress Video', description: 'Aerial video overview of the site at each documented stage.', formats: ['MP4', '4K'] },
      { title: 'Time-Lapse Compilation', description: 'Combined footage showing the full build progression over time.', formats: ['MP4'] },
      { title: 'Completion Showcase', description: 'Final polished aerial content of the completed project.', formats: ['JPEG', 'MP4'] },
    ],
  },
  {
    title: 'Business and Social Media Content',
    slug: 'business-social-media-content',
    shortDescription: 'Short-form aerial clips, reels and promo visuals for local businesses.',
    heroTitle: 'BUSINESS AND SOCIAL MEDIA CONTENT',
    highlightWord: 'CONTENT',
    summary: 'Aerial photography and video content designed for social media, websites and business promotion — helping local businesses stand out with professional visuals.',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14"/><rect x="2" y="6" width="13" height="12" rx="2"/></svg>',
    includes: [
      { title: 'Short Promotional Clips', description: 'Punchy aerial video clips designed for social media and website use.' },
      { title: 'Social Media Reels', description: 'Vertical and square format cuts ready for Instagram, TikTok and Facebook.' },
      { title: 'Website Header Footage', description: 'Cinematic aerial video for use as website hero backgrounds or banners.' },
      { title: 'Branded Promo Visuals', description: 'Aerial content styled and edited to match your brand look and feel.' },
      { title: 'Location Reveals', description: 'Dramatic aerial reveals of your business location, venue or premises.' },
      { title: 'Multiple Formats', description: 'Content delivered in all the sizes and formats you need for your platforms.' },
    ],
    audience: [
      { name: 'Local Businesses', detail: 'Stand out on social media with professional aerial content.' },
      { name: 'Restaurants and Hospitality', detail: 'Showcase your venue and location from a unique perspective.' },
      { name: 'Retail and Leisure', detail: 'Eye-catching aerial visuals for marketing campaigns.' },
      { name: 'Event Venues', detail: 'Promote your venue with dramatic aerial location reveals.' },
      { name: 'Tourism and Travel', detail: 'Attract visitors with stunning aerial content of your destination.' },
    ],
    deliverables: [
      { title: 'Social Media Reels', description: 'Vertical format clips optimised for Instagram Reels and TikTok.', formats: ['MP4', '9:16'] },
      { title: 'Website Header Video', description: 'Landscape format aerial footage for website hero sections.', formats: ['MP4', 'WebM'] },
      { title: 'Aerial Still Photos', description: 'High-resolution aerial images for social posts and marketing materials.', formats: ['JPEG', 'PNG'] },
      { title: 'Raw Footage (Optional)', description: 'Unedited footage for your own editing team to work with.', formats: ['MOV', '4K'] },
    ],
  },
  {
    title: 'Land and Plot Overviews',
    slug: 'land-plot-overviews',
    shortDescription: 'Site overview imagery and access context for landowners and developers.',
    heroTitle: 'LAND AND PLOT OVERVIEWS',
    highlightWord: 'OVERVIEWS',
    summary: 'Aerial photography and video showing land plots, site boundaries, access routes and surrounding context — for sales, planning and development marketing.',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    includes: [
      { title: 'Site Overview Imagery', description: 'Wide aerial photographs showing the full extent of the land or plot.' },
      { title: 'Plot Context', description: 'Images showing the site in relation to roads, neighbours and local features.' },
      { title: 'Access Route Visuals', description: 'Clear imagery showing access roads, entrances and approach routes.' },
      { title: 'Development Land Visuals', description: 'Aerial content highlighting development potential and site features.' },
      { title: 'Sales and Marketing Imagery', description: 'Polished aerial images and video ready for listings and brochures.' },
      { title: 'Multiple Angles', description: 'Coverage from different heights and directions to show the full picture.' },
    ],
    audience: [
      { name: 'Landowners', detail: 'Aerial visuals to support land sales or planning applications.' },
      { name: 'Developers', detail: 'Site context and overview imagery for feasibility and marketing.' },
      { name: 'Estate Agents', detail: 'Standout aerial content for land and plot listings.' },
      { name: 'Planning Consultants', detail: 'Visual context to support planning submissions.' },
      { name: 'Homeowners', detail: 'Aerial views of your land for personal records or sale preparation.' },
    ],
    deliverables: [
      { title: 'Aerial Overview Photos', description: 'Wide and mid-range aerial photos of the full site and surroundings.', formats: ['JPEG', 'PNG'] },
      { title: 'Site Flyover Video', description: 'Aerial video showing the plot, boundaries and access in context.', formats: ['MP4', '4K'] },
      { title: 'Annotated Site Images', description: 'Key images with labels showing boundaries, access and features.', formats: ['PDF', 'JPEG'] },
      { title: 'Marketing Pack', description: 'Edited selection of images and video ready for listings and brochures.', formats: ['JPEG', 'MP4'] },
    ],
  },
  {
    title: 'Agriculture and Rural Property Visuals',
    slug: 'agriculture-rural-property-visuals',
    shortDescription: 'Aerial farm overviews, estate visuals and rural property promotional content.',
    heroTitle: 'AGRICULTURE AND RURAL PROPERTY VISUALS',
    highlightWord: 'RURAL',
    summary: 'Aerial photography and video for farms, estates and rural properties — showcasing land, buildings and surroundings for marketing, documentation and management.',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 21h18M3 21V7l9-4 9 4v14"/><path d="M9 21v-6h6v6"/></svg>',
    includes: [
      { title: 'Aerial Farm Overviews', description: 'Wide aerial imagery showing the full extent of the farm or estate.' },
      { title: 'Estate Visuals', description: 'Polished aerial photography showcasing rural estates and country properties.' },
      { title: 'Field and Access Overviews', description: 'Imagery showing field layouts, boundaries, tracks and access routes.' },
      { title: 'Rural Property Promo', description: 'Marketing-ready aerial content for rural property listings and websites.' },
      { title: 'Building and Yard Coverage', description: 'Aerial views of farm buildings, yards and outbuildings.' },
      { title: 'Seasonal Coverage', description: 'Repeat visits to capture the property across different seasons if needed.' },
    ],
    audience: [
      { name: 'Farmers', detail: 'Aerial overview of your land, buildings and access routes.' },
      { name: 'Estate Owners', detail: 'Premium aerial visuals for marketing and documentation.' },
      { name: 'Rural Estate Agents', detail: 'Standout aerial content for country property listings.' },
      { name: 'Land Managers', detail: 'Visual records of land use, boundaries and infrastructure.' },
      { name: 'Rural Businesses', detail: 'Promotional aerial content for farm shops, glamping and tourism.' },
    ],
    deliverables: [
      { title: 'Aerial Overview Photos', description: 'Wide and detailed aerial images of the farm or estate.', formats: ['JPEG', 'PNG'] },
      { title: 'Estate Showcase Video', description: 'Cinematic aerial video tour of the property and grounds.', formats: ['MP4', '4K'] },
      { title: 'Field and Access Maps', description: 'Annotated aerial images showing field layouts and access.', formats: ['PDF', 'JPEG'] },
      { title: 'Marketing Materials', description: 'Edited aerial content ready for brochures, websites and social media.', formats: ['JPEG', 'MP4'] },
    ],
  },
  {
    title: '2D Mapping and Site Overviews',
    slug: '2d-mapping-site-overviews',
    shortDescription: 'Orthomosaic maps and aerial site overview outputs for planning and construction.',
    heroTitle: '2D MAPPING AND SITE OVERVIEWS',
    highlightWord: 'MAPPING',
    summary: 'Aerial orthomosaic maps and site overview outputs for construction, planning and property contexts — visual mapping from processed drone imagery.',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>',
    includes: [
      { title: 'Orthomosaic Site Maps', description: 'Stitched aerial imagery creating a single, accurate overhead view of the entire site.' },
      { title: 'Aerial Site Overviews', description: 'High-resolution overhead imagery for site documentation and planning.' },
      { title: 'Progress Mapping', description: 'Repeat mapping visits to track changes on small and medium sites over time.' },
      { title: 'Visual Mapping Outputs', description: 'Processed outputs for planning, construction and property contexts.' },
      { title: 'Exportable Files', description: 'Mapping outputs delivered in standard formats for use in other software.' },
      { title: 'Consistent Coverage', description: 'Systematic aerial capture ensuring complete and even site coverage.' },
    ],
    audience: [
      { name: 'Construction Firms', detail: 'Site mapping for planning, progress tracking and documentation.' },
      { name: 'Developers', detail: 'Visual site maps for feasibility studies and stakeholder presentations.' },
      { name: 'Planning Consultants', detail: 'Overhead imagery to support planning applications.' },
      { name: 'Land Managers', detail: 'Visual mapping of land use, access and infrastructure.' },
      { name: 'Property Professionals', detail: 'Site overview outputs for reports and documentation.' },
    ],
    deliverables: [
      { title: 'Orthomosaic Map', description: 'Single stitched overhead image of the full site at high resolution.', formats: ['TIFF', 'JPEG'] },
      { title: 'Site Overview Images', description: 'Aerial overview photos from multiple heights for context.', formats: ['JPEG', 'PNG'] },
      { title: 'Progress Comparison', description: 'Side-by-side maps from different dates showing site changes.', formats: ['PDF', 'JPEG'] },
      { title: 'GIS-Ready Export', description: 'Georeferenced files for import into mapping and GIS software.', formats: ['GeoTIFF', 'KML'] },
    ],
  },
  {
    title: '3D Site Models and Measurements',
    slug: '3d-site-models-measurements',
    shortDescription: 'Visual 3D models with area, length and height measurements from processed imagery.',
    heroTitle: '3D SITE MODELS AND MEASUREMENTS',
    highlightWord: 'MODELS',
    summary: 'Visual 3D site models and processed aerial measurement outputs for construction, land and property clients — built from drone imagery.',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
    includes: [
      { title: '3D Visual Site Models', description: 'Detailed 3D models of buildings, terrain and site features built from aerial imagery.' },
      { title: 'Building and Site Models', description: 'Visual models of structures, showing form, scale and surroundings.' },
      { title: 'Area Measurements', description: 'Area measurements derived from processed aerial imagery.' },
      { title: 'Length and Height Measurements', description: 'Distance and elevation measurements from aerial data processing.' },
      { title: 'Visual Model Outputs', description: 'Exportable 3D models for planning presentations and stakeholder review.' },
      { title: 'Multiple Output Formats', description: 'Models delivered in formats suitable for viewing, sharing and further processing.' },
    ],
    audience: [
      { name: 'Construction Firms', detail: 'Visual site models for planning, progress and stakeholder presentations.' },
      { name: 'Architects', detail: '3D context models showing existing site conditions.' },
      { name: 'Developers', detail: 'Visual models for feasibility, marketing and planning submissions.' },
      { name: 'Land Professionals', detail: 'Terrain models and measurement outputs for land assessment.' },
      { name: 'Property Owners', detail: 'Visual models of your property for records or sale preparation.' },
    ],
    deliverables: [
      { title: '3D Site Model', description: 'Interactive 3D model of the site viewable in a web browser or 3D software.', formats: ['OBJ', 'GLB'] },
      { title: 'Measurement Report', description: 'Processed measurements including area, length and height data.', formats: ['PDF', 'CSV'] },
      { title: 'Textured Model', description: 'Photorealistic 3D model with aerial imagery mapped to surfaces.', formats: ['OBJ', 'PLY'] },
      { title: 'Model Screenshots', description: 'Key views of the 3D model exported as high-resolution images.', formats: ['JPEG', 'PNG'] },
    ],
  },
  {
    title: 'Stockpile Volume Estimates',
    slug: 'stockpile-volume-estimates',
    shortDescription: 'Volume estimates and progress comparisons for aggregates, earthworks and materials.',
    heroTitle: 'STOCKPILE VOLUME ESTIMATES',
    highlightWord: 'VOLUME',
    summary: 'Aerial volume estimates for stockpiles, earthworks and materials — helping you track quantities, monitor changes and plan logistics.',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
    includes: [
      { title: 'Stockpile Volume Estimates', description: 'Volume estimates derived from aerial imagery and photogrammetry processing.' },
      { title: 'Progress Comparisons', description: 'Volume change tracking across multiple visits to monitor usage or accumulation.' },
      { title: 'Material Monitoring', description: 'Ongoing aerial monitoring of stockpile quantities over time.' },
      { title: 'Visual Reports', description: 'Clear visual outputs showing stockpile extents, volumes and changes.' },
      { title: 'Multiple Stockpiles', description: 'Coverage of multiple stockpiles across a site in a single visit.' },
      { title: 'Repeat Visits', description: 'Scheduled return visits for ongoing volume tracking and comparison.' },
    ],
    audience: [
      { name: 'Construction Yards', detail: 'Track material quantities across your yard or depot.' },
      { name: 'Aggregates Suppliers', detail: 'Volume estimates for stock management and sales.' },
      { name: 'Earthworks Contractors', detail: 'Monitor cut and fill volumes during earthworks projects.' },
      { name: 'Waste Management', detail: 'Track waste stockpile volumes for compliance and reporting.' },
      { name: 'Quarry Operators', detail: 'Aerial volume estimates for extraction tracking.' },
    ],
    deliverables: [
      { title: 'Volume Estimate Report', description: 'Estimated volumes for each stockpile with supporting aerial imagery.', formats: ['PDF'] },
      { title: 'Comparison Report', description: 'Side-by-side volume comparisons from different dates.', formats: ['PDF'] },
      { title: 'Aerial Overview Photos', description: 'High-resolution overhead and angled photos of all stockpiles.', formats: ['JPEG', 'PNG'] },
      { title: '3D Stockpile Model', description: 'Visual 3D model of stockpile surfaces used for volume calculation.', formats: ['OBJ', 'PDF'] },
    ],
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/services.ts
git commit -m "feat: add services data file with all 9 services"
```

---

### Task 5: Homepage

**Files:**
- Create: `src/components/ServiceCard.astro`, `src/components/ValueCard.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create ServiceCard component**

Create `src/components/ServiceCard.astro`:

```astro
---
interface Props {
  title: string;
  description: string;
  icon: string;
  href: string;
}

const { title, description, icon, href } = Astro.props;
---

<a href={href} class="group block bg-surface border border-border-subtle rounded-lg p-8 relative overflow-hidden transition-all duration-300 hover:border-border-orange hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
  <!-- Top glow line -->
  <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

  <!-- Icon -->
  <div class="w-12 h-12 bg-orange/[0.08] border border-orange/[0.15] rounded-[10px] flex items-center justify-center mb-5 text-orange">
    <Fragment set:html={icon} />
  </div>

  <h3 class="font-barlow-condensed text-lg font-semibold uppercase tracking-wide text-cream mb-2.5">{title}</h3>
  <p class="text-sm text-muted leading-relaxed">{description}</p>

  <!-- Arrow -->
  <span class="absolute bottom-5 right-5 text-orange opacity-0 translate-x-[-8px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">&rarr;</span>
</a>
```

- [ ] **Step 2: Create ValueCard component**

Create `src/components/ValueCard.astro`:

```astro
---
interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<div class="bg-surface border border-border-subtle rounded-lg p-6 relative">
  <div class="absolute top-3 left-0 w-[3px] h-6 bg-orange rounded-r"></div>
  <h4 class="font-barlow-condensed text-[15px] font-semibold uppercase tracking-wide text-cream mb-1.5">{title}</h4>
  <p class="text-sm text-muted leading-relaxed">{description}</p>
</div>
```

- [ ] **Step 3: Build the full homepage**

Replace `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Button from '../components/Button.astro';
import SectionHeader from '../components/SectionHeader.astro';
import ServiceCard from '../components/ServiceCard.astro';
import ValueCard from '../components/ValueCard.astro';
import ProcessSteps from '../components/ProcessSteps.astro';
import CTASection from '../components/CTASection.astro';
import { services } from '../data/services';

const sectors = [
  'Estate Agents', 'Property Developers', 'Construction',
  'Roofing & Property Maintenance', 'Homeowners', 'Landlords',
  'Farms & Rural Estates', 'Local Businesses', 'Hospitality & Tourism',
];

const valuePoints = [
  { title: 'Premium Quality', description: 'High-resolution aerial imagery processed and delivered to a professional standard.' },
  { title: 'Business-Ready Outputs', description: 'Every deliverable is built for real use — listings, reports, marketing and documentation.' },
  { title: 'Flexible Service', description: 'From single-shoot projects to recurring site coverage — scaled to fit your needs.' },
  { title: 'Clear Deliverables', description: 'You know exactly what you are getting. No ambiguity, no surprises.' },
];
---

<BaseLayout title="Home" description="Professional drone photography, video, inspections, mapping and visual measurement services across Kent and beyond.">

  <!-- HERO -->
  <section class="relative min-h-[85vh] flex items-center justify-center text-center px-6 lg:px-12 py-20 overflow-hidden">
    <!-- Background effects -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(224,98,24,0.07)_0%,transparent_50%),radial-gradient(ellipse_at_70%_30%,rgba(224,98,24,0.04)_0%,transparent_50%)]"></div>
    <div class="absolute inset-0" style="background-image: linear-gradient(rgba(224,98,24,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(224,98,24,0.03) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%); -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);"></div>
    <div class="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent"></div>

    <div class="relative z-10 max-w-3xl">
      <img src="/bird-icon.png" alt="" class="h-16 mx-auto mb-4 drop-shadow-[0_0_40px_rgba(224,98,24,0.3)]" />

      <div class="font-barlow-condensed text-sm font-semibold uppercase tracking-[4px] text-orange mb-6 flex items-center justify-center gap-4">
        <span class="w-10 h-px bg-gradient-to-r from-transparent to-orange"></span>
        Aerial Photo &middot; Video &middot; Inspection &middot; Mapping
        <span class="w-10 h-px bg-gradient-to-l from-transparent to-orange"></span>
      </div>

      <h1 class="font-bebas text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.95] tracking-[2px] mb-6">
        AERIAL VISUALS THAT<br />
        <span class="text-orange">ELEVATE</span> PROPERTY,<br />
        CONSTRUCTION<br />
        AND BUSINESS
      </h1>

      <p class="text-[17px] font-light text-silver max-w-xl mx-auto leading-relaxed mb-10">
        High-quality drone photography, video, inspections, mapping and visual measurement services for clients across Kent and beyond.
      </p>

      <div class="flex gap-4 justify-center flex-wrap">
        <Button href="/quote">Request a Quote</Button>
        <Button href="#services" variant="secondary">View Services &darr;</Button>
      </div>
    </div>
  </section>

  <!-- TRUST STRIP -->
  <div class="border-y border-border-subtle bg-alt-bg py-8 px-6 lg:px-12">
    <div class="max-w-7xl mx-auto flex flex-wrap justify-center gap-12 lg:gap-16">
      {[
        { icon: '&#9678;', text: 'Professional\nAerial Imagery' },
        { icon: '&#9889;', text: 'Fast\nTurnaround' },
        { icon: '&#9673;', text: 'Visual\nInspections' },
        { icon: '&#11041;', text: 'Mapping\nOutputs' },
        { icon: '&#10022;', text: 'Quote-Based\nService' },
      ].map(item => (
        <div class="flex items-center gap-3.5">
          <div class="w-10 h-10 border border-border-orange rounded-lg flex items-center justify-center text-orange text-lg bg-orange/[0.05]">
            <span set:html={item.icon} />
          </div>
          <div class="font-barlow-condensed text-[13px] font-medium uppercase tracking-wider text-silver whitespace-pre-line leading-tight">
            {item.text}
          </div>
        </div>
      ))}
    </div>
  </div>

  <!-- SERVICES -->
  <section id="services" class="py-24 px-6 lg:px-12">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-14">
        <SectionHeader
          label="What We Offer"
          title="OUR SERVICES"
          description="Aerial solutions for property, construction, land and business — from a single shoot to ongoing project coverage."
          center
        />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(service => (
          <ServiceCard
            title={service.title}
            description={service.shortDescription}
            icon={service.icon}
            href={`/services/${service.slug}`}
          />
        ))}
      </div>
    </div>
  </section>

  <!-- WHY CHOOSE US -->
  <section class="bg-alt-bg py-24 px-6 lg:px-12">
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
      <div class="flex-1">
        <SectionHeader
          label="Why Kestrel Studios"
          title="BUILT FOR<br />REAL BUSINESS<br />RESULTS"
          description="We deliver practical aerial outputs that help you sell, report, document and market — not just pretty footage."
        />
      </div>
      <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {valuePoints.map(point => (
          <ValueCard title={point.title} description={point.description} />
        ))}
      </div>
    </div>
  </section>

  <!-- SECTORS -->
  <section id="sectors" class="py-24 px-6 lg:px-12">
    <div class="max-w-7xl mx-auto text-center">
      <SectionHeader
        label="Who We Work With"
        title="SECTORS WE SERVE"
        description="From residential homeowners to commercial developers — aerial services for every property need."
        center
      />
      <div class="flex flex-wrap gap-3 justify-center mt-12">
        {sectors.map(sector => (
          <div class="bg-surface border border-border-light rounded-md px-6 py-3.5 font-barlow-condensed text-sm font-medium uppercase tracking-wider text-silver hover:border-border-strong hover:text-cream hover:bg-orange/[0.05] transition-all duration-200">
            {sector}
          </div>
        ))}
      </div>
    </div>
  </section>

  <!-- PROCESS -->
  <section class="bg-alt-bg py-24 px-6 lg:px-12">
    <div class="max-w-7xl mx-auto text-center">
      <SectionHeader
        label="How It Works"
        title="FROM ENQUIRY TO DELIVERY"
        center
      />
      <div class="mt-14">
        <ProcessSteps />
      </div>
    </div>
  </section>

  <!-- CTA -->
  <CTASection
    title="READY FOR AERIAL<br />VISUALS THAT WORK?"
    description="Get in touch for a free, no-obligation quote. Tell us about your project and we'll take it from there."
  />

</BaseLayout>
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Expected: Full homepage with all sections rendering — hero with bird icon and glow, trust strip, 9 service cards, why section, sectors, process steps, CTA, footer. Service cards link to `/services/[slug]`.

- [ ] **Step 5: Commit**

```bash
git add src/components/ServiceCard.astro src/components/ValueCard.astro src/pages/index.astro
git commit -m "feat: build complete homepage with all sections"
```

---

### Task 6: Service Page Template

**Files:**
- Create: `src/components/IncludedItem.astro`, `src/components/DeliverableCard.astro`, `src/pages/services/[slug].astro`

- [ ] **Step 1: Create IncludedItem component**

Create `src/components/IncludedItem.astro`:

```astro
---
interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<div class="bg-surface border border-border-subtle rounded-lg p-6 flex gap-4 items-start">
  <div class="w-7 h-7 min-w-[28px] bg-orange/[0.08] border border-border-orange rounded-md flex items-center justify-center text-orange text-sm">
    &#10003;
  </div>
  <div>
    <h4 class="font-barlow-condensed text-[15px] font-semibold uppercase tracking-wide text-cream mb-1">{title}</h4>
    <p class="text-sm text-muted leading-relaxed">{description}</p>
  </div>
</div>
```

- [ ] **Step 2: Create DeliverableCard component**

Create `src/components/DeliverableCard.astro`:

```astro
---
interface Props {
  title: string;
  description: string;
  formats: string[];
}

const { title, description, formats } = Astro.props;
---

<div class="bg-surface border border-border-subtle rounded-lg p-7 relative overflow-hidden">
  <div class="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-orange to-transparent"></div>
  <h4 class="font-barlow-condensed text-base font-semibold uppercase tracking-wide text-cream mb-2">{title}</h4>
  <p class="text-sm text-muted leading-relaxed">{description}</p>
  <div class="flex gap-2 mt-3">
    {formats.map(format => (
      <span class="bg-orange/[0.08] border border-orange/[0.15] rounded px-2.5 py-0.5 font-barlow-condensed text-[11px] font-medium uppercase tracking-wider text-orange">
        {format}
      </span>
    ))}
  </div>
</div>
```

- [ ] **Step 3: Create dynamic service page**

Create `src/pages/services/[slug].astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Button from '../../components/Button.astro';
import SectionHeader from '../../components/SectionHeader.astro';
import IncludedItem from '../../components/IncludedItem.astro';
import DeliverableCard from '../../components/DeliverableCard.astro';
import CTASection from '../../components/CTASection.astro';
import { services } from '../../data/services';

export function getStaticPaths() {
  return services.map(service => ({
    params: { slug: service.slug },
    props: { service },
  }));
}

const { service } = Astro.props;

// Build hero title with highlight
const heroTitleHtml = service.heroTitle.replace(
  service.highlightWord,
  `<span class="text-orange">${service.highlightWord}</span>`
);
---

<BaseLayout title={service.title} description={service.summary}>

  <!-- HERO -->
  <section class="relative pt-28 pb-20 px-6 lg:px-12 overflow-hidden">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(224,98,24,0.06)_0%,transparent_50%)]"></div>
    <div class="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-bg to-transparent"></div>

    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center relative z-10">
      <div class="flex-1">
        <div class="font-barlow-condensed text-[13px] font-medium uppercase tracking-[1.5px] text-muted mb-5">
          Services <span class="text-orange">&rarr;</span> {service.title}
        </div>
        <h1 class="font-bebas text-[clamp(2.8rem,5vw,4rem)] leading-[0.95] tracking-[2px] mb-5" set:html={heroTitleHtml} />
        <p class="text-[17px] font-light text-silver leading-relaxed mb-7 max-w-lg">{service.summary}</p>
        <Button href="/quote">Request a Quote</Button>
      </div>
      <div class="flex-1 w-full">
        <div class="aspect-[4/3] bg-surface border border-border-light rounded-lg flex items-center justify-center text-muted text-sm relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-orange/[0.03] to-transparent"></div>
          <span class="relative">Placeholder — {service.title.toLowerCase()} image</span>
        </div>
      </div>
    </div>
  </section>

  <!-- WHAT'S INCLUDED -->
  <section class="bg-alt-bg py-24 px-6 lg:px-12">
    <div class="max-w-7xl mx-auto">
      <SectionHeader
        label="What's Included"
        title={`EVERYTHING YOU NEED`}
      />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        {service.includes.map(item => (
          <IncludedItem title={item.title} description={item.description} />
        ))}
      </div>
    </div>
  </section>

  <!-- WHO IT'S FOR -->
  <section class="py-24 px-6 lg:px-12">
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
      <div class="flex-1">
        <SectionHeader
          label="Who It's For"
          title="BUILT FOR YOUR SECTOR"
        />
        <ul class="mt-8 space-y-0">
          {service.audience.map(item => (
            <li class="py-4 border-b border-border-subtle flex items-start gap-3.5 text-silver">
              <span class="w-2 h-2 bg-orange rounded-sm rotate-45 mt-1.5 shrink-0"></span>
              <span><strong class="text-cream font-medium">{item.name}</strong> — {item.detail}</span>
            </li>
          ))}
        </ul>
      </div>
      <div class="flex-1 w-full">
        <div class="aspect-[4/3] bg-surface border border-border-light rounded-lg flex items-center justify-center text-muted text-sm">
          Placeholder — example image
        </div>
      </div>
    </div>
  </section>

  <!-- DELIVERABLES -->
  <section class="bg-alt-bg py-24 px-6 lg:px-12">
    <div class="max-w-7xl mx-auto">
      <SectionHeader
        label="Example Deliverables"
        title="WHAT YOU COULD RECEIVE"
      />
      <p class="text-sm text-muted max-w-xl leading-relaxed mt-[-8px]">
        Deliverables vary depending on your project scope and quote. Below are examples of what we can provide.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        {service.deliverables.map(item => (
          <DeliverableCard title={item.title} description={item.description} formats={item.formats} />
        ))}
      </div>
    </div>
  </section>

  <!-- CTA -->
  <CTASection
    title={`NEED ${service.title.toUpperCase().split(' ').slice(0, 3).join(' ')}?`}
    description="Tell us about your project and we'll put together a quote. No obligation, fast response."
  />

</BaseLayout>
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Visit `http://localhost:4321/services/property-photography-video` and at least 2 other service pages (e.g. `/services/stockpile-volume-estimates`, `/services/2d-mapping-site-overviews`). Check all sections render, all data displays, breadcrumbs are correct, and the CTA links to `/quote`.

- [ ] **Step 5: Commit**

```bash
git add src/components/IncludedItem.astro src/components/DeliverableCard.astro src/pages/services/
git commit -m "feat: add data-driven service pages with dynamic routing"
```

---

### Task 7: About Page

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Build the About page**

Create `src/pages/about.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SectionHeader from '../components/SectionHeader.astro';
import CTASection from '../components/CTASection.astro';

const values = [
  {
    title: 'No Wasted Time',
    description: 'We scope, shoot and deliver efficiently. You get your files fast without chasing.',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  },
  {
    title: 'Honest Outputs',
    description: 'We deliver what we promise. No overclaiming, no inflated expectations — just professional results.',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>',
  },
  {
    title: 'Quality First',
    description: 'Every image, video and output is processed to a standard that reflects well on your business.',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
  },
];

const approach = [
  { number: '01', title: 'Scoped to Your Needs', description: 'Every project starts with understanding what you actually need. We don\'t sell fixed packages — we build a scope around your requirements.' },
  { number: '02', title: 'Clear Quoting', description: 'You get a written quote before any work begins. No surprises, no hidden costs, no vague estimates.' },
  { number: '03', title: 'Professional Capture', description: 'On-site work is planned, safe and efficient. We operate within all CAA regulations and respect your site and schedule.' },
  { number: '04', title: 'Delivered Ready to Use', description: 'Files are edited, processed and delivered in the formats you need — ready for listings, reports, social media or presentations.' },
];

const credentials = [
  { title: 'CAA Registered', subtitle: 'UK Civil Aviation Authority', icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
  { title: 'Fully Insured', subtitle: 'Public liability coverage', icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12l2 2 4-4"/></svg>' },
  { title: 'Risk Assessed', subtitle: 'Site-specific flight planning', icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>' },
  { title: 'Professional Service', subtitle: 'Clear communication throughout', icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>' },
];
---

<BaseLayout title="About" description="Professional drone services built for real results. Learn about Kestrel Studios and our approach to aerial photography, video and mapping.">

  <!-- HERO -->
  <section class="relative pt-28 pb-20 px-6 lg:px-12 text-center overflow-hidden">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(224,98,24,0.05)_0%,transparent_60%)]"></div>
    <div class="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-bg to-transparent"></div>
    <div class="relative z-10 max-w-2xl mx-auto">
      <SectionHeader
        label="About Kestrel Studios"
        title='AERIAL SERVICES<br />BUILT FOR <span class="text-orange">REAL</span><br />RESULTS'
        description="We provide drone photography, video, inspections, mapping and visual measurement services for property, construction, land and local business clients across Kent and the South East."
        center
      />
    </div>
  </section>

  <!-- OUR STORY -->
  <section class="bg-alt-bg py-24 px-6 lg:px-12">
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
      <div class="flex-1">
        <SectionHeader label="Our Story" title="WHO WE ARE" />
        <div class="mt-6 space-y-5 text-base font-light text-silver leading-relaxed">
          <p><strong class="text-cream font-medium">Kestrel Studios</strong> is a professional drone services company based in Kent, delivering aerial photography, video, visual inspections, mapping and measurement outputs for businesses and individuals.</p>
          <p>We work with estate agents, property developers, construction firms, roofers, landowners, farmers and local businesses — anyone who needs high-quality aerial content to market, document or assess their property or site.</p>
          <p>Every project is scoped individually, quoted clearly and delivered to a professional standard. No templates, no generic packages — just practical aerial outputs that serve your specific needs.</p>
        </div>
      </div>
      <div class="flex-1 w-full relative">
        <div class="aspect-[4/3] bg-surface border border-border-light rounded-lg flex items-center justify-center text-muted text-sm">
          Placeholder — operator / drone image
        </div>
        <div class="absolute -bottom-4 -right-4 bg-surface border border-border-orange rounded-lg px-6 py-5 text-center">
          <div class="font-bebas text-4xl text-orange leading-none">UK</div>
          <div class="font-barlow-condensed text-[11px] font-semibold uppercase tracking-[1.5px] text-muted mt-1">CAA Registered</div>
        </div>
      </div>
    </div>
  </section>

  <!-- VALUES -->
  <section class="py-24 px-6 lg:px-12">
    <div class="max-w-7xl mx-auto text-center">
      <SectionHeader label="What Drives Us" title="OUR VALUES" center />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {values.map(value => (
          <div class="bg-surface border border-border-subtle rounded-lg p-10 text-center relative overflow-hidden">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-orange"></div>
            <div class="w-14 h-14 bg-orange/[0.06] border border-border-light rounded-xl flex items-center justify-center mx-auto mb-5 text-orange">
              <Fragment set:html={value.icon} />
            </div>
            <h3 class="font-barlow-condensed text-lg font-semibold uppercase tracking-wide text-cream mb-3">{value.title}</h3>
            <p class="text-sm text-muted leading-relaxed">{value.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  <!-- APPROACH -->
  <section class="bg-alt-bg py-24 px-6 lg:px-12">
    <div class="max-w-7xl mx-auto">
      <SectionHeader label="Our Approach" title="HOW WE WORK" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        {approach.map(item => (
          <div class="bg-surface border border-border-subtle rounded-lg p-7 flex gap-5 items-start">
            <div class="font-bebas text-3xl text-orange/20 leading-none min-w-[32px]">{item.number}</div>
            <div>
              <h4 class="font-barlow-condensed text-base font-semibold uppercase tracking-wide text-cream mb-1.5">{item.title}</h4>
              <p class="text-sm text-muted leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>

  <!-- CREDENTIALS -->
  <section class="py-24 px-6 lg:px-12">
    <div class="max-w-7xl mx-auto text-center">
      <SectionHeader label="Credentials" title="OPERATING TO STANDARD" center />
      <div class="flex flex-wrap justify-center gap-12 mt-12">
        {credentials.map(cred => (
          <div class="text-center">
            <div class="w-16 h-16 bg-orange/[0.06] border border-border-light rounded-xl flex items-center justify-center mx-auto mb-4 text-orange">
              <Fragment set:html={cred.icon} />
            </div>
            <h4 class="font-barlow-condensed text-sm font-semibold uppercase tracking-wider text-cream mb-1">{cred.title}</h4>
            <p class="text-xs text-muted">{cred.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  <!-- CTA -->
  <CTASection
    label="Work With Us"
    title="READY TO GET STARTED?"
    description="Whether it's a one-off shoot or ongoing project coverage, we'd love to hear about what you need."
  />

</BaseLayout>
```

- [ ] **Step 2: Verify in browser**

Visit `http://localhost:4321/about`. Check all sections render, CAA badge overlaps image correctly, values cards have top orange bar, approach items have faded numbers.

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: add About page"
```

---

### Task 8: Quote Page with Form

**Files:**
- Create: `src/components/QuoteForm.astro`, `src/pages/quote.astro`

- [ ] **Step 1: Create QuoteForm component**

Create `src/components/QuoteForm.astro`:

```astro
---
import { services } from '../data/services';
---

<form id="quote-form" class="space-y-0">
  <div class="font-barlow-condensed text-[15px] font-semibold uppercase tracking-[2px] text-cream pb-3 border-b border-border-subtle mb-6">
    Your Details
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
    <div>
      <label class="block font-barlow-condensed text-[13px] font-semibold uppercase tracking-[1.5px] text-silver mb-2">
        Full Name <span class="text-orange">*</span>
      </label>
      <input type="text" required placeholder="Your full name"
        class="w-full bg-surface border border-border-light rounded-md px-4 py-3.5 text-cream font-barlow text-[15px] outline-none transition-all focus:border-orange/40 focus:shadow-[0_0_0_3px_rgba(224,98,24,0.08)] placeholder:text-muted" />
    </div>
    <div>
      <label class="block font-barlow-condensed text-[13px] font-semibold uppercase tracking-[1.5px] text-silver mb-2">
        Email Address <span class="text-orange">*</span>
      </label>
      <input type="email" required placeholder="you@example.com"
        class="w-full bg-surface border border-border-light rounded-md px-4 py-3.5 text-cream font-barlow text-[15px] outline-none transition-all focus:border-orange/40 focus:shadow-[0_0_0_3px_rgba(224,98,24,0.08)] placeholder:text-muted" />
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
    <div>
      <label class="block font-barlow-condensed text-[13px] font-semibold uppercase tracking-[1.5px] text-silver mb-2">
        Phone Number
      </label>
      <input type="tel" placeholder="07XXX XXX XXX"
        class="w-full bg-surface border border-border-light rounded-md px-4 py-3.5 text-cream font-barlow text-[15px] outline-none transition-all focus:border-orange/40 focus:shadow-[0_0_0_3px_rgba(224,98,24,0.08)] placeholder:text-muted" />
    </div>
    <div>
      <label class="block font-barlow-condensed text-[13px] font-semibold uppercase tracking-[1.5px] text-silver mb-2">
        Business Name
      </label>
      <input type="text" placeholder="Your company (if applicable)"
        class="w-full bg-surface border border-border-light rounded-md px-4 py-3.5 text-cream font-barlow text-[15px] outline-none transition-all focus:border-orange/40 focus:shadow-[0_0_0_3px_rgba(224,98,24,0.08)] placeholder:text-muted" />
    </div>
  </div>

  <div class="font-barlow-condensed text-[15px] font-semibold uppercase tracking-[2px] text-cream pb-3 border-b border-border-subtle mb-6 mt-10">
    Project Details
  </div>

  <div class="mb-6">
    <label class="block font-barlow-condensed text-[13px] font-semibold uppercase tracking-[1.5px] text-silver mb-2">
      Service Required <span class="text-orange">*</span>
    </label>
    <select required
      class="w-full bg-surface border border-border-light rounded-md px-4 py-3.5 text-cream font-barlow text-[15px] outline-none transition-all focus:border-orange/40 focus:shadow-[0_0_0_3px_rgba(224,98,24,0.08)] appearance-none bg-no-repeat bg-[right_16px_center] pr-10"
      style="background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23616878' viewBox='0 0 16 16'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E&quot;);">
      <option value="" disabled selected>Select a service</option>
      {services.map(service => (
        <option value={service.slug}>{service.title}</option>
      ))}
      <option value="not-sure">Not sure — need advice</option>
    </select>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
    <div>
      <label class="block font-barlow-condensed text-[13px] font-semibold uppercase tracking-[1.5px] text-silver mb-2">
        Project Location <span class="text-orange">*</span>
      </label>
      <input type="text" required placeholder="Town, postcode or site address"
        class="w-full bg-surface border border-border-light rounded-md px-4 py-3.5 text-cream font-barlow text-[15px] outline-none transition-all focus:border-orange/40 focus:shadow-[0_0_0_3px_rgba(224,98,24,0.08)] placeholder:text-muted" />
    </div>
    <div>
      <label class="block font-barlow-condensed text-[13px] font-semibold uppercase tracking-[1.5px] text-silver mb-2">
        Preferred Date
      </label>
      <input type="date"
        class="w-full bg-surface border border-border-light rounded-md px-4 py-3.5 text-muted font-barlow text-[15px] outline-none transition-all focus:border-orange/40 focus:shadow-[0_0_0_3px_rgba(224,98,24,0.08)]" />
    </div>
  </div>

  <div class="mb-6">
    <label class="block font-barlow-condensed text-[13px] font-semibold uppercase tracking-[1.5px] text-silver mb-2">
      Project Details <span class="text-orange">*</span>
    </label>
    <textarea required rows="6" placeholder="Tell us about your project — what do you need, what's the context, any specific requirements?"
      class="w-full bg-surface border border-border-light rounded-md px-4 py-3.5 text-cream font-barlow text-[15px] outline-none transition-all focus:border-orange/40 focus:shadow-[0_0_0_3px_rgba(224,98,24,0.08)] placeholder:text-muted resize-y"></textarea>
  </div>

  <div class="mb-6">
    <label class="block font-barlow-condensed text-[13px] font-semibold uppercase tracking-[1.5px] text-silver mb-2">
      Reference Images <span class="text-muted font-normal normal-case tracking-normal">(Optional)</span>
    </label>
    <div class="bg-surface border-2 border-dashed border-orange/[0.15] rounded-lg p-8 text-center cursor-pointer hover:border-orange/30 hover:bg-orange/[0.02] transition-all">
      <div class="text-orange mb-2">
        <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" class="mx-auto"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
      </div>
      <div class="text-sm text-silver">Click to upload or drag files here</div>
      <div class="text-xs text-muted mt-1">PNG, JPG, PDF up to 10MB each</div>
    </div>
  </div>

  <button type="submit"
    class="w-full bg-orange hover:bg-orange-hover text-white py-4 rounded font-barlow-condensed font-semibold text-base uppercase tracking-[1.5px] shadow-[0_4px_24px_rgba(224,98,24,0.25)] hover:shadow-[0_6px_32px_rgba(224,98,24,0.35)] transition-all mt-8 border-none cursor-pointer">
    Submit Quote Request
  </button>
</form>

<!-- Success state -->
<div id="quote-success" class="hidden text-center py-16">
  <div class="w-16 h-16 bg-orange/[0.08] border border-border-orange rounded-full flex items-center justify-center mx-auto mb-6 text-orange text-2xl">
    &#10003;
  </div>
  <h3 class="font-bebas text-3xl tracking-wider mb-3">QUOTE REQUEST SENT</h3>
  <p class="text-silver max-w-md mx-auto leading-relaxed">Thanks for getting in touch. We'll review your request and get back to you within 24 hours.</p>
</div>

<script>
  const form = document.getElementById('quote-form');
  const success = document.getElementById('quote-success');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    form.classList.add('hidden');
    success?.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
</script>
```

- [ ] **Step 2: Build the Quote page**

Create `src/pages/quote.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SectionHeader from '../components/SectionHeader.astro';
import QuoteForm from '../components/QuoteForm.astro';
---

<BaseLayout title="Get a Quote" description="Request a free, no-obligation quote for drone photography, video, inspections or mapping services.">

  <!-- HERO -->
  <section class="relative pt-28 pb-14 px-6 lg:px-12 text-center overflow-hidden">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(224,98,24,0.05)_0%,transparent_60%)]"></div>
    <div class="relative z-10 max-w-xl mx-auto">
      <SectionHeader
        label="Get a Quote"
        title="TELL US ABOUT<br />YOUR PROJECT"
        description="Fill in the details below and we'll get back to you with a clear, no-obligation quote. The more detail you provide, the more accurate your quote will be."
        center
      />
    </div>
  </section>

  <!-- FORM SECTION -->
  <section class="pb-24 px-6 lg:px-12">
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">

      <!-- Form -->
      <div class="flex-[2]">
        <QuoteForm />
      </div>

      <!-- Sidebar -->
      <div class="flex-1 space-y-5">

        <!-- What happens next -->
        <div class="bg-surface border border-border-subtle rounded-lg p-7">
          <h4 class="font-barlow-condensed text-[15px] font-semibold uppercase tracking-wider text-cream mb-4 flex items-center gap-2.5">
            <span class="text-orange">&#9678;</span> What Happens Next
          </h4>
          <ul class="space-y-0">
            {[
              { num: '1', title: 'We Review', desc: 'We read your request and assess the scope.' },
              { num: '2', title: 'We Quote', desc: 'You receive a clear, written quote — no obligation.' },
              { num: '3', title: 'We Schedule', desc: 'Once approved, we book the capture date.' },
              { num: '4', title: 'We Deliver', desc: 'Edited files sent to you, ready to use.' },
            ].map(step => (
              <li class="flex gap-3.5 items-start py-3 border-b border-border-subtle last:border-b-0">
                <div class="w-7 h-7 min-w-[28px] bg-orange/[0.08] border border-border-orange rounded-full flex items-center justify-center font-bebas text-sm text-orange">
                  {step.num}
                </div>
                <div>
                  <div class="text-sm font-medium text-cream">{step.title}</div>
                  <div class="text-[13px] text-muted">{step.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <!-- Response time -->
        <div class="bg-surface border border-border-subtle rounded-lg p-7">
          <h4 class="font-barlow-condensed text-[15px] font-semibold uppercase tracking-wider text-cream mb-3 flex items-center gap-2.5">
            <span class="text-orange">&#9889;</span> Response Time
          </h4>
          <p class="text-sm text-muted leading-relaxed">We typically respond within 24 hours on working days. For urgent requests, call us directly.</p>
        </div>

        <!-- Direct contact -->
        <div class="bg-surface border border-border-subtle rounded-lg p-7">
          <h4 class="font-barlow-condensed text-[15px] font-semibold uppercase tracking-wider text-cream mb-4 flex items-center gap-2.5">
            <span class="text-orange">&#10022;</span> Contact Us Directly
          </h4>
          <div class="space-y-2.5">
            <div class="flex items-center gap-3 text-sm text-silver">
              <span class="text-orange w-5 text-center">&#9993;</span>
              <span>hello@kestrelstudios.uk</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-silver">
              <span class="text-orange w-5 text-center">&#9742;</span>
              <span>Phone number placeholder</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-silver">
              <span class="text-orange w-5 text-center">&#9673;</span>
              <span>Kent, United Kingdom</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

</BaseLayout>
```

- [ ] **Step 3: Verify in browser**

Visit `http://localhost:4321/quote`. Check:
- All form fields render and are interactive
- Service dropdown lists all 9 services + "Not sure"
- Required fields show browser validation
- Submit button triggers success state
- Sidebar cards display correctly
- Mobile layout stacks sidebar below form

- [ ] **Step 4: Commit**

```bash
git add src/components/QuoteForm.astro src/pages/quote.astro
git commit -m "feat: add Quote page with form and sidebar"
```

---

### Task 9: Responsive Polish and Final Verification

**Files:**
- Modify: Various components as needed

- [ ] **Step 1: Test all pages at mobile viewport (375px)**

Open dev tools, set viewport to 375px width. Visit each page:
- `/` — hero text scales down, service grid goes single column, trust strip wraps, process steps stack vertically
- `/services/property-photography-video` — hero stacks vertically, included grid goes single column
- `/about` — all sections stack, CAA badge stays positioned
- `/quote` — form full width, sidebar stacks below

Fix any overflow, text clipping, or broken layouts found.

- [ ] **Step 2: Test all pages at tablet viewport (768px)**

Set viewport to 768px. Check:
- Service grid shows 2 columns
- Split layouts still readable
- Nav hamburger works

- [ ] **Step 3: Test all internal links**

Click through every nav link, every service card, every CTA button, every footer link. Confirm all routes work and no 404s appear.

- [ ] **Step 4: Run production build**

```bash
npm run build
```

Expected: Build completes with no errors. Output in `dist/` directory. Should generate:
- `index.html`
- `about/index.html`
- `quote/index.html`
- `services/property-photography-video/index.html` (and 8 more service pages)

- [ ] **Step 5: Preview production build**

```bash
npm run preview
```

Expected: Site serves from `dist/` and all pages load correctly at `http://localhost:4321`.

- [ ] **Step 6: Commit final state**

```bash
git add -A
git commit -m "feat: complete Kestrel Studios website — all pages, responsive, production-ready"
```

---

## Plan Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Project scaffolding | Config, styles, assets |
| 2 | Base layout, Nav, Footer | Layout + 3 components |
| 3 | Shared UI components | 4 components |
| 4 | Services data | 1 data file (9 services) |
| 5 | Homepage | 2 components + page |
| 6 | Service page template | 2 components + dynamic route |
| 7 | About page | 1 page |
| 8 | Quote page with form | 1 component + page |
| 9 | Responsive polish + build | Testing + verification |
