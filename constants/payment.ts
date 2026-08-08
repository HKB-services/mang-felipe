/**
 * Manual payment channels shown on checkout.
 * Public business details — not secrets.
 */

/**
 * Payment mode toggle.
 * - `false` → manual UnionBank / GCash / BPI + screenshot (+ OCR assist)
 * - `true`  → Fiuu hosted payment (needs FIUU_* env + live merchant)
 *
 * Flip this one boolean while waiting on Fiuu / when going live.
 */
export const ENABLE_FIUU_PAYMENT = false as boolean

export const isFiuuPaymentEnabled = () => ENABLE_FIUU_PAYMENT
export const isManualPaymentEnabled = () => !ENABLE_FIUU_PAYMENT

export const PAYMENT_CHANNELS = {
  unionbank: {
    id: "unionbank",
    label: "UnionBank",
    accountName: "Happy Moments Food Corporation",
    accountDetailLabel: "Current Account",
    accountDetail: "001990006659",
  },
  gcash: {
    id: "gcash",
    label: "GCash",
    accountName: "JON RO**K F.",
    accountDetailLabel: "GCash Number",
    accountDetail: "0905-745 6950",
  },
  bpi: {
    id: "bpi",
    label: "BPI",
    accountName: "John Roderick Felipe",
    accountDetailLabel: "Savings Account",
    accountDetail: "3299240028",
  },
} as const

export type PaymentChannelId = keyof typeof PAYMENT_CHANNELS

export const PAYMENT_CHANNEL_LIST = Object.values(PAYMENT_CHANNELS)

/**
 * Earliest fulfillment = next calendar day (lead = 1).
 * Some menu items (e.g. Lechon) still show a 2-day note on the item itself.
 */
export const ORDER_MIN_LEAD_DAYS = 1

export const FULFILLMENT_SLOTS = {
  slot_10_12: {
    id: "slot_10_12",
    label: "10:00–12:00",
    shortLabel: "10-12",
  },
  slot_14_16: {
    id: "slot_14_16",
    label: "14:00–16:00",
    shortLabel: "2-4",
  },
  slot_17_19: {
    id: "slot_17_19",
    label: "17:00–19:00",
    shortLabel: "5-7",
  },
} as const

export type FulfillmentSlotId = keyof typeof FULFILLMENT_SLOTS

export const FULFILLMENT_SLOT_LIST = Object.values(FULFILLMENT_SLOTS)

export const FULFILLMENT_TYPES = {
  pickup: { id: "pickup", label: "Pickup" },
  delivery: { id: "delivery", label: "Delivery" },
} as const

export type FulfillmentTypeId = keyof typeof FULFILLMENT_TYPES

export const FULFILLMENT_TYPE_LIST = Object.values(FULFILLMENT_TYPES)

export const PACKED_MEALS_CONTACT_PHONE = "0917-310-2345"
