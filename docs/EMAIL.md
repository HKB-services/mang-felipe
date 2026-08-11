# Email Design & Delivery

Source of truth for **transactional email**: design system (react-email), brand
alignment with the public Mang Felipe palette, send pipeline (Elastic Mail),
and which messages the app sends.

Product scope: `docs/PROJECT_DOCS.md`.
Stack: `docs/TECHNOLOGY_STACK.md`.
Order / track copy rules: `features/orders/orders.docs.md`,
`features/track-order/track-order.docs.md`.

**Status:** send path uses `emails/` React Email templates rendered to HTML
before Elastic Mail delivery. Keep new transactional mail types on this system.

---

## Goals

1. One branded look for customer mail — same Mang Felipe identity as the public
   site (forest leaf, banana paper, ember accent).
2. Templates live as **react-email** React components under `emails/`, not
   ad-hoc HTML strings inside server actions.
3. Delivery stays on **Elastic Mail** through `services/email.service.ts`.
4. Never email secrets, payment proof URLs, or `adminNotes` to guests.

---

## How email works (pipeline)

```text
Server action / server code
  → render react-email template to HTML string (@react-email/render)
  → sendEmail({ recipients, subject, htmlContent })
  → Elastic Mail HTTP API (ELASTIC_MAIL_*)
```

| Layer | File / tool | Role |
| --- | --- | --- |
| Templates | `emails/*.tsx` | react-email components (layout + per-message bodies) |
| Preview | `bun run email:dev` | Local react-email studio (`email dev`) |
| Render | `@react-email/render` | `render(<Template … />)` → HTML string |
| Send | `services/email.service.ts` | `sendEmail` → Elastic Mail |
| Env | `config/env.ts` | `ELASTIC_MAIL_API_KEY`, `ELASTIC_MAIL_DOMAIN` (From), `ELASTIC_MAIL_API_URL` |
| App links | `NEXT_PUBLIC_APP_URL` | Absolute URLs for `/track`, `/order`, etc. |

### Rules

1. Call `sendEmail` only from **server** code (actions, route handlers).
2. Treat Elastic Mail env as optional at boot (`env` marks them optional). If
   missing: **still complete the business write** (order create / save Lalamove
   URL); surface a warning to admin when mail was expected but failed. Do not
   roll back the order because mail failed.
3. Fire-and-forget is OK for guest receipt after order create (`void sendEmail`)
   so checkout latency stays low; Lalamove save should await send so admin can
   see `emailWarning` / `lalamoveTrackingEmailedAt`.
4. `htmlContent` passed to Elastic Mail is a **string**. Always render templates
   before send — do not pass React elements to the API.
5. From address = `ELASTIC_MAIL_DOMAIN` (configured sender). Display name may be
   set later in Elastic / payload if product wants “Mang Felipe”.

### Current callers

| Trigger | Where today | Subject pattern |
| --- | --- | --- |
| Guest checkout (email provided) | `features/orders/actions/create-order.action.ts` → `sendOrderReceiptEmail` | `Your Mang Felipe order {orderNumber}` |
| Admin saves / re-sends Lalamove URL | `features/orders/actions/save-lalamove-tracking.action.ts` → `sendDeliveryTrackingEmail` | `Your Mang Felipe order {orderNumber} — delivery tracking` |

Render helpers live in `features/orders/server/send-order-emails.tsx`; actions
stay focused on business writes.

---

## Brand alignment (app ↔ email)

Public commerce palette lives on `:root` in `app/globals.css` as `--mf-*`.
Email clients ignore CSS variables and most of Tailwind — **hardcode hex** in
react-email styles (or a small `emails/tokens.ts` that mirrors the light
palette).

Use the **light** Mang Felipe palette only in email (dark mode in clients is
unreliable; do not ship dark email variants).

| Token (app) | Hex (email) | Use in mail |
| --- | --- | --- |
| `--mf-canvas` | `#f7f4ef` | Outer background |
| `--mf-surface` | `#ffffff` | Content card |
| `--mf-panel` | `#e9f0e8` | Soft panels / zebra rows |
| `--mf-ink` | `#103d2d` | Headings, body text |
| `--mf-muted` | `#51675d` | Secondary copy, labels |
| `--mf-border` | `#103d2d` @ ~14% opacity → use `#d5e0da` solid approx | Dividers, card border |
| `--mf-hero` | `#103d2d` | Header bar |
| `--mf-hero-ink` | `#ffffff` | Header text / logo treatment |
| `--mf-accent` | `#b44c35` | Primary CTA button, emphasis links |
| `--mf-gold` | `#f2bd65` | Thin accent rule under header (optional) |
| `--mf-notice` | `#fff5dc` | Callout / pending-review notice box |
| `--mf-notice-ink` | `#754d0d` | Notice text |

### Typography

| App | Email |
| --- | --- |
| `Noto_Sans` (`--font-sans`) | System stack that reads close: `"Noto Sans", "Segoe UI", Helvetica, Arial, sans-serif` |
| Geist Mono | Avoid in body mail; mono only if showing an order number code block |

Do **not** rely on `next/font` inside emails. Prefer web-safe / system fonts so
Gmail/Outlook render consistently. Optional: host a logo image; do not embed
variable fonts.

### Logo / imagery

- Brand mark: Mang Felipe (`APP_DETAILS.logo` → `/logo/mang-felipe.jpg`).
- In email: absolute URL
  `{NEXT_PUBLIC_APP_URL}/logo/mang-felipe.jpg` (or a dedicated email-safe PNG
  under `public/` if JPG is awkward in some clients).
- Parent line under logo (small muted): Happy Moments Food Corporation.
- No sister-brand collage in transactional mail (keep one brand).
- No hero food photography in v1 transactional templates (keep payload small).

### Voice

- From: Mang Felipe / Happy Moments Food Corporation.
- Tone: clear, warm, short. Order number always prominent.
- Primary CTA verbs: **Track order**, **Open Lalamove tracking**, **View menu**.
- Contact fallback: Viber / phones from `SHOP_CONTACT` / `APP_DETAILS` — put in
  footer, not the first paragraph.

---

## Layout system (react-email)

Shared shell under `emails/`:

```text
emails/
  tokens.ts                 # hex + font stacks (mirror --mf-* light)
  components/
    EmailShell.tsx          # Html, Head, Preview, Body, outer canvas
    EmailHeader.tsx         # forest hero bar + logo + Mang Felipe
    EmailFooter.tsx         # contact + legal one-liners
    EmailButton.tsx         # accent CTA
    EmailNotice.tsx         # notice callout (pending review, etc.)
  order-receipt.tsx         # post-checkout
  delivery-tracking.tsx     # Lalamove link
  email.tsx                 # preview alias for react-email dev UI
```

### Shell structure (every transactional mail)

1. **Preview** text (inbox snippet) — one short sentence + order number.
2. **Canvas** (`#f7f4ef`) full width.
3. **Card** (`#ffffff`, max-width ~560–600px, centered, light border).
4. **Header** — `#103d2d` bar; white title “Mang Felipe”; optional gold 2px rule.
5. **Body** — ink text, muted labels, one primary CTA.
6. **Footer** — muted: service areas, Viber, “Prices subject to change”, delivery
   fee not included when relevant; link to site home.

### CTA button

- Background `#b44c35`, text `#ffffff`, padding ~12px 20px, border-radius ~6px
  (match app `--radius` spirit; avoid huge pills).
- One primary button per email. Secondary actions = text links in `#103d2d` or
  `#b44c35`.

### Spacing

- Generous padding inside card (~24–32px).
- One job per email (receipt **or** tracking — do not mash both unless product
  asks).

### Accessibility / clients

- All meaningful links are real `<a href>` with full absolute HTTPS URLs.
- Alt text on logo.
- Table-based layout via react-email primitives (`Section`, `Row`, `Column`,
  `Container`) — do not invent custom flex grids that Outlook breaks.
- Inline styles only (react-email default). No Tailwind in email components
  unless the project later adopts a documented email Tailwind pipeline.
- Prefer plain language status copy over colored badges alone.

---

## Message catalog

### 1. Order receipt (guest checkout)

| | |
| --- | --- |
| When | Order created and `customerEmail` set |
| Template | `emails/order-receipt.tsx` |
| Must include | Order number, food subtotal (₱), pending-review notice, link to `/track` (and/or thank-you route), fulfillment date/slot summary if cheap to pass |
| Must not include | Payment proof image/URL, admin notes, internal ids, raw R2 keys |
| Notice | Use `EmailNotice`: payment proof received — waiting for shop review |

Subject: `Your Mang Felipe order {orderNumber}`

### 2. Delivery tracking (Lalamove)

| | |
| --- | --- |
| When | Admin saves Lalamove URL first time, or re-send checked; and email on order |
| Template | `emails/delivery-tracking.tsx` |
| Must include | Order number, fulfillment date + slot label, **Open Lalamove** CTA (external), secondary link to `/track?order=…` |
| Must not include | Proof, admin notes |
| Pickup | Usually no mail (no Lalamove URL) |

Subject: `Your Mang Felipe order {orderNumber} — delivery tracking`

### 3. Future (not v1)

- Order confirmed / rejected (optional; product may rely on `/track` only).
- Password reset — Better Auth owns auth mail unless we customize later.
- Marketing blasts — out of scope (transactional only).

---

## Implementation pattern

```ts
import { render } from "react-email"
import { OrderReceiptEmail } from "@/emails/order-receipt"
import { sendEmail } from "@/services/email.service"

const htmlContent = await render(
  OrderReceiptEmail({
    orderNumber,
    customerName,
    subtotalPhp,
    trackUrl: `${env.NEXT_PUBLIC_APP_URL}/track?order=${encodeURIComponent(orderNumber)}`,
  })
)

await sendEmail({
  recipients: [customerEmail],
  subject: `Your Mang Felipe order ${orderNumber}`,
  htmlContent,
})
```

Keep render + subject construction in a thin helper under e.g.
`features/orders/server/send-order-emails.tsx` so actions stay readable.

### Preview locally

```bash
bun run email:dev
```

Open the react-email dev UI; iterate on `emails/*` without sending.

### Testing sends

- Use a personal inbox + real Elastic Mail sandbox/prod key in `.env.local`.
- Never commit API keys.
- Verify: logo absolute URL, CTA click, Preview text, mobile width ~320px.

---

## Security & privacy

| Do | Don't |
| --- | --- |
| Email only when guest opted in (`customerEmail`) | Email random leads / scraped addresses |
| Absolute HTTPS app + Lalamove links | Relative `/track` links |
| Generic errors if send fails | Leak Elastic Mail API responses to the browser |
| Same safe field set as public track | Attach payment screenshots |

---

## Out of scope

- Dark-mode email themes
- Sister-brand (Rak en Rolls / Oh My Bilao!) separate From identities in v1
- SMS / Viber Business API as email replacement
- Drag-and-drop ESP template builders (keep code in repo)
- Replacing Elastic Mail without a stack decision in `TECHNOLOGY_STACK.md`

---

## Current checklist

1. Keep shared tokens/components matching `--mf-*` light hex.
2. Preview template changes with `bun run email:dev`.
3. Render React Email templates before `sendEmail`; `htmlContent` is a string.
4. Keep `emails/email.tsx` as a preview alias, not a shipped stub.
5. Point feature docs at this file when touching mail.

---

## Related

| Doc | Relation |
| --- | --- |
| `services/email.service.ts` | Transport only |
| `docs/ADMIN.md` | Admin triggers Lalamove email |
| `features/track-order/track-order.docs.md` | Guest tracking + email copy expectations |
| `constants/app.details.ts` / `constants/contact.ts` | Name, pitch, Viber, phones for footer |
| `app/globals.css` | Canonical `--mf-*` (email mirrors light values) |
