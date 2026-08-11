# Orders feature

Guest menu, cart, checkout, post-submit receipt, and later admin review.

## Public routes

| Route | Role |
| --- | --- |
| `/order` | Active menu catalog, keyword/category/price filters, sorting, product cards |
| `/order/[slug]` | Product page: image, notes, portions, add to cart |
| `/order/checkout` | Guest details, fulfillment, manual payment proof, submit |
| `/orders/[orderNumber]` | Public-safe post-submit receipt; no customer details, proof key, or admin notes |

`features/orders/atom/order-cart.atom.ts` owns browser cart state. Navbar cart
drawer and `/order` share it. Cart values are display-only: order creation
reloads active variants and calculates snapshots/subtotal server-side.

## Payment proof

Manual payment proof is required. Guest uploads use a short-lived, purpose-
limited R2 upload intent under `orders/payment-proofs/guest/`. Order creation
accepts only that prefix and checks object existence before DB write. Do not
return proof read URLs on public routes.

OCR hints are assistive only. They never confirm payment.

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
