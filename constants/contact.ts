/**
 * Public shop contact — footer, packed meals, History.
 * Not secrets.
 */

export const SHOP_CONTACT = {
  email: "mangfelipekitchen@gmail.com",
  /** Orders / Viber — same as primary phone */
  viberDisplay: "Viber +63 0917 310 2345",
  viberTel: "639173102345",
  phones: [
    {
      id: "primary",
      display: "0917 310 2345",
      /** Digits only for `tel:` links */
      tel: "09173102345",
    },
    {
      id: "secondary",
      display: "0998 302 4209",
      tel: "09983024209",
    },
  ],
} as const

export type ShopPhoneId = (typeof SHOP_CONTACT.phones)[number]["id"]

/** Primary line — also used for packed-meals callouts. */
export const SHOP_PRIMARY_PHONE = SHOP_CONTACT.phones[0]

/** @deprecated Prefer SHOP_PRIMARY_PHONE / SHOP_CONTACT — kept for seed + older refs */
export const PACKED_MEALS_CONTACT_PHONE = SHOP_PRIMARY_PHONE.display
