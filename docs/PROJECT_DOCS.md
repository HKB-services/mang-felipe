# Project Docs

## Product

**Happy Moments Food Corporation** — catering brands under one business.
Public site: home, business history, and guest ordering. Admin dashboard for
menu CRUD and order confirmation. No inventory. FIUU payment portal later
(pending).

Primary public brand for this app: **Mang Felipe**.

Pitch (`constants/app.details.ts` → `APP_DETAILS.description`): freshly prepared
meals with carefully selected quality ingredients for customers across Metro
Manila, Cavite, and Laguna since 2020. Orders: Viber +63 0917 310 2345
(`SHOP_CONTACT.viberDisplay`).

## Brands / logos

Three brands under Happy Moments Food Corporation. Data:
`constants/sister-brands.ts` (`SISTER_BRANDS`, `BRAND_FAMILY`). Combined strip:
`public/branding/brand-logos.png`.

| Brand | Role | Look / pitch |
| --- | --- | --- |
| **Mang Felipe** | **Main app brand** (home, header, primary identity) | Forest green; catering trays · see `APP_DETAILS` |
| **Rak en Rolls** | Sister snack line | Red · “Lumpia, Turon & More” · merienda rolls/pastries · La Huerta Parañaque · IG `@rakenrollsph` · 0995 017 6288 · rakenrollsph@gmail.com |
| **Oh My Bilao!** | Sister bilao / party line | Coral · “Party Bilao Specialists” · bilao trays · La Huerta Parañaque · 0998 302 4209 · mangfelipekitchen@gmail.com |

Use Mang Felipe as the hero/nav mark. Show all three on Home and History to
tell the full business story. Do not invent a fourth brand mark.

## Public pages

Canonical landing / nav / footer / track rules: `docs/LANDING.md`.

### Home (landing)

- Brand-first first viewport: Mang Felipe as the dominant identity.
- Short pitch + CTA into the order form / menu.
- Secondary CTA: Track order.
- Introduce the three brands (Mang Felipe primary; Rak en Rolls + Oh My Bilao!
  as related lines under Happy Moments Food Corporation). Use `SISTER_BRANDS`
  for taglines, addresses, phones, email, Instagram.
- Shared public **navbar** + **footer** (see `docs/LANDING.md`).

### History (how the business started)

- Story page: how Happy Moments Food Corporation / Mang Felipe began.
- Show the three logos and how the lines relate (main catering vs rolls vs
  bilao packs).
- Keep marketing copy editable later; for v1 static content in the feature is
  fine unless owner supplies a CMS need.

### Order form (customer)

Guest checkout flow below. No customer login. Route: `/order`.

### Track order (customer)

Guest lookup at `/track` by **order number + phone** (no login). Shows status,
fulfillment window, and — when admin pasted it — the **Lalamove tracking URL**.
Owner flow: paste Lalamove link on order → save to DB → email customer (if
email on order). Not our own GPS map.
Feature docs: `features/track-order/track-order.docs.md`.

## Current decisions

- Locked stack: see `docs/TECHNOLOGY_STACK.md`.
- Business + DB logic: see `docs/DATABASE_SCHEMA.md`.
- Landing + public chrome: see `docs/LANDING.md`.
- Feature-based architecture under `features/`. Auth feature is reference shape.
- Firebase Auth, Firestore, and Firebase Storage removed. Do not reintroduce.
- Auth: Better Auth email/password for **admin only**. Sessions via cookies.
- Customers: **guest checkout only** (no customer login).
- Order confirmation email sent when customer provides email (optional).
- Data: Prisma multi-file schema under `prisma/schema/` against Neon.
  - `base.prisma` — generator + datasource
  - `auth.prisma` — Better Auth tables
  - `menu.prisma` — Category / MenuItem / MenuItemVariant
  - `order.prisma` — Order / OrderItem + payment + fulfillment enums
- Files: Cloudflare R2 via S3-compatible SDK and short-lived presigned uploads.
  Payment proof screenshots + item images go to R2.
  Setup: `docs/CLOUDFLARE_STORAGE_SETUP.md`.
- Branding assets: `public/branding/` (Mang Felipe main).
- No inventory / stock tracking.
- Manual payment now; FIUU later (toggle: `ENABLE_FIUU_PAYMENT` in
  `constants/payment.ts`). Guide: `docs/FIUU_NEXTJS_PRISMA_SERVER_ACTIONS.md`.
  Manual path uses tesseract.js OCR assist on payment screenshots
  (`features/payments/`).
- Fulfillment: pickup or delivery; earliest **next day**; slots 10–12 / 2–4 / 5–7.
  Address required for delivery. Delivery fee **not included**.
- Packed Meals: orderable option (from ₱120/meal). Contact:
  `mangfelipekitchen@gmail.com`, `0917 310 2345`, `0998 302 4209`
  (`constants/contact.ts` → `SHOP_CONTACT`).
- Menu seed: `bun run db:seed` — structure from June 15, 2026 list; default
  prices are **₱1–10** (Fiuu has no sandbox). Real catalog pesos:
  `bun run db:seed:real` (`SEED_REAL_PRICES=true`).

## Customer flow (public)

1. Land on Home (Mang Felipe primary; sister brands visible).
2. Optional: read History (how the business started).
3. Browse menu / Order form by category.
4. Add items with size variant (Family / Fiesta / Super / Per meal where available).
5. Checkout: name, phone, optional email, pickup/delivery, date (earliest next
   day), time slot (10–12 / 2–4 / 5–7), address if delivery, notes.
6. Pay offline via UnionBank / GCash / BPI (details below) — or Fiuu when enabled.
7. Upload payment screenshot + submit order (manual mode).
8. If email given, customer receives order-details email (includes order number).
9. Admin reviews proof and confirms or rejects order.
10. Customer can **Track order** at `/track` with order number + phone.
11. When rider is booked, admin pastes Lalamove link → saved on order → emailed
    to customer (if email given); also visible on `/track`.

## Admin flow (protected)

- CRUD food categories and items (name, category, notes, active flag).
- CRUD size variants per item (label, portion text, price PHP).
- List/filter orders; view line items + payment proof; confirm / reject / edit.
- Paste **Lalamove tracking URL** on a delivery order → save → email customer
  when `customerEmail` is present.

## Manual payment channels

Display these on checkout. Source of truth: `constants/payment.ts`.

### UNIONBANK

- Account name: Happy Moments Food Corporation
- Current Account: 001990006659

### GCASH

- Account name: JON RO**K F.
- GCash Number: 0905-745 6950

### BPI

- Account name: John Roderick Felipe
- Savings Account: 3299240028

## Menu shape (from owner price list)

- Categories: Pansit; Pork/Chicken/Beef; Seafood/Fish; Vegetables; Lumpia;
  Dynamite; Turon; Minatamis; Rice; Halo-Halo Bilao; Party Bilao; Packed Meals.
- Sister-brand flavor mapping (UI only for now, not separate DB brands):
  - Mang Felipe → core catering trays (pansit, meats, seafood, veggies, rice, …)
  - Rak en Rolls → Lumpia / Dynamite / Turon style rolls
  - Oh My Bilao! → Halo-Halo Bilao / Party Bilao packs
  Contact/place details: `constants/sister-brands.ts`.
- Sizes not uniform: some items skip Family; portion text varies
  (pax / kilos / sticks / rolls / per meal).
- Business rules from menu:
  - Place order at least **one day** in advance (next-day earliest). Some
    items (e.g. Lechon) may still show a longer lead note on the item.
  - Delivery fee not included.
  - Prices subject to change.
  - Lechon Pork Belly: note two-day advance.
  - Packed meals: orderable from ₱120; call/message `0917 310 2345` or
    `0998 302 4209`, or email `mangfelipekitchen@gmail.com`.

## Out of scope (for now)

- Inventory / stock.
- FIUU online payment.
- Customer accounts / order history login.
- Delivery fee calculator.
- SMS notifications.
- CMS for History copy (static page first).

## Local bootstrap

1. Copy `.env.example` → `.env` and `.env.local` (fill real values).
2. `bun install`
3. `bun run db:generate`
4. `bun run db:migrate` (needs real `DATABASE_URL`)
5. `bun run db:seed`
6. `bun dev`
