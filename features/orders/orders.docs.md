# Orders feature

Guest checkout + admin order review.

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
