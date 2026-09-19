# Aurelle — Bridal Makeup &amp; Wedding Styling Studio Template

A complete, production-ready multipurpose HTML template for a bridal makeup and
wedding styling business. **HTML5 + Bootstrap 5.3 + Bootstrap Icons + vanilla
CSS/JavaScript.** No React, no build step, no backend.

Open `index.html` in a browser and everything works.

---

## Quick start

**Option 1 — just open it.** Double-click `index.html`. Every page, form,
filter, chart and dashboard works from the file system.

**Option 2 — run a local server** (recommended; avoids browser file-URL quirks):

```bash
python -m http.server 8849
```

Then visit <http://localhost:8849>.

Any static host works for deployment — Netlify, Vercel, GitHub Pages, S3,
Apache, nginx. Upload the folder as-is; there is nothing to compile.

### Demo accounts

Authentication is simulated in `localStorage` — no server required.

| Role | Email | Password |
|---|---|---|
| Client | `client@aurelle.com` | `Bridal@2026` |
| Admin | `admin@aurelle.com` | `Admin@2026` |

The login page has **Fill client login** / **Fill admin login** buttons so you
never have to type them. Both dashboards also sign a demo user in automatically
if you open them directly, so the template is browsable without logging in.

---

## Folder tree

```
/
├── index.html                  Home 1 — premium glamorous bridal landing page
├── home-2.html                 Home 2 — modern editorial layout (#showcase anchor)
├── about.html                  Studio story, values, milestones, team, stats
├── services.html               All six services + add-ons, process, FAQs, booking
├── pricing.html                Packages, peak/standard toggle, comparison, FAQs
├── portfolio.html              Filterable gallery (18 items) + lightbox
├── blog.html                   Searchable/filterable journal (12 posts) + sidebar
├── blog-details.html           Full article, comments, related posts
├── contact.html                Multi-step booking form, map, FAQs
├── login.html                  Customer / Client portal login + social SSO + forgot modal
├── admin-login.html            Staff & Admin portal login + security credentials
├── register.html               Create account / signup, password strength, terms modal
├── 404.html                    Not found, with search and popular destinations
├── coming-soon.html            Launch countdown + waitlist
├── dashboard.html              Customer bridal dashboard (appointments, looks, invoices, chat)
├── admin-dashboard.html        Admin executive dashboard (bookings, roster, kit inventory, KPIs)
├── README.md                   This file
│
└── assets/
    ├── css/
    │   ├── style.css           Design tokens, base, all components, all pages
    │   ├── dashboard.css       Dashboard shell, KPI cards, charts, tables, chat
    │   └── rtl.css             RTL overrides (Arabic / Hebrew)
    │
    ├── js/
    │   ├── theme-init.js       Runs in <head> — applies theme/dir before paint
    │   ├── main.js             Shared `AU` namespace, loaded on every page
    │   ├── charts.js           Canvas chart engine (line/bar/donut/sparkline)
    │   ├── auth.js             login.html + register.html
    │   ├── pricing.js          pricing.html
    │   ├── contact.js          contact.html multi-step form
    │   ├── portfolio.js        portfolio.html filtering + load-more
    │   ├── blog.js             blog.html search + filtering
    │   ├── dashboard.js        dashboard.html
    │   └── admin.js            admin-dashboard.html
    │
    ├── images/
    │   └── README.md           How the CSS placeholder system works + how to
    │                           swap in real photography
    └── fonts/
        └── fonts.css           Font stack; how to self-host instead of CDN
```

---

## How the images work

The template ships with **no binary image files**. Every photograph is a
CSS-drawn placeholder, so nothing 404s, the download stays tiny, and there are
no photo licensing questions.

```html
<div class="ph ph-bride ph-3x4" role="img"
     aria-label="Bride in ivory lehenga with soft-glam bridal makeup">
  <i class="bi bi-flower1" aria-hidden="true"></i>
</div>
```

- **Tints** — `ph-bride` `ph-makeup` `ph-hair` `ph-mehendi` `ph-venue`
  `ph-team` `ph-blog` `ph-jewel` `ph-flowers`
- **Ratios** — `ph-1x1` `ph-4x3` `ph-3x2` `ph-3x4` `ph-2x3` `ph-16x9` `ph-21x9`
- **Avatars** — `ph-avatar-sm` `ph-avatar` `ph-avatar-lg`

To use real photography, add `has-img` and point one custom property at your file:

```html
<div class="ph ph-bride ph-3x4 has-img"
     style="--ph-img: url('assets/images/bride-01.jpg')"
     role="img" aria-label="Bride in ivory lehenga"></div>
```

See `assets/images/README.md` for recommended dimensions and royalty-free
sources.

---

## Implemented features

### Pages &amp; navigation
- 15 complete pages, no placeholder sections and no dead links
- Identical navbar and footer on every marketing page (byte-for-byte)
- Navbar: Home (Dropdown with Home 1 & Home 2), About, Services, Pricing,
  Portfolio, Blog, Contact, Login
- Active nav state detected automatically from the filename — nothing to maintain
- Sticky navbar that compacts on scroll
- Breadcrumb hero on every inner page
- Mobile off-canvas navigation that closes on selection

### Home 1 (`index.html`)
Hero with a draggable before/after transformation slider · trust strip · six
bridal services · animated statistics · three-up before/after showcase ·
packages · four-step process · studio story · testimonial carousel · team ·
Instagram-style gallery with lightbox · blog teasers · booking form with
validation and success state

### Home 2 (`home-2.html`)
A deliberately different layout language on the same brand system: asymmetric
split hero with oversized editorial type and a vertical side label · running
marquee · numbered service index · offset lookbook grid with lightbox · full-bleed
quote spread · horizontal stat row · four-rule method grid · dotted rate list
(instead of pricing cards) · horizontal journal cards · inline booking strip

### Interactions
- Portfolio filtering by category with live counts, load-more, and empty state
- Blog live search (debounced) + category filter, combined, with empty state
- Lightbox gallery: keyboard arrows, Escape, focus trap, respects active filter
- Testimonial carousel: autoplay, swipe, dots, arrows, pause on hover/focus
- FAQ accordions (Bootstrap, fully keyboard accessible)
- Before/after sliders: pointer drag **and** arrow-key control (`role="slider"`)
- Animated counters via IntersectionObserver
- Scroll-reveal animations with stagger delays
- Smooth scrolling that also moves keyboard focus
- Back-to-top button, floating WhatsApp button
- Toast notifications
- Password visibility toggles and a live strength meter
- Pricing: standard/peak toggle and package selection persisted to `localStorage`
- Multi-step booking form with per-step validation
- Countdown timer

### Forms
- Client-side validation: required, email, phone, minlength, field matching
- Validate on blur once touched, then live-correct while invalid
- Loading state on submit, then either an inline success panel or a toast
- Accessible errors (`role="alert"`, `aria-invalid`, focus moved to first error)

### Client dashboard (`dashboard.html`)
Nine panels — overview (KPIs + sparklines + wedding countdown + milestone
timeline), appointments, trial/event sessions, look references (selectable,
persisted), booking status, payment installments, invoices (sortable +
paginated), notifications, and messaging with a simulated reply.

### Admin dashboard (`admin-dashboard.html`)
Nine panels — analytics overview with revenue/bookings/service-mix charts,
bookings, clients, services &amp; packages, payments, messages, reviews,
notifications, and settings. Searchable, filterable, sortable tables with
pagination, empty states and CSV export.

### Charts
`assets/js/charts.js` is a small dependency-free canvas engine — **no Chart.js,
no CDN**. Line/area, bar (grouped or stacked), donut and sparkline. Every chart
is HiDPI-correct, responsive, redraws on theme change, has hover tooltips, and
carries a generated `aria-label` describing its data.

### Theming
- Light/dark mode via `data-bs-theme`, persisted, honouring
  `prefers-color-scheme` on first visit
- `theme-init.js` applies the stored theme in `<head>` so there is **no flash**
- A full CSS custom-property token system (colour, type, spacing, radius,
  elevation, motion) — restyle the whole template from `:root`

### RTL &amp; internationalisation
- Arabic and Hebrew switch the document to `dir="rtl"`, swap in Bootstrap's RTL
  build, and enable `rtl.css` — all at runtime, persisted
- Layout is authored with CSS logical properties, so it mirrors natively
- Directional icons, gradients and animations mirror correctly
- `data-i18n` / `data-i18n-attr` translation hooks with an editable dictionary
  in `main.js`

### Accessibility
- Semantic landmarks, skip link, one `<h1>` per page, no skipped heading levels
- Every placeholder carries `role="img"` and a real descriptive label
- Every form control has a real label; icon-only controls have `aria-label`
- Visible focus rings, keyboard-operable carousel/lightbox/slider/accordion
- `aria-live` announcements for filter and search results
- Full `prefers-reduced-motion` support

### SEO
Unique title, meta description, keywords and canonical per page · Open Graph
and Twitter Card tags · JSON-LD `BeautySalon` structured data · semantic markup ·
`noindex` on private pages (login, register, dashboards)

### Code quality
- No inline `<style>` blocks and no inline event handlers anywhere
- One shared `AU` namespace; page scripts are guarded IIFEs that no-op if their
  elements are absent
- Reusable component classes — no copy-pasted one-off CSS

---

## Customising

**Brand colours** — edit the tokens at the top of `assets/css/style.css`:

```css
:root {
  --au-rose: #b76e79;      /* primary */
  --au-gold: #c9a227;      /* accent */
  --au-plum: #2b1a22;      /* dark surfaces */
  --au-champagne: #f3e7dc;
  --au-blush: #fcf7f4;
}
```

Dark-mode equivalents live in the `[data-bs-theme="dark"]` block directly below.

**Typography** — `--au-font-display`, `--au-font-body`, `--au-font-script`.
To self-host the fonts instead of using the Google Fonts CDN, follow
`assets/fonts/fonts.css`.

**Content** — business name, address and phone appear in the topbar, footer and
the JSON-LD block in each page's `<head>`.

**Adding a language** — add a dictionary to `AU.i18n` in `main.js` and an entry
to `AU.LANGS` (set `dir: "rtl"` for right-to-left scripts).

---

## Browser support

Chrome/Edge 90+, Firefox 88+, Safari 15+. Uses `IntersectionObserver`,
`ResizeObserver`, CSS custom properties, `aspect-ratio` and logical properties —
all baseline in those versions.

---

## Third-party dependencies

Only two, both from CDN and both replaceable with local copies:

- Bootstrap 5.3.3 (CSS + bundle JS)
- Bootstrap Icons 1.11.3

Google Fonts (Cormorant Garamond, Jost, Italiana) are optional — the template
degrades to a well-matched system stack if they fail to load.
