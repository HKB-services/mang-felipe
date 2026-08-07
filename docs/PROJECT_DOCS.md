# Project Docs

## Product

**Happy Moments Food Corporation** (Mang Felipe) — catering order form + admin
dashboard.

Customers browse food items, pick size/qty, place order, pay via bank/e-wallet
transfer, upload payment screenshot. Admin CRUD menu items and confirm/edit
orders. No inventory. FIUU payment portal later (pending).

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
- No inventory / stock tracking.
- Manual payment now; FIUU later.
- Delivery: collect address + notes. Delivery fee **not included**.
- Packed Meals: orderable option (from ₱120/meal) + contact phone for menu.
- Menu seed: `bun run db:seed` (June 15, 2026 price list).

## Customer flow (public)

1. Browse menu by category.
2. Add items with size variant (Family / Fiesta / Super / Per meal where available).
3. Checkout: name, email, phone, delivery address, event/delivery date
   (min **2 days** advance), notes.
4. Pay offline via UnionBank / GCash / BPI (details below).
5. Upload payment screenshot + submit order.
6. Customer receives order-details email.
7. Admin reviews proof and confirms or rejects order.

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

## Local bootstrap

1. Copy `.env.example` → `.env` and `.env.local` (fill real values).
2. `bun install`
3. `bun run db:generate`
4. `bun run db:migrate` (needs real `DATABASE_URL`)
5. `bun run db:seed`
6. `bun dev`
