# Database Schema

Business requirements, domain logic, and Prisma data model for **Happy Moments
Food Corporation** (Mang Felipe) catering order app.

Source of truth for tables: `prisma/schema/`. Product scope: `docs/PROJECT_DOCS.md`.
Stack rules: `docs/TECHNOLOGY_STACK.md`.

## Business summary

| Who | What |
| --- | --- |
| Customer (guest) | Home + History + browse menu, pick size/qty, checkout with delivery details, pay offline, upload payment screenshot. Receives order email. No login. |
| Admin | Login via Better Auth. CRUD menu. Review orders and payment proofs. Confirm / reject / edit. |

**Parent business:** Happy Moments Food Corporation.

**Public brands (marketing / UI — not separate DB tables yet):**

| Brand | Role |
| --- | --- |
| Mang Felipe | **Main app brand** (home hero, nav, primary identity) |
| Raken Rolls | Sister line (Lumpia, Turon, atbp.) — shown on Home + History |
| Oh My Bilao! | Sister bilao/party line — shown on Home + History |

Logo reference: `public/branding/brand-logos.png`. Product page scope:
`docs/PROJECT_DOCS.md` (Home, History, Order form).

**Not in scope for the schema:** inventory/stock, online payment gateway (FIUU later), customer accounts, delivery-fee calculation, CMS tables for History copy (static page first).

---

## Domain rules

### Public marketing (no DB models)

1. **Home** and **History** are public pages. Copy + logos live in app/static
   assets for v1, not Postgres.
2. Mang Felipe is the primary brand mark everywhere chrome/nav appears.
3. History explains how the business started and presents all three logos.
4. Optional later: brand or CMS tables only if owner needs editable story/copy
   without deploys. Do not add until that need is real.
5. Menu categories may be *presented* under sister-brand flavor in UI
   (rolls → Raken Rolls, bilao packs → Oh My Bilao!), but catalog rows stay
   `Category` / `MenuItem` / `MenuItemVariant` only.

### Menu

1. Food is organized by **category** (Pansit, Lumpia, Packed Meals, …).
2. Each **menu item** belongs to one category.
3. Prices are not single values. Each item has one or more **variants**
   (size / portion / price rows). Examples: Family, Fiesta, Super, Per meal.
4. Variant portion text is free-form per item (`Up to 8 pax`, `20 rolls`,
   `2.5 Kilos`). Do not assume one portion definition for every category.
5. Not every item has every size. Example: Lechon Pork Belly has Fiesta + Super
   only (no Family).
6. Soft hide via `isActive` on category, item, and variant. Prefer deactivate
   over hard delete when orders already reference the item.
7. Optional item `code` for bilao packs (B1–B4).
8. Optional item `notes` for UI warnings (e.g. Lechon two-day advance).
9. Optional `imageKey` stores an R2 object key, not a public CDN URL.
10. **No inventory fields.** Availability is admin-controlled (`isActive`), not stock qty.
11. Packed Meals is a normal orderable category. Seed starts at ₱120 per meal;
    contact phone for special menu stays in app constants / category description.

### Ordering

1. Customers do **not** have user accounts. Order rows own all customer fields.
2. Checkout must collect: name, phone, optional email, pickup **or** delivery,
   fulfillment date (≥ **next calendar day**), one of three time slots
   (10–12 / 14–16 / 17–19), address when delivery, optional notes.
3. `fulfillmentDate` min lead = `ORDER_MIN_LEAD_DAYS` (1) in
   `constants/payment.ts`. Some menu items may still show a stricter note
   (e.g. Lechon 2-day) on the item itself.
4. Slots: `FULFILLMENT_SLOTS` / enum `FulfillmentSlot`.
5. Customer picks a **payment channel**: UnionBank, GCash, or BPI (manual mode).
6. Customer uploads a **payment screenshot** to R2 when manual. Order stores
   `paymentProofKey` + `paymentProofUploadedAt`.
7. New orders start as `pending_review`.
8. Admin may set `confirmed`, `rejected`, or `cancelled`, with optional
   `adminNotes`, `reviewedAt`, `reviewedByUserId`.
9. **Delivery fee is never stored or computed.** `subtotalPhp` is food line
   totals only. UI must state delivery fee is not included.
10. If `customerEmail` present, send order-details email after submit.

### Money and line items

1. All money fields are **whole PHP pesos** (`Int`). No floats.
2. On order create, copy variant display fields onto each `OrderItem`
   (`itemName`, `variantLabel`, `portionLabel`, `unitPricePhp`). Later menu
   price edits must **not** rewrite historical orders.
3. `lineTotalPhp = unitPricePhp * quantity` (validated server-side).
4. `Order.subtotalPhp = sum(OrderItem.lineTotalPhp)`.
5. Keep nullable FKs to `MenuItem` / `MenuItemVariant` for admin navigation.
   Use `ON DELETE SET NULL` so deleting a menu row does not wipe order history;
   snapshots remain.

### Auth

1. Better Auth tables (`user`, `session`, `account`, `verification`) are for
   **admins only**.
2. Admin authorization uses `user.roles` (app-level), checked on protected
   mutations — not only UI hiding.

---

## Schema file layout

```text
prisma/schema/
  base.prisma   # generator + datasource
  auth.prisma   # User, Session, Account, Verification
  menu.prisma   # Category, MenuItem, MenuItemVariant
  order.prisma  # Order, OrderItem, OrderStatus, PaymentChannel
```

`prisma.config.ts` points `schema` at `prisma/schema/` (multi-file).

---

## Entity relationship

```text
Category 1──* MenuItem 1──* MenuItemVariant
                              │
Order 1──* OrderItem *────────┘ (nullable FK + snapshots)
                │
                └── optional MenuItem FK

User (admin) ── Session / Account   (Better Auth)
```

Binary files (payment proofs, item images) live in **Cloudflare R2**. Postgres
stores object keys only.

---

## Enums

### `OrderStatus`

| Value | Meaning |
| --- | --- |
| `pending_review` | Submitted; waiting for admin to check payment proof |
| `confirmed` | Admin accepted payment / order |
| `rejected` | Admin rejected (bad proof, unavailable item, etc.) |
| `cancelled` | Cancelled after submit |

Default for new orders: `pending_review`.

### `PaymentChannel`

| Value | UI source |
| --- | --- |
| `unionbank` | Happy Moments Food Corporation / Current Account `001990006659` |
| `gcash` | JON RO**K F. / `0905-745 6950` |
| `bpi` | John Roderick Felipe / Savings `3299240028` |

---

## Tables

### Auth (`auth.prisma`)

#### `user`

Admin identity + profile search fields.

| Column | Type | Notes |
| --- | --- | --- |
| id | String (cuid) | PK |
| name, email | String | email unique |
| emailVerified | Boolean | Better Auth |
| image | String? | |
| firstName, lastName, phoneNumber | String | App profile |
| roles | String[] | App roles (e.g. admin) |
| search* | String | Lowercased prefix-search helpers |
| createdAt, updatedAt | DateTime | |

#### `session`, `account`, `verification`

Standard Better Auth session, credential, and verification token tables.
Cascade delete from `user`.

---

### Menu (`menu.prisma`)

#### `category`

| Column | Type | Notes |
| --- | --- | --- |
| id | String (cuid) | PK |
| name | String | Display name |
| slug | String | Unique URL/stable key |
| description | String? | Category blurb |
| sortOrder | Int | List order |
| isActive | Boolean | Soft hide |
| createdAt, updatedAt | DateTime | |

Delete category → cascade delete its items and variants.

#### `menu_item`

| Column | Type | Notes |
| --- | --- | --- |
| id | String (cuid) | PK |
| categoryId | String | FK → category |
| name | String | |
| slug | String | Unique |
| description | String? | Longer copy / combo contents |
| notes | String? | Warning / lead-time note |
| code | String? | B1, B2, … |
| sortOrder | Int | |
| isActive | Boolean | |
| imageKey | String? | R2 key |
| createdAt, updatedAt | DateTime | |

#### `menu_item_variant`

| Column | Type | Notes |
| --- | --- | --- |
| id | String (cuid) | PK |
| menuItemId | String | FK → menu_item |
| sizeKey | String | Stable: `family` \| `fiesta` \| `super` \| `unit` |
| label | String | Display: Family, Fiesta, Super, Per meal |
| portionLabel | String | Human portion text |
| pricePhp | Int | Whole pesos |
| sortOrder | Int | |
| isActive | Boolean | |
| createdAt, updatedAt | DateTime | |

Unique: `(menuItemId, sizeKey)`.

---

### Orders (`order.prisma`)

#### Enums (orders)

| Enum | Values |
| --- | --- |
| `OrderStatus` | `pending_review`, `confirmed`, `rejected`, `cancelled` |
| `PaymentChannel` | `unionbank`, `gcash`, `bpi` |
| `FulfillmentType` | `pickup`, `delivery` |
| `FulfillmentSlot` | `slot_10_12`, `slot_14_16`, `slot_17_19` |

#### `order`

| Column | Type | Notes |
| --- | --- | --- |
| id | String (cuid) | PK |
| orderNumber | String | Unique human code, e.g. `HM-20260807-A1B2` |
| status | OrderStatus | Default `pending_review` |
| customerName | String | Guest |
| customerEmail | String? | Optional; receipt only when set |
| customerPhone | String | |
| fulfillmentType | FulfillmentType | Pickup or delivery |
| fulfillmentDate | DateTime | ≥ next calendar day |
| fulfillmentSlot | FulfillmentSlot | 10–12 / 14–16 / 17–19 |
| deliveryAddress | String? | Required when `delivery` |
| deliveryNotes | String? | |
| paymentChannel | PaymentChannel | |
| paymentProofKey | String? | R2 key |
| paymentProofUploadedAt | DateTime? | |
| subtotalPhp | Int | Sum of lines; **no delivery fee** |
| adminNotes | String? | |
| reviewedAt | DateTime? | |
| reviewedByUserId | String? | Admin user id (no FK required) |
| createdAt, updatedAt | DateTime | |

Indexes: status, customerEmail, fulfillmentDate, fulfillmentType, createdAt.

Form Zod: `features/orders/schema/order-checkout.schema.ts`.
Slot labels: `constants/payment.ts` → `FULFILLMENT_SLOTS`.

#### `order_item`

| Column | Type | Notes |
| --- | --- | --- |
| id | String (cuid) | PK |
| orderId | String | FK → order (cascade) |
| menuItemId | String? | FK → menu_item (SET NULL) |
| variantId | String? | FK → menu_item_variant (SET NULL) |
| itemName | String | Snapshot |
| variantLabel | String | Snapshot |
| portionLabel | String | Snapshot |
| unitPricePhp | Int | Snapshot |
| quantity | Int | ≥ 1 (app validation) |
| lineTotalPhp | Int | Snapshot total |
| notes | String? | Per-line customer note |
| createdAt, updatedAt | DateTime | |

---

## Status lifecycle

```text
                  submit + proof
  (guest checkout) ──────────────► pending_review
                                         │
                    ┌────────────────────┼────────────────────┐
                    ▼                    ▼                    ▼
               confirmed             rejected             cancelled
```

App may allow limited edits while `pending_review` (admin). Confirmed orders
should not silently change money fields without an explicit admin edit path.

---

## Storage vs database

| Concern | Where |
| --- | --- |
| Menu text, prices, order metadata | Neon / Prisma |
| Payment screenshot bytes | R2; key on `order.paymentProofKey` |
| Menu item image bytes | R2; key on `menu_item.imageKey` |
| Bank account display strings | `constants/payment.ts` (not DB) |
| Min lead days (1 = next day) | `constants/payment.ts` + checkout validation |
| Time slots | `FULFILLMENT_SLOTS` / `FulfillmentSlot` enum |

---

## Seed and migrations

- Migrations: `prisma/migrations/`
- Seed: `prisma/seed.ts` (menu structure from June 15, 2026 list).
  Default seed prices are **₱1–10** for Fiuu live testing (no sandbox).
  Catalog prices: `SEED_REAL_PRICES=true` / `bun run db:seed:real`.
- Commands:
  - `bun run db:generate`
  - `bun run db:migrate`
  - `bun run db:seed`

Seed is upsert-by-slug. Safe to re-run to refresh catalog prices/labels.

---

## Future (not modeled yet)

- FIUU (or other) online payment: see
  `docs/FIUU_NEXTJS_PRISMA_SERVER_ACTIONS.md`. Likely new payment status fields /
  provider refs on `order`; keep manual channels until then.
- Delivery fee: only add a money column if product decides to charge/track it.
- Email delivery log: optional table if retries/audit become required.
- Inventory: do not add stock columns unless product explicitly changes scope.
- Brand / History CMS: only if static Home + History pages become insufficient.
