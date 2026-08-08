# Fiuu Payment Gateway Integration Guide

## Next.js + Neon + Prisma + Server Actions

**Status:** Scaffold ready behind `ENABLE_FIUU_PAYMENT` in
`constants/payment.ts` (default `false` = manual + OCR). Flip to `true` when
merchant credentials and notify URLs are live.

Implementation lives in `features/payments/` + `app/api/fiuu/`.

Do **not** reintroduce Firebase. Stack: see `docs/TECHNOLOGY_STACK.md`.
Order domain: see `docs/DATABASE_SCHEMA.md`.
Payments feature notes: `features/payments/payments.docs.md`.

### Locked stack used by this guide

| Layer | Choice |
| --- | --- |
| Framework | Next.js `16.2.6` (read `node_modules/next/dist/docs/` before API changes) |
| Runtime | Bun |
| Hosting | Vercel |
| DB | Neon PostgreSQL via Prisma |
| Auth | Better Auth (admin only; guest checkout for Fiuu) |
| Validation | Zod + `next-safe-action` (`actionClient`) |
| Files | Cloudflare R2 (proof screenshots for manual path; not required for Fiuu) |

---

## Architecture

```text
Customer → Checkout UI → Server Action (Prisma Order) → Fiuu Hosted Pay Page
Fiuu → POST Notify URL (Route Handler) → verify skey → Prisma Order update
Fiuu → Callback URL → thank-you / order status page
```

Manual path (now):

```text
Customer → checkout → upload proof to R2 → Order pending_review → admin confirm
```

Fiuu path (later) can coexist: same `Order` row, different payment channel /
status fields.

---

## Important notes

Use **Server Actions** (`features/orders/actions/` or payment feature) for:

- Creating / finalizing the Prisma `Order` before redirect
- Generating `vcode`
- Returning the Fiuu POST payload to the client
- Zod validation of cart + customer fields

Use **Route Handlers** for:

- Notify URL (`app/api/fiuu/notify/route.ts`)
- Callback URL (`app/api/fiuu/callback/route.ts`) if Fiuu posts there

Fiuu needs publicly reachable HTTPS endpoints. Local tunnels only for sandbox
tests. Register production `NEXT_PUBLIC_APP_URL` / `APP_URL` domain in Fiuu.

Guest checkout uses `actionClient` (not `authActionClient`). Admin review stays
on `authActionClient`.

Before changing Next.js route or Server Action conventions, read the matching
guide under `node_modules/next/dist/docs/`.

---

## Schema prep (before coding Fiuu)

Current `PaymentChannel`: `unionbank` | `gcash` | `bpi`.

Current `OrderStatus`: `pending_review` | `confirmed` | `rejected` | `cancelled`.

Recommended Prisma extensions when enabling Fiuu (separate migration):

1. Add `PaymentChannel.fiuu` (or a separate `paymentMethod: manual | fiuu`).
2. Add statuses such as `awaiting_payment` (created, not yet paid) and keep
   `confirmed` for paid/accepted — or map Fiuu success (`status === "00"`)
   directly to `confirmed` if no admin step is needed for card/wallet pays.
3. Optional columns on `Order`:
   - `fiuuTranId` (String?)
   - `fiuuAppCode` (String?)
   - `fiuuPaidAt` (DateTime?)
   - `fiuuRawStatus` (String?) for audit
4. Use existing `orderNumber` as Fiuu `orderid` (stable, unique, human-readable).
5. Use `subtotalPhp` as the amount source. Format for Fiuu as `"1234.00"`
   (two decimal places). App money storage stays whole pesos `Int`.

Update `docs/DATABASE_SCHEMA.md` when that migration lands.

---

## Environment variables

Add to `.env.example` / Vercel (server-only; never `NEXT_PUBLIC_` for keys).
Wire through `config/env.ts` with Zod when implementing.

```env
FIUU_MERCHANT_ID=
FIUU_VERIFY_KEY=
FIUU_SECRET_KEY=
# Optional sandbox vs live base URL if Fiuu issues separate hosts
# FIUU_PAY_BASE_URL=https://pay.fiuu.com/RMS/pay

# Already in stack — Fiuu notify/callback must use the public canonical URL
APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

Keep `FIUU_VERIFY_KEY` and `FIUU_SECRET_KEY` out of client bundles, logs, and
docs examples with real values.

---

## Recommended folder structure

Match feature-based layout (see `features/auth/`):

```text
features/
  orders/                         # or features/payments/
    actions/
      create-fiuu-payment.action.ts
    server/
      fiuu-vcode.ts               # md5 helpers, server-only
      fiuu-verify-skey.ts
    utils/
      format-fiuu-amount.ts
    components/
      FiuuCheckoutButton.tsx
    orders.docs.md

app/
  api/
    fiuu/
      notify/route.ts             # source of truth webhook
      callback/route.ts           # browser return / optional POST
  (public)/
    checkout/page.tsx
    orders/[orderNumber]/page.tsx # thank-you / status

lib/
  prisma.ts                       # existing Neon client
```

Shared crypto: prefer Node `crypto.createHash("md5")` or existing `crypto-js`
already in the repo — keep hashing **server-side only**.

---

## Server Action (sketch)

Illustrative only. Adjust to real cart + `Order` / `OrderItem` create path.
Validate with Zod. Persist via Prisma. Do not use Firestore.

```ts
"use server"

import { createHash } from "node:crypto"
import { actionClient } from "@/lib/safe.action"
import { prisma } from "@/lib/prisma"
import { env } from "@/config/env"
import { z } from "zod"

function md5(value: string) {
  return createHash("md5").update(value).digest("hex")
}

function formatFiuuAmount(phpPesos: number) {
  return phpPesos.toFixed(2)
}

const CreateFiuuPaymentSchema = z.object({
  orderNumber: z.string().min(1),
  // Or accept cart + customer and create the order inside this action.
})

export const createFiuuPaymentAction = actionClient
  .metadata({ actionName: "createFiuuPaymentAction" })
  .inputSchema(CreateFiuuPaymentSchema)
  .action(async ({ parsedInput }) => {
    const order = await prisma.order.findUnique({
      where: { orderNumber: parsedInput.orderNumber },
    })

    if (!order) {
      throw new Error("Order not found")
    }

    // Gate: only awaiting_payment / unpaid Fiuu orders
    const merchantId = process.env.FIUU_MERCHANT_ID!
    const verifyKey = process.env.FIUU_VERIFY_KEY!
    const amount = formatFiuuAmount(order.subtotalPhp)
    const currency = "PHP"
    const orderId = order.orderNumber

    const vcode = md5(
      amount + merchantId + orderId + verifyKey + currency
    )

    return {
      paymentUrl: `https://pay.fiuu.com/RMS/pay/${merchantId}/`,
      fields: {
        merchant_id: merchantId,
        amount,
        orderid: orderId,
        currency,
        bill_name: order.customerName,
        bill_email: order.customerEmail,
        bill_mobile: order.customerPhone,
        vcode,
      },
    }
  })
```

Notes:

- Prefer creating the full order (line snapshots, customer, `eventDate`) in one
  transaction **before** returning the Fiuu payload.
- `bill_*` fields come from the Prisma order, not a second unvalidated form.
- Wire `FIUU_*` through `config/env.ts` instead of raw `process.env` once live.

---

## Checkout button (client)

```tsx
"use client"

import { createFiuuPaymentAction } from "@/features/orders/actions/create-fiuu-payment.action"

export function FiuuCheckoutButton({
  orderNumber,
}: {
  orderNumber: string
}) {
  async function handleCheckout() {
    const result = await createFiuuPaymentAction({ orderNumber })

    if (!result?.data) {
      // surface result.serverError / validation errors in UI
      return
    }

    const form = document.createElement("form")
    form.method = "POST"
    form.action = result.data.paymentUrl

    for (const [key, value] of Object.entries(result.data.fields)) {
      const input = document.createElement("input")
      input.type = "hidden"
      input.name = key
      input.value = String(value)
      form.appendChild(input)
    }

    document.body.appendChild(form)
    form.submit()
  }

  return (
    <button type="button" onClick={handleCheckout}>
      Pay with Fiuu
    </button>
  )
}
```

Manual channels remain available via `constants/payment.ts` until Fiuu replaces
or sits beside them.

---

## Notify route (source of truth)

```ts
import { createHash } from "node:crypto"
import { prisma } from "@/lib/prisma"

function md5(value: string) {
  return createHash("md5").update(value).digest("hex")
}

export async function POST(req: Request) {
  const formData = await req.formData()
  const payload = Object.fromEntries(formData.entries()) as Record<
    string,
    string
  >

  const secretKey = process.env.FIUU_SECRET_KEY
  if (!secretKey) {
    return new Response("Misconfigured", { status: 500 })
  }

  const preSkey = md5(
    payload.tranID +
      payload.orderid +
      payload.status +
      payload.domain +
      payload.amount +
      payload.currency
  )

  const expected = md5(
    payload.paydate +
      payload.domain +
      preSkey +
      payload.appcode +
      secretKey
  )

  if (expected !== payload.skey) {
    return new Response("Invalid Signature", { status: 400 })
  }

  // Idempotent update by orderNumber === Fiuu orderid
  if (payload.status === "00") {
    await prisma.order.updateMany({
      where: {
        orderNumber: payload.orderid,
        // status: { in: ["awaiting_payment", "pending_review"] },
      },
      data: {
        status: "confirmed", // or a dedicated paid status once migrated
        // fiuuTranId: payload.tranID,
        // fiuuPaidAt: new Date(),
      },
    })
  }

  // Log without dumping full secrets; avoid logging skey in production dumps
  return new Response("OK")
}
```

Never mark an order paid from the browser callback alone. Notify URL + `skey`
verification is authoritative.

---

## Production flow

1. Guest completes cart + customer form (2-day `eventDate` rule still applies).
2. Server Action creates Prisma `Order` + `OrderItem` snapshots.
3. Server Action builds Fiuu `vcode` and returns POST fields.
4. Client auto-submits form to Fiuu hosted page.
5. Customer pays on Fiuu.
6. Fiuu POSTs Notify URL.
7. Route Handler verifies `skey`, updates Prisma order.
8. Customer lands on callback / thank-you page; UI reads order status from DB.
9. Optional: send order email (Elastic Mail env already reserved in `config/env.ts`).

---

## Coexistence with manual payment

| Path | Proof | Status start | Paid signal |
| --- | --- | --- | --- |
| Manual (now) | R2 screenshot | `pending_review` | Admin confirm |
| Fiuu (later) | Fiuu notify | `awaiting_payment` (recommended) | Notify `status === "00"` |

UI should let the owner choose channel, or phase Fiuu in behind a feature flag /
env check (`FIUU_MERCHANT_ID` present).

---

## Security checklist

- Keep Verify Key and Secret Key server-side only (`config/env.ts`).
- Verify `skey` on every notify.
- Never trust frontend redirects for payment success.
- Notify URL is source of truth; make updates idempotent.
- Do not log access tokens, full signed URLs, or raw secret keys.
- HTTPS only in production (Vercel).
- Register production domain in Fiuu merchant settings.
- Validate amounts against Prisma `subtotalPhp` before accepting paid status
  (reject notify if amount mismatches).
- Rate-limit abuse on create-payment actions where practical.

---

## Definition of done (when implementing)

- Prisma migration for Fiuu channel/status/fields reviewed.
- Zod + server authorization boundaries for guest vs admin actions.
- Notify + callback routes smoke-tested against Fiuu sandbox.
- Manual payment path still works.
- `docs/DATABASE_SCHEMA.md` and `docs/PROJECT_DOCS.md` updated.
- `bun run lint`, `bun run typecheck`, `bun run build` pass.

---

## Related docs

- `docs/PROJECT_DOCS.md` — product scope (manual now, Fiuu later)
- `docs/DATABASE_SCHEMA.md` — Order / PaymentChannel model
- `docs/TECHNOLOGY_STACK.md` — locked stack
- `docs/CLOUDFLARE_STORAGE_SETUP.md` — R2 for manual proof uploads
