# Landing feature

Public Home + History + shared navbar/footer.

Canonical product/UI rules: `docs/LANDING.md`.
Brands + product scope: `docs/PROJECT_DOCS.md`.

## Responsibilities

- Home landing composition (hero, brands, how-it-works, CTA).
- History story page (static copy v1).
- `PublicNavbar` + `PublicFooter` used by `app/(public)/layout.tsx`.

## Planned structure

```text
features/landing/
  pages/
    HomePage.tsx
    HistoryPage.tsx
  components/
    PublicNavbar.tsx
    PublicFooter.tsx
    LandingHero.tsx
    BrandsRow.tsx
    HowItWorks.tsx
  utils/
    public-nav.ts
  landing.docs.md
```

## Nav links

| Label | Route key | Path |
| --- | --- | --- |
| Home | `HOME` | `/` |
| History | `HISTORY` | `/history` |
| Order | `ORDER` | `/order` |
| Track order | `TRACK` | `/track` |

Primary CTA in nav/hero: Order. Secondary: Track.

## Notes

- Mang Felipe only in navbar brand slot.
- Sister brands on Home body + footer, not nav pills. Data:
  `SISTER_BRANDS` / `BRAND_FAMILY` in `constants/sister-brands.ts`.
- No admin links in public chrome.
- Brand pitch: `APP_DETAILS` in `constants/app.details.ts` (Metro Manila,
  Cavite, Laguna since 2020).
- Footer contact from `SHOP_CONTACT` (`constants/contact.ts`):
  - Email: mangfelipekitchen@gmail.com
  - Phones: 0917 310 2345, 0998 302 4209
  - Orders Viber: +63 0917 310 2345

