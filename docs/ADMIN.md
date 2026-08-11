# Admin Dashboard

Protected ops UI for **Happy Moments Food Corporation** (Mang Felipe): menu
CRUD, order review, payment-proof check, Lalamove tracking paste.

Implementation: `features/admin/` (+ shared auth/sidebar/orders pieces).
Feature notes: `features/admin/admin.docs.md`.
Product scope: `docs/PROJECT_DOCS.md`.
Schema: `docs/DATABASE_SCHEMA.md`.
Auth: `features/auth/auth.docs.md`.
Track / Lalamove guest side: `features/track-order/track-order.docs.md`.

**Status:** product rules locked here; most screens still stubs — implement later.

---

## Goals

1. Let shop staff manage the live menu (categories, items, variants, soft hide).
2. Review guest orders and payment screenshots; confirm / reject / cancel.
3. Paste Lalamove tracking URLs for delivery orders (email when possible).
4. Keep admin behind Better Auth — no customer accounts, no public admin links.

---

## Who can access

| Rule | Detail |
| --- | --- |
| Auth | Better Auth email/password; cookie sessions |
| Gate | `app/(protected)/layout.tsx` + proxy cookie check; mutations via `authActionClient` |
| Roles | `user.roles` includes app role (e.g. `admin`) — check on protected actions |
| Bootstrap | Hidden `/register-admin` for first admin only (`ROUTES.REGISTER_ADMIN`) |
| Public chrome | No Login / Admin in public navbar (`docs/LANDING.md`) |

Login: `/login`. After session: sidebar shell under `app/(protected)/`.

---

## Shell

| Piece | Location |
| --- | --- |
| Layout | `app/(protected)/layout.tsx` — session redirect, sidebar, breadcrumb, theme |
| Sidebar | `features/sidebar/` (`AppSidebar`, `sidebar-nav.config.ts`) |
| Account / Security | `/account`, `/security` (profile + password) |

Sidebar should grow nav groups as screens land (see Routes). Keep Test UI
dev-only.

---

## Routes (planned)

Wire into `constants/app.routes.ts` + `PROTECTED_ROUTES` when building pages.
Existing stubs noted.

| Route | Page | Notes |
| --- | --- | --- |
| `/login` | Login | Public auth |
| `/dashboard` | Ops overview | Stub today |
| `/admin` | Redirect → dashboard | Exists |
| `/admin/orders` | Order list | Planned |
| `/admin/orders/[id]` | Order detail | Partial: detail + Lalamove form exists |
| `/admin/menu` | Category list / hub | Planned |
| `/admin/menu/categories/[id]` | Category edit + items | Planned |
| `/admin/menu/items/[id]` | Item + variants + image | Planned |
| `/account` | Profile | Exists |
| `/security` | Password | Exists |
| `/register-admin` | Hidden bootstrap | Exists under `app/(hidden)/` |

Optional later: `/admin/users` only if multi-admin management is needed.

Suggested route keys: `ADMIN_ORDERS`, `ADMIN_ORDER_DETAIL`, `ADMIN_MENU`, …

---

## Screens

### 1. Dashboard (`/dashboard`)

One job: “what needs attention.”

| Block | Content |
| --- | --- |
| Pending count | Orders with `status = pending_review` |
| Upcoming | Confirmed orders by `fulfillmentDate` (next few days) |
| Shortcuts | Orders needing review · Menu · (optional) Track help copy |

No marketing chrome. No inventory widgets.

### 2. Orders list (`/admin/orders`)

| Capability | Detail |
| --- | --- |
| List | Newest first; show order number, name, phone, status, channel, fulfillment date/slot, subtotal |
| Filters | Status, fulfillment type, date range, payment channel; text search on order number / phone / name |
| Open | Row → `/admin/orders/[id]` |

### 3. Order detail (`/admin/orders/[id]`)

| Block | Content |
| --- | --- |
| Header | Order number, status badge, created time |
| Customer | Name, phone, email (if any) |
| Fulfillment | Pickup/delivery, date, slot, address + delivery notes |
| Lines | Snapshotted name / variant / qty / line totals |
| Payment | Channel label + **payment proof** (signed R2 read URL for admin only) |
| Review | Confirm / Reject / Cancel + optional `adminNotes` |
| Lalamove | Delivery only: paste URL → save → email if `customerEmail` set |

**Review rules**

1. New orders arrive as `pending_review`.
2. Confirm → `confirmed` + `reviewedAt` + `reviewedByUserId`.
3. Reject → `rejected` + notes encouraged (bad proof, unavailable item, …).
4. Cancel → `cancelled` (shop or customer request after submit).
5. Prefer soft outcomes over delete. Do not hard-delete orders with money/proof.
6. Confirmed money fields should not change silently — explicit edit path if needed.
7. Never expose `paymentProofKey` or `adminNotes` on public track/receipt routes.

**Lalamove:** full rules in `features/track-order/track-order.docs.md`.
Admin action uses `authActionClient`; validate `z.url()` (https).

### 4. Menu hub (`/admin/menu`)

| Capability | Detail |
| --- | --- |
| Categories | List with sortOrder, active flag; create / rename / reorder / soft-hide |
| Items | Per category: name, slug, description, notes, code, sortOrder, `isActive`, image |
| Variants | Per item: sizeKey, label, portionLabel, pricePhp, sortOrder, `isActive` |
| Featured | Toggle `isFeatured` when schema lands (Home section; see `docs/LANDING.md`) |
| Images | Upload to R2; store `imageKey` only |

Prefer deactivate (`isActive = false`) over hard delete when orders reference
the item. Category delete cascades items/variants — use carefully or block when
history exists.

Sister brands are **not** separate menu tables. Category presentation under
Rak en Rolls / Oh My Bilao! is UI flavor only (`docs/PROJECT_DOCS.md`).

### 5. Account + Security

Already in scope via auth feature: profile fields, change password
(`revokeOtherSessions`), logout. Not a second admin product surface.

---

## Admin order of operations (happy path)

1. Guest submits order (manual pay + proof) → `pending_review`.
2. Admin opens Orders → pending → opens detail → checks proof (OCR assist is
   guest-side only; admin eyes confirm).
3. Confirm or reject (+ notes).
4. For delivery: book rider in Lalamove (outside app) → paste share URL → save
   → email when email present.
5. Guest uses `/track` (order number + phone) for status + Lalamove link.

---

## Authorization checklist

| Surface | Client | Notes |
| --- | --- | --- |
| List / mutate orders | `authActionClient` | Role check |
| Menu CRUD | `authActionClient` | Role check |
| Save Lalamove URL | `authActionClient` | Role check |
| Guest track lookup | `actionClient` | Public; safe fields only |
| Guest checkout | `actionClient` | Public |
| Proof read URL | Admin-only signed URL | Never on public routes |

Keep Prisma / R2 / Better Auth secrets server-side only.

---

## Data touchpoints

| Domain | Models / fields |
| --- | --- |
| Menu | `Category`, `MenuItem`, `MenuItemVariant` (+ planned `MenuItem.isFeatured`) |
| Orders | `Order`, `OrderItem`; statuses; `paymentProofKey`; review fields |
| Tracking | `lalamoveTrackingUrl`, `lalamoveTrackingSavedAt`, `lalamoveTrackingEmailedAt` |
| Auth | `User.roles`, Session via Better Auth |

Seed / prices: `docs/PROJECT_DOCS.md` + `bun run db:seed`.

---

## Planned feature layout

```text
features/admin/
  admin.docs.md
  account/                 # exists
  security/                # exists
  users/                   # schemas + search helpers today
  orders/
    pages/
      OrdersListPage.tsx   # planned
      OrderDetailPage.tsx  # partial
    actions/
      review-order.action.ts
      list-orders.action.ts   # or server loaders
  menu/
    pages/
      MenuHubPage.tsx
      CategoryEditPage.tsx
      ItemEditPage.tsx
    actions/
      … CRUD via authActionClient

features/orders/
  components/
    LalamoveTrackingForm.tsx   # used from admin order detail
  actions/
    save-lalamove-tracking.action.ts

features/sidebar/
  sidebar-nav.config.ts        # add Orders + Menu groups

app/(protected)/
  layout.tsx
  dashboard/page.tsx
  admin/page.tsx
  admin/orders/…
  admin/menu/…
  account/page.tsx
  security/page.tsx
```

Keep pages thin; business UI lives under `features/admin/` (or shared
`features/orders/` pieces when both guest and admin need them).

---

## Out of scope (v1 admin)

- Inventory / stock counts
- FIUU admin settlement UI (toggle may exist; portal later)
- Customer account management
- Built-in courier GPS / Lalamove API auto-fetch (paste only)
- CMS for History / landing copy
- Delivery fee calculator
- SMS
- Public-facing admin entry in navbar

---

## Implementation order (suggested)

1. Orders list + detail review actions (confirm / reject / notes + proof view)
2. Sidebar nav links for Orders (and later Menu)
3. Menu CRUD (categories → items → variants → images)
4. `isFeatured` schema + admin toggle (after Home featured section needs it)
5. Dashboard counters
6. Multi-admin users UI only if needed
