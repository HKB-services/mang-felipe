# Orders feature

Guest menu, cart, checkout, post-submit receipt. Admin review lives under
`docs/ADMIN.md` / `features/admin/` (Lalamove form may stay shared here).

## Public routes

| Route | Role |
| --- | --- |
| `/order` | Active menu catalog, keyword/category/price filters, sorting, product cards |
| `/order/[slug]` | Product page: image, notes, portions, add to cart |
| `/order/checkout` | Guest details, fulfillment, manual payment proof, submit |
| `/orders/[orderNumber]` | Public-safe post-submit receipt; no customer details, proof key, or admin notes |

## Cart

`features/orders/atom/order-cart.atom.ts` owns shared browser cart state with
Jotai `atomWithStorage`. It persists in `localStorage` as
`mang-felipe:order-cart`, so the navbar cart drawer and product pages stay in
sync after a refresh.

- Adding the same variant merges quantities; each line is clamped to 1–99.
- Product-page adds show a Sileo confirmation toast with item and portion.
- Cart prices and subtotal are display-only. Order creation reloads active
  variants and calculates line snapshots and totals on the server.
- Clear the cart only after an order is created successfully.

## Payment proof

Manual payment proof is required. Guest uploads use a short-lived, purpose-
limited R2 upload intent under `orders/payment-proofs/guest/`. Order creation
accepts only that prefix and checks object existence before DB write. Do not
return proof read URLs on public routes.

The checkout uses the shared `Attachment` component for proof selection. It
shows upload state, filename, and a local image preview; selecting it again
replaces the file. OCR hints are assistive only. They never confirm payment.

## Checkout form fields

Zod: `features/orders/schema/order-checkout.schema.ts`

| Field | Required | Notes |
| --- | --- | --- |
| `customerName` | yes | |
| `customerPhone` | yes | |
| `customerEmail` | no | Receipt email when set |
| `fulfillmentType` | yes | `pickup` \| `delivery` |
| `fulfillmentDate` | yes | Earliest = next day (`ORDER_MIN_LEAD_DAYS = 1`) |
| `fulfillmentSlot` | yes | `10-12` / `2-4` / `5-7` |
| `deliveryAddress` | if delivery | |
| `deliveryNotes` | no | |
| `paymentChannel` | yes | Manual channels |
| `items[]` | ≥1 | `variantId`, `quantity` |

Slot labels: `FULFILLMENT_SLOTS` in `constants/payment.ts`.

## Prisma

See `prisma/schema/order.prisma` and `docs/DATABASE_SCHEMA.md`.
