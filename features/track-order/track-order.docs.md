# Track order feature

Guest **Track your order / delivery** — no customer login.

Shell/nav: `docs/LANDING.md`. Order domain: `docs/DATABASE_SCHEMA.md`.
Checkout fields: `features/orders/orders.docs.md`.
Email: `services/email.service.ts` (Elastic Mail).

## Purpose

Two layers:

1. **Status lookup** — guest enters order number + phone; sees order status and
   fulfillment window.
2. **Lalamove link** — admin/owner pastes the Lalamove tracking URL into the
   order; app saves it and emails the customer (when email was provided). Guest
   also sees that link on `/track` once saved.

We do **not** build our own map/GPS. Tracking live courier = open the Lalamove
link the shop pasted.

## Admin / owner flow (source of the tracking link)

1. Order is paid / confirmed (or otherwise ready for dispatch).
2. Owner creates the delivery in **Lalamove** (outside this app).
3. Owner copies the Lalamove share / tracking link.
4. In admin order detail: paste URL → **Save tracking link**.
5. App:
   - Writes `lalamoveTrackingUrl` + `lalamoveTrackingSavedAt` on `Order`.
   - If `customerEmail` is set → send email with order number + Lalamove link;
     set `lalamoveTrackingEmailedAt`.
   - If no email → skip send; customer still gets the link via `/track`.
6. Admin may replace the URL later (re-save); optionally re-send email.

Protected action: `authActionClient`. Validate URL (https, reasonable host
allowlist if desired — at least `z.url()`).

## Guest flow

1. Customer opens `/track` (nav: **Track order**).
2. Enters:
   - **Order number** (`orderNumber`)
   - **Phone** from checkout (`customerPhone`)
3. Both must match. Generic “not found” if either wrong (no existence leak).
4. Result shows status + fulfillment details.
5. If `lalamoveTrackingUrl` present → show **Open Lalamove tracking** button
   (external link). If missing → copy like “Tracking link not available yet —
   we will email you when the rider is assigned” (when they left an email).

## Route

| Route | Page |
| --- | --- |
| `/track` | Lookup form + result |
| Optional deep link | `/track?order=HM-…` prefill only; still require phone submit |

Add `ROUTES.TRACK = "/track"` in `constants/app.routes.ts` when wiring.

## Lookup rules

1. Public server action (`actionClient`, not `authActionClient`).
2. Zod-validate order number + phone (normalize phone: strip spaces/dashes).
3. `findFirst` where `orderNumber` + normalized phone match.
4. Never return `adminNotes`, `paymentProofKey`, or other customers’ data.
5. **Do** return `lalamoveTrackingUrl` when set (it is meant for the guest).

## Result payload (safe fields)

| Field | Notes |
| --- | --- |
| `orderNumber` | Confirm identity |
| `status` | `pending_review` \| `confirmed` \| `rejected` \| `cancelled` |
| `fulfillmentType` | pickup \| delivery |
| `fulfillmentDate` | Date only |
| `fulfillmentSlot` | Label via `FULFILLMENT_SLOTS` |
| `deliveryAddress` | Only if delivery |
| `lalamoveTrackingUrl` | Present after admin paste; open in new tab |
| `customerName` | Optional display |
| `subtotalPhp` | Optional |
| `paymentChannel` | Label only |
| Line items | Name, variant, qty, line total |

Hide: `paymentProofKey`, `adminNotes`, `reviewedByUserId`, internal ids.

## Status copy (UI)

| Status | Guest-facing sense |
| --- | --- |
| `pending_review` | Received — waiting for payment review |
| `confirmed` | Confirmed — preparing for your slot |
| `rejected` | Not accepted — contact the shop |
| `cancelled` | Cancelled |

Pickup orders usually have no Lalamove link (field stays null).

## Prisma fields (`Order`)

| Column | Type | Notes |
| --- | --- | --- |
| `lalamoveTrackingUrl` | String? | Admin-pasted Lalamove URL |
| `lalamoveTrackingSavedAt` | DateTime? | When URL last saved |
| `lalamoveTrackingEmailedAt` | DateTime? | When link email last sent |

## Feature layout

```text
features/track-order/
  pages/
    TrackOrderPage.tsx
  components/
    TrackOrderForm.tsx
    TrackOrderResult.tsx
  actions/
    track-order.action.ts          # public lookup
  schema/
    track-order.schema.ts
  utils/
    normalize-phone.ts
  track-order.docs.md

features/orders/   # or admin orders
  actions/
    save-lalamove-tracking.action.ts   # auth: save URL + email
  components/
    LalamoveTrackingForm.tsx

app/(public)/track/page.tsx
```

## Zod (sketches)

```ts
// Guest lookup
z.object({
  orderNumber: z.string().trim().min(3),
  customerPhone: z.string().trim().min(7),
})

// Admin save
z.object({
  orderId: z.string().min(1),
  lalamoveTrackingUrl: z.url(),
  resendEmail: z.boolean().optional(),
})
```

## Email (when `customerEmail` set)

Subject e.g. `Your Mang Felipe order {orderNumber} — delivery tracking`.

Body: greeting, order number, fulfillment date/slot, **Lalamove link**, link
to `/track` for status. Use Elastic Mail via `sendEmail`.

If mail env missing → still save URL; surface admin warning that email failed.

## Out of scope (v1)

- Customer accounts / magic-link history
- SMS with Lalamove link
- Embedding Lalamove iframe / building our own map
- Auto-fetch Lalamove API (manual paste only)
- Lookup by email only (phone remains the gate)
