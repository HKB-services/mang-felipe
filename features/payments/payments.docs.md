# Payments feature

Manual bank/e-wallet proof + optional Fiuu hosted pay.

## Toggle

`constants/payment.ts`:

```ts
export const ENABLE_FIUU_PAYMENT = false as boolean
```

| Value | Mode |
| --- | --- |
| `false` | Manual UnionBank / GCash / BPI + screenshot OCR assist |
| `true` | Fiuu hosted payment (`createFiuuPaymentAction` + notify/callback) |

Helpers: `isManualPaymentEnabled()`, `isFiuuPaymentEnabled()`.

## Manual + OCR

1. Customer picks channel + uploads payment screenshot.
2. Client runs `usePaymentProofOcr()` → tesseract.js →
   `parsePaymentProofText()` for amount / ref / channel hints.
3. OCR is **assistive only**. Admin still confirms; never auto-pay from OCR.
4. Optional: `analyzePaymentProofTextAction` for server-validated parse shape.

## Fiuu

Server helpers: `features/payments/server/fiuu.ts`, `fiuu-verify.ts`.

- Action: `createFiuuPaymentAction` — POST fields + pay URL
- UI: `FiuuCheckoutButton`
- Notify: `POST /api/fiuu/notify` (source of truth)
- Callback: `/api/fiuu/callback` → redirect thank-you

Needs `FIUU_MERCHANT_ID`, `FIUU_VERIFY_KEY`, `FIUU_SECRET_KEY`,
`FIUU_PAY_URL` (and optional `FIUU_API_BASE_URL`) in env when toggle is on.

Guide: `docs/FIUU_NEXTJS_PRISMA_SERVER_ACTIONS.md`.

## Layout

```text
features/payments/
  actions/
  components/
  hooks/
  server/
  utils/
  payments.docs.md
app/api/fiuu/
  notify/route.ts
  callback/route.ts
```
