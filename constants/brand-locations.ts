/**
 * Public brand places for Contact maps.
 * Addresses from sister-brand / kitchen copy — not secrets.
 */

import { APP_DETAILS } from "./app.details"
import { SHOP_CONTACT } from "./contact"
import { SISTER_BRANDS } from "./sister-brands"

export type BrandLocationAddress = {
  line1: string
  city: string
  region: string
  postalCode: string
  full: string
}

export type BrandLocation = {
  id: string
  name: string
  tagline: string
  description: string
  role: "primary" | "sister"
  /** Accent for UI chrome */
  accent: "forest" | "red" | "coral"
  address: BrandLocationAddress
  phone: { display: string; tel: string }
  email: string
  logo: string
  social?: { label: string; url: string } | null
}

/**
 * Mang Felipe kitchen not listed separately in owner docs yet.
 * JP Rizal matches Oh My Bilao + shared `mangfelipekitchen@gmail.com`.
 * Confirm with owner if Mang Felipe has a different pin.
 */
const MANG_FELIPE_ADDRESS: BrandLocationAddress = {
  line1: "6827 JP Rizal St. La Huerta",
  city: "Parañaque",
  region: "Parañaque, Philippines",
  postalCode: "1700",
  full: "6827 JP Rizal St. La Huerta, Parañaque, Philippines, 1700",
}

export const BRAND_LOCATIONS: BrandLocation[] = [
  {
    id: "mang-felipe",
    name: APP_DETAILS.name,
    tagline: "Main kitchen",
    description:
      "Catering orders, packed meals, and Happy Moments Food Corporation inquiries.",
    role: "primary",
    accent: "forest",
    address: MANG_FELIPE_ADDRESS,
    phone: {
      display: SHOP_CONTACT.phones[0].display,
      tel: SHOP_CONTACT.phones[0].tel,
    },
    email: SHOP_CONTACT.email,
    logo: APP_DETAILS.logo,
    social: {
      label: "Facebook",
      url: "https://www.facebook.com/MangFelipeKitchen",
    },
  },
  {
    id: SISTER_BRANDS["rak-en-rolls"].id,
    name: SISTER_BRANDS["rak-en-rolls"].name,
    tagline: SISTER_BRANDS["rak-en-rolls"].tagline,
    description: SISTER_BRANDS["rak-en-rolls"].description,
    role: "sister",
    accent: "red",
    address: SISTER_BRANDS["rak-en-rolls"].address,
    phone: SISTER_BRANDS["rak-en-rolls"].phone,
    email: SISTER_BRANDS["rak-en-rolls"].email,
    logo: SISTER_BRANDS["rak-en-rolls"].assets.logo,
    social: SISTER_BRANDS["rak-en-rolls"].social
      ? {
          label: `@${SISTER_BRANDS["rak-en-rolls"].social.instagram.handle}`,
          url: SISTER_BRANDS["rak-en-rolls"].social.instagram.url,
        }
      : null,
  },
  {
    id: SISTER_BRANDS["oh-my-bilao"].id,
    name: SISTER_BRANDS["oh-my-bilao"].name,
    tagline: SISTER_BRANDS["oh-my-bilao"].tagline,
    description: SISTER_BRANDS["oh-my-bilao"].description,
    role: "sister",
    accent: "coral",
    address: SISTER_BRANDS["oh-my-bilao"].address,
    phone: SISTER_BRANDS["oh-my-bilao"].phone,
    email: SISTER_BRANDS["oh-my-bilao"].email,
    logo: SISTER_BRANDS["oh-my-bilao"].assets.logo,
    social: null,
  },
]

export function getMapsLinks(addressFull: string) {
  const query = encodeURIComponent(addressFull)
  return {
    searchUrl: `https://www.google.com/maps/search/?api=1&query=${query}`,
    embedUrl: `https://maps.google.com/maps?q=${query}&z=16&output=embed`,
  } as const
}
