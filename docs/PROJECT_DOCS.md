# Project Docs

## Product

**Happy Moments Food Corporation** — catering brands under one business.
Public site: home, business history, and guest ordering. Admin dashboard for
menu CRUD and order confirmation. No inventory. FIUU payment portal later
(pending).

Primary public brand for this app: **Mang Felipe**.

## Brands / logos

Three circular logos under Happy Moments Food Corporation. Reference image:
`public/branding/brand-logos.png`.

| Brand | Role | Look |
| --- | --- | --- |
| **Mang Felipe** | **Main brand** for this app (home, header, primary identity) | Dark forest-green circle, white serif “Mang / Felipe” |
| **Raken Rolls** | Sister / snack line (Lumpia, Turon, etc.) shown on home + history | Bright red circle, bubbly “RAKEN ROLLS”, tagline “LUMPIA, TURON, atbp.” |
| **Oh My Bilao!** | Sister / bilao party line shown on home + history | Orange-coral circle, rounded “Oh My / Bilao!” |

Use Mang Felipe as the hero/nav mark. Show all three on Home and History to
tell the full business story. Do not invent a fourth brand mark.

## Public pages

### Home

- Brand-first first viewport: Mang Felipe as the dominant identity.
- Short pitch + CTA into the order form / menu.
- Introduce the three brands (Mang Felipe primary; Raken Rolls + Oh My Bilao!
  as related lines under Happy Moments Food Corporation).

### History (how the business started)

- Story page: how Happy Moments Food Corporation / Mang Felipe began.
- Show the three logos and how the lines relate (main catering vs rolls vs
  bilao packs).
- Keep marketing copy editable later; for v1 static content in the feature is
  fine unless owner supplies a CMS need.

### Order form (customer)

Guest checkout flow below. No customer login.

## Current decisions

- Locked stack: see `docs/TECHNOLOGY_STACK.md`.
- Business + DB logic: see `docs/DATABASE_SCHEMA.md`.
- Feature-based architecture under `features/`. Auth feature is reference shape.
- Firebase Auth, Firestore, and Firebase Storage removed. Do not reintroduce.
- Auth: Better Auth email/password for **admin only**. Sessions via cookies.
- Customers: **guest checkout only** (no customer login).
- Order confirmation email sent to the email from the customer form.
- Data: Prisma multi-file schema under `prisma/schema/` against Neon.
  - `base.prisma` — generator + datasource
  - `auth.prisma` — Better Auth tables
  - `menu.prisma` — Category / MenuItem / MenuItemVariant
  - `order.prisma` — Order / OrderItem + payment enums
- Files: Cloudflare R2 via S3-compatible SDK and short-lived presigned uploads.
  Payment proof screenshots + item images go to R2.
  Setup: `docs/CLOUDFLARE_STORAGE_SETUP.md`.
- Branding assets: `public/branding/` (Mang Felipe main).
- No inventory / stock tracking.
- Manual payment now; FIUU later.
- Delivery: collect address + notes. Delivery fee **not included**.
- Packed Meals: orderable option (from ₱120/meal) + contact phone for menu.
- Menu seed: `bun run db:seed` (June 15, 2026 price list).

## Customer flow (public)

1. Land on Home (Mang Felipe primary; sister brands visible).
2. Optional: read History (how the business started).
3. Browse menu by category.
4. Add items with size variant (Family / Fiesta / Super / Per meal where available).
5. Checkout: name, email, phone, delivery address, event/delivery date
   (min **2 days** advance), notes.
6. Pay offline via UnionBank / GCash / BPI (details below).
7. Upload payment screenshot + submit order.
8. Customer receives order-details email.
9. Admin reviews proof and confirms or rejects order.

## Admin flow (protected)

- CRUD food categories and items (name, category, notes, active flag).
- CRUD size variants per item (label, portion text, price PHP).
- List/filter orders; view line items + payment proof; confirm / reject / edit.

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
  - Raken Rolls → Lumpia / Dynamite / Turon style rolls
  - Oh My Bilao! → Halo-Halo Bilao / Party Bilao packs
- Sizes not uniform: some items skip Family; portion text varies
  (pax / kilos / sticks / rolls / per meal).
- Business rules from menu:
  - Place order at least **two days** in advance.
  - Delivery fee not included.
  - Prices subject to change.
  - Lechon Pork Belly: note two-day advance.
  - Packed meals: orderable from ₱120; call/message 0917-310-2345 for options.

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
