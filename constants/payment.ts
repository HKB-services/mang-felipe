/**
 * Manual payment channels shown on checkout.
 * Public business details — not secrets.
 */

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

/** Business rule from menu: order at least two days in advance. */
export const ORDER_MIN_LEAD_DAYS = 2

export const PACKED_MEALS_CONTACT_PHONE = "0917-310-2345"
