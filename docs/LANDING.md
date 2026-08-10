# Landing & Public Shell

Public marketing + chrome for **Mang Felipe** (Happy Moments Food Corporation).

Implementation feature: `features/landing/`.
Track module: `features/track-order/` (see that feature’s docs).
Product scope: `docs/PROJECT_DOCS.md`. Stack: `docs/TECHNOLOGY_STACK.md`.

---

## Goals

1. Brand-first landing (Home) that could not belong to another catering brand
   after removing the nav.
2. Shared public **navbar** + **footer** on Home, History, Order, Track.
3. Clear CTAs: **Order now** and **Track your order**.
4. Show three sister brands without inventing a fourth mark.

---

## Routes (planned)

| Route | Page | Feature |
| --- | --- | --- |
| `/` | Home (landing) | `features/landing/` |
| `/history` | History / how we started | `features/landing/` |
| `/order` | Menu + guest checkout | `features/orders/` |
| `/track` | Track your order / delivery | `features/track-order/` |
| `/orders/[orderNumber]` | Post-submit / thank-you status | `features/orders/` |

Add these to `constants/app.routes.ts` when wiring pages (`HOME`, `HISTORY`,
`ORDER`, `TRACK`, …).

Public shell layout: `app/(public)/layout.tsx` wraps navbar + footer + children.

---

## Brands

Source image: `public/branding/brand-logos.png`.

| Brand | Role on landing |
| --- | --- |
| **Mang Felipe** | Primary hero / nav mark (forest green circle, serif) |
| **Raken Rolls** | Sister snack line (red; Lumpia, Turon, atbp.) |
| **Oh My Bilao!** | Sister bilao / party packs (orange-coral) |

Do not invent a fourth brand mark. Mang Felipe wins first viewport hierarchy.

---

## Navbar

### Placement

Sticky or fixed top on all public pages. One composition with page content —
not a dashboard chrome.

### Contents

| Element | Behavior |
| --- | --- |
| Logo / wordmark | Mang Felipe → `/` |
| Home | `/` |
| History | `/history` |
| Order | `/order` (primary text link or subtle) |
| Track order | `/track` |
| Order CTA | Button → `/order` (same destination; stronger visual weight) |

Mobile: hamburger or compact drawer with the same links + Order CTA.

### Rules

- Mang Felipe mark is the only brand in the nav bar (sister brands live in
  page body / footer, not a pill cluster in the nav).
- Active route indicated with existing design-system patterns.
- No admin / login in public navbar (admin uses `/login` separately).
- Keep link set small: Home, History, Order, Track.

---

## Footer

### Contents

| Block | Content |
| --- | --- |
| Brand | Mang Felipe + short Happy Moments Food Corporation line |
| Sister brands | Raken Rolls + Oh My Bilao! logos or names (links optional) |
| Nav mirrors | Home, History, Order, Track |
| Contact | From `constants/contact.ts` (`SHOP_CONTACT`): email
  `mangfelipekitchen@gmail.com`, phones `0917 310 2345` + `0998 302 4209` |
| Payment note | Manual channels listed briefly, or “Pay via UnionBank / GCash / BPI” |
| Legal / meta | “Prices subject to change.” Delivery fee not included. |

### Rules

- Footer is secondary; no hero-scale type.
- No card grid of promos.
- Payment account numbers may appear in footer or only on checkout — prefer
  checkout as source of truth (`constants/payment.ts`); footer can stay short.

---

## Home (landing) sections

One job per section. First viewport = one composition.

### 1. Hero (first viewport)

Budget only:

- Mang Felipe brand (hero-level)
- One headline
- Supporting copy from `APP_DETAILS.description` (or a shorter hero excerpt):
  freshly prepared meals, quality ingredients, Metro Manila / Cavite / Laguna
  since 2020. Orders via Viber: `SHOP_CONTACT.viberDisplay`.
- CTA group: **Order now** → `/order`, secondary **Track order** → `/track`
- One dominant visual (food / catering atmosphere — not abstract purple glow)

No stats strip, schedule chips, or floating badges on hero media.

### 2. Our brands

Introduce Mang Felipe (primary), Raken Rolls, Oh My Bilao! under Happy Moments
Food Corporation. Short line each. Link History for the full story.

### 3. How ordering works

Short steps: browse → checkout (next-day + slot) → pay → track. Link Order +
Track.

### 4. Closing CTA

Repeat Order CTA. Show shop contact (`SHOP_CONTACT`) for packed meals / questions.

---

## History page

- Story of how the business started (static copy v1).
- All three logos + how lines relate (catering / rolls / bilao).
- CTA back to Order.
- Same navbar + footer.

Owner still supplies founding narrative; placeholder copy OK until then.

---

## Visual direction (landing)

- Align with brand greens / reds / coral from the three logos — not default
  purple-on-white AI theme, not cream+terracotta cliché, not broadsheet.
- Expressive typography; avoid Inter/Roboto/Arial/system as display.
- Atmosphere via photo or textured background; not flat single-color only.
- Motion: 2–3 intentional (e.g. hero fade/rise, CTA hover, brand row reveal).

When implementing UI, follow repo frontend design rules / skills.

---

## Feature layout

```text
features/landing/
  pages/           # HomePage, HistoryPage
  components/      # PublicNavbar, PublicFooter, Hero, BrandsRow, …
  utils/           # nav link config if needed
  landing.docs.md

app/(public)/
  layout.tsx       # navbar + footer shell
  (home)/page.tsx
  history/page.tsx
```

Shared nav config can live in `features/landing/utils/public-nav.ts` and be
imported by navbar + footer.

---

## Track module (summary)

Guest **Track your order** at `/track`: look up by `orderNumber` +
`customerPhone` (no login). Shows status, fulfillment type/date/slot, address
when delivery, and the **Lalamove tracking link** after admin pastes it.

Admin: paste Lalamove URL on order → save to DB → email customer (if email).

Full rules: `features/track-order/track-order.docs.md`.

---

## Out of scope for landing v1

- CMS / editable hero copy in DB
- Customer accounts in navbar
- Building our own courier GPS map (use Lalamove link instead)
- Chat widget / emoji / pill promo clusters in hero
