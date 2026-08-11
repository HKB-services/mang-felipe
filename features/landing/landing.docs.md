# Landing feature

Public Home + History + Contact + shared navbar/footer.

Canonical product/UI rules: `docs/LANDING.md`.
Brands + product scope: `docs/PROJECT_DOCS.md`.

## Responsibilities

- Home landing composition (hero, brands, how-it-works, CTA).
- History story page (static copy v1).
- Contact / locations page (maps + address per brand).
- `LandingNavbar` + `LandingFooter` used by `app/(public)/layout.tsx`.

## Planned structure

```text
features/landing/
  pages/
    ContactPage.tsx
    HistoryPage.tsx   # when wired
  components/
    LandingNavbar.tsx
    LandingFooter.tsx
    HomeHeroSection.tsx
    BrandsSection.tsx
    HowItWorksSection.tsx
    LandingCtaSection.tsx
  utils/
    public-nav.ts
  landing.docs.md
```

## Nav links

| Label | Route key | Path |
| --- | --- | --- |
| Home | `HOME` | `/` |
| History | `HISTORY` | `/history` |
| Contact | `CONTACT` | `/contact` |
| Order | `ORDER` | `/order` |
| Track order | `TRACK` | `/track` |

Primary CTA in nav/hero: Order. Secondary: Track.

## Notes

- Mang Felipe only in navbar brand slot.
- Sister brands on Home body + footer + Contact, not nav pills. Data:
  `SISTER_BRANDS` / `BRAND_FAMILY` in `constants/sister-brands.ts`.
- Contact places: `BRAND_LOCATIONS` in `constants/brand-locations.ts`
  (maps via `getMapsLinks`).
- No admin links in public chrome.
- Brand pitch: `APP_DETAILS` in `constants/app.details.ts` (Metro Manila,
  Cavite, Laguna since 2020).
- Footer contact from `SHOP_CONTACT` (`constants/contact.ts`):
  - Email: mangfelipekitchen@gmail.com
  - Phones: 0917 310 2345, 0998 302 4209
  - Orders Viber: +63 0917 310 2345
  - Locations link → `/contact`
