# Email Design & Delivery

Source of truth for **transactional email**: design system (react-email), send
pipeline (Elastic Mail), and which messages the app sends.

Product scope: `docs/PROJECT_DOCS.md`.
Stack: `docs/TECHNOLOGY_STACK.md`.
Order / track copy rules: `features/orders/orders.docs.md`,
`features/track-order/track-order.docs.md`.

**Status:** send path uses `emails/` React Email templates rendered to HTML
before Elastic Mail delivery. Keep new transactional mail types on this system.

---

## Goals

1. One clear look for customer mail — modern, flat, type-led. Same Mang Felipe
   color tokens as the public site, not a copy of the marketing page chrome.
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

| Layer     | File / tool                 | Role                                                                         |
| --------- | --------------------------- | ---------------------------------------------------------------------------- |
| Templates | `emails/*.tsx`              | react-email components (layout + per-message bodies)                         |
| Preview   | `bun run email:dev`         | Local react-email studio (`email dev`)                                       |
| Render    | `@react-email/render`       | `render(<Template … />)` → HTML string                                       |
| Send      | `services/email.service.ts` | `sendEmail` → Elastic Mail                                                   |
| Env       | `config/env.ts`             | `ELASTIC_MAIL_API_KEY`, `ELASTIC_MAIL_DOMAIN` (From), `ELASTIC_MAIL_API_URL` |
| App links | `NEXT_PUBLIC_APP_URL`       | Absolute URLs for `/track`, `/order`, etc.                                   |

### Rules

1. Call `sendEmail` only from **server** code (actions, route handlers).
2. Treat Elastic Mail env as optional at boot (`env` marks them optional). If
   missing: **still complete the business write** (order create / save Lalamove
   URL); surface a warning to admin when mail was expected but failed. Do not
   roll back the order because mail failed.
3. Fire-and-forget is OK for guest receipt after order create (`void sendEmail`)
   so checkout latency stays low; Lalamove save and admin status update should
   await send so admin can see `emailWarning` / sent state.
4. `htmlContent` passed to Elastic Mail is a **string**. Always render templates
   before send — do not pass React elements to the API.
5. From address = `ELASTIC_MAIL_DOMAIN` (configured sender). Display name may be
   set later in Elastic / payload if product wants “Mang Felipe”.

### Current callers

| Trigger                             | Where today                                                                                  | Subject pattern                                            |
| ----------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Guest checkout (email provided)     | `features/orders/actions/create-order.action.ts` → `sendOrderReceiptEmail`                   | `Your Mang Felipe order {orderNumber}`                     |
| Admin updates order status          | `features/admin/orders/actions/update-order-status.action.ts` → `sendOrderStatusUpdateEmail` | `Your Mang Felipe order {orderNumber} is {status}`         |
| Admin saves / re-sends Lalamove URL | `features/orders/actions/save-lalamove-tracking.action.ts` → `sendDeliveryTrackingEmail`     | `Your Mang Felipe order {orderNumber} — delivery tracking` |

Render helpers live in `features/orders/server/send-order-emails.tsx`; actions
stay focused on business writes.

---

## Visual direction

**Subject:** Mang Felipe guest order mail (receipt, status update, delivery tracking).
**Audience:** customers who already placed an order.
**Job:** one status fact + one next step. Not marketing.

### Design thesis

Transactional mail is a receipt desk, not a landing page. Brand lives in type
and flat color — not in logo art, photo heroes, or decorative chrome.

**Signature element:** the **order number** as the largest, most memorable
block on the page (mono, high weight, generous padding). Everything else stays
quiet so that code is what people remember and can find again.

### Do / don't

| Do                                 | Don't                                               |
| ---------------------------------- | --------------------------------------------------- |
| Flat solid fills only              | Gradients, soft fades, mesh, glow                   |
| Text wordmark “Mang Felipe”        | App logo / JPG / PNG mark in header                 |
| Light surface header on white card | Dark full-width hero bar                            |
| One solid accent CTA               | Pill stacks, shadow buttons, multi-CTA rows         |
| Hairline borders (`1px` solid)     | Gold rules, badge stickers, floating chips          |
| Order number as visual hero        | Food photography, sister-brand collage              |
| System / web-safe sans             | `next/font`, variable fonts, display serif for body |

### Why no logo

Email clients block or rewrite remote images often. A text wordmark always
renders. Logo also fights the order number for attention. Keep imagery out of
v1 transactional templates.

---

## Brand tokens (app ↔ email)

Public commerce palette lives on `:root` in `app/globals.css` as `--mf-*`.
Email clients ignore CSS variables and most of Tailwind — **hardcode hex** in
`emails/tokens.ts` (mirror light palette only).

Use the **light** Mang Felipe palette only. Do not ship dark email variants
(client dark mode is unreliable).

| Token (app)       | Hex (email) | Use in mail                       |
| ----------------- | ----------- | --------------------------------- |
| `--mf-canvas`     | `#f7f4ef`   | Outer body background (flat)      |
| `--mf-surface`    | `#ffffff`   | Content card                      |
| `--mf-panel`      | `#e9f0e8`   | Order-number well, soft row fills |
| `--mf-ink`        | `#103d2d`   | Headings, body, wordmark          |
| `--mf-muted`      | `#51675d`   | Labels, secondary copy, footer    |
| `--mf-border`     | `#d5e0da`   | Card edge, dividers, wells        |
| `--mf-accent`     | `#b44c35`   | Primary CTA fill; emphasis links  |
| `--mf-notice`     | `#fff5dc`   | Notice callout fill (flat)        |
| `--mf-notice-ink` | `#754d0d`   | Notice text                       |

**Retired for email (do not use in new templates):**

- `--mf-hero` / `--mf-hero-ink` dark header bar
- `--mf-gold` accent rule under header
- Logo image URLs (`APP_DETAILS.logo`, `/logo/mang-felipe.jpg`)

Keep unused keys out of `emails/tokens.ts` when you next touch tokens, or leave
them unused — do not wire them back into layout.

### Typography

| Role         | Stack                                                      | Notes                                     |
| ------------ | ---------------------------------------------------------- | ----------------------------------------- |
| Body / UI    | `"Noto Sans", "Segoe UI", Helvetica, Arial, sans-serif`    | Match app sans spirit without `next/font` |
| Order number | `"SFMono-Regular", Consolas, "Liberation Mono", monospace` | Only place for mono                       |
| Wordmark     | Same as body, weight 700–800, ~18–20px                     | Ink on white; no image                    |

Do **not** load custom webfonts in email. Prefer stacks that Gmail and Outlook
already resolve.

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
  tokens.ts                 # flat hex + font stacks (mirror --mf-* light)
  components/
    EmailShell.tsx          # Html, Head, Preview, Body, outer canvas + card
    EmailHeader.tsx         # text wordmark + parent line (no Img)
    EmailFooter.tsx         # contact + legal one-liners
    EmailButton.tsx         # flat accent CTA
    EmailNotice.tsx         # flat notice callout
  order-receipt.tsx         # post-checkout
  order-status-update.tsx   # admin status changes
  delivery-tracking.tsx     # Lalamove link
  email.tsx                 # preview alias for react-email dev UI
```

### Shell structure (every transactional mail)

```text
[ canvas #f7f4ef ]
  [ card #ffffff · max ~560–600px · 1px #d5e0da · radius ~8px ]
    [ header · white · padding · wordmark + parent (muted) · bottom hairline ]
    [ body · ink · order number well · copy · one CTA ]
    [ footer · muted · contact · legal ]
```

1. **Preview** text (inbox snippet) — one short sentence + order number.
2. **Canvas** — flat `#f7f4ef`, full width. No gradient wash.
3. **Card** — `#ffffff`, centered, light border, modest radius (~8px). No
   drop shadow required (many clients strip it).
4. **Header** — light surface, not a colored bar. Text: **Mang Felipe**. Under
   it, small muted parent: Happy Moments Food Corporation. Bottom border only
   (`1px solid #d5e0da`). No logo `Img`. No gold rule.
5. **Body** — short heading, short paragraph, **order number well** (panel fill
   - border), optional notice, one summary block, one primary CTA.
6. **Footer** — muted: service areas, Viber, “Prices subject to change”,
   delivery fee note when relevant; link to site home.

### Order number well (signature)

- Background `#e9f0e8`, border `#d5e0da`, padding ~16–20px, radius ~8px.
- Label uppercase / small muted: `Order number`.
- Code: mono, ~20–24px, weight 700–800, ink. No badge chrome around it.

### CTA button

- Background `#b44c35`, text `#ffffff`, padding ~12px 20px, radius ~6px.
- Flat fill only — no gradient, no box-shadow, no full-pill (`9999px`).
- One primary button per email. Secondary actions = text links in `#103d2d` or
  `#b44c35`.

### Spacing

- Card content padding ~24–32px.
- One job per email (receipt **or** tracking — do not mash both unless product
  asks).

### Accessibility / clients

- All meaningful links are real `<a href>` with full absolute HTTPS URLs.
- No logo means no logo alt requirement; decorative rules stay CSS borders.
- Table-based layout via react-email primitives (`Section`, `Row`, `Column`,
  `Container`) — do not invent custom flex grids that Outlook breaks.
- Inline styles only (react-email default). No Tailwind in email components
  unless the project later adopts a documented email Tailwind pipeline.
- Prefer plain language status copy over colored badges alone.
- Respect that many clients ignore `border-radius`; layout must still read when
  corners are square.

---

## Message catalog

### 1. Order receipt (guest checkout)

|                  |                                                                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| When             | Order created and `customerEmail` set                                                                                                             |
| Template         | `emails/order-receipt.tsx`                                                                                                                        |
| Must include     | Order number, food subtotal (₱), pending-review notice, link to `/track` (and/or thank-you route), fulfillment date/slot summary if cheap to pass |
| Must not include | Payment proof image/URL, admin notes, internal ids, raw R2 keys, logo image                                                                       |
| Notice           | Use `EmailNotice`: payment proof received — waiting for shop review                                                                               |

Subject: `Your Mang Felipe order {orderNumber}`

### 2. Delivery tracking (Lalamove)

|                  |                                                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| When             | Admin saves Lalamove URL first time, or re-send checked; and email on order                                       |
| Template         | `emails/delivery-tracking.tsx`                                                                                    |
| Must include     | Order number, fulfillment date + slot label, **Open Lalamove** CTA (external), secondary link to `/track?order=…` |
| Must not include | Proof, admin notes, logo image                                                                                    |
| Pickup           | Usually no mail (no Lalamove URL)                                                                                 |

Subject: `Your Mang Felipe order {orderNumber} — delivery tracking`

### 3. Order status update (admin review)

|                  |                                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| When             | Admin changes status to `pending_review`, `confirmed`, `rejected`, or `cancelled`; and email on order |
| Template         | `emails/order-status-update.tsx`                                                                      |
| Must include     | Order number, human-readable status label, short next step, fulfillment summary, Track order CTA      |
| Must not include | Proof, admin notes, internal ids, raw R2 keys, logo image                                             |
| No-op            | Do not send when requested status already matches current status                                      |

Subject: `Your Mang Felipe order {orderNumber} is {status}`

### 4. Future (not v1)

- Password reset — Better Auth owns auth mail unless we customize later.
- Marketing blasts — out of scope (transactional only).

---

## Implementation pattern

```ts
import { render } from "react-email";
import { OrderReceiptEmail } from "@/emails/order-receipt";
import { sendEmail } from "@/services/email.service";

const htmlContent = await render(
  OrderReceiptEmail({
    orderNumber,
    customerName,
    subtotalPhp,
    trackUrl: `${env.NEXT_PUBLIC_APP_URL}/track?order=${encodeURIComponent(orderNumber)}`,
  }),
);

await sendEmail({
  recipients: [customerEmail],
  subject: `Your Mang Felipe order ${orderNumber}`,
  htmlContent,
});
```

Keep render + subject construction in a thin helper under e.g.
`features/orders/server/send-order-emails.tsx` so actions stay readable.

Props must **not** require `logoUrl`. Header is text-only.

### Preview locally

```bash
bun run email:dev
```

Open the react-email dev UI; iterate on `emails/*` without sending.

### Testing sends

- Use a personal inbox + real Elastic Mail sandbox/prod key in `.env.local`.
- Never commit API keys.
- Verify: wordmark readable without images, CTA click, Preview text, mobile
  width ~320px, order number still dominant when images blocked.

---

## Security & privacy

| Do                                               | Don't                                          |
| ------------------------------------------------ | ---------------------------------------------- |
| Email only when guest opted in (`customerEmail`) | Email random leads / scraped addresses         |
| Absolute HTTPS app + Lalamove links              | Relative `/track` links                        |
| Generic errors if send fails                     | Leak Elastic Mail API responses to the browser |
| Same safe field set as public track              | Attach payment screenshots                     |

---

## Out of scope

- Dark-mode email themes
- Gradients, logo marks, or marketing hero imagery in transactional mail
- Sister-brand (Rak en Rolls / Oh My Bilao!) separate From identities in v1
- SMS / Viber Business API as email replacement
- Drag-and-drop ESP template builders (keep code in repo)
- Replacing Elastic Mail without a stack decision in `TECHNOLOGY_STACK.md`

---

## Current checklist

1. Keep shared tokens flat solids from `--mf-*` light hex; no gradient helpers.
2. Header = text wordmark only; drop logo props and `Img` usage.
3. Order number well is the signature block in every guest mail.
4. Preview template changes with `bun run email:dev`.
5. Render React Email templates before `sendEmail`; `htmlContent` is a string.
6. Keep `emails/email.tsx` as a preview alias, not a shipped stub.
7. Point feature docs at this file when touching mail.

---

## Related

| Doc                                                 | Relation                                        |
| --------------------------------------------------- | ----------------------------------------------- |
| `services/email.service.ts`                         | Transport only                                  |
| `docs/ADMIN.md`                                     | Admin triggers Lalamove email                   |
| `features/track-order/track-order.docs.md`          | Guest tracking + email copy expectations        |
| `constants/app.details.ts` / `constants/contact.ts` | Name, pitch, Viber, phones for footer           |
| `app/globals.css`                                   | Canonical `--mf-*` (email mirrors light values) |
