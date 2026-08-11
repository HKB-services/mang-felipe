/**
 * Sister brands under Happy Moments Food Corporation.
 * Mang Felipe remains the primary app brand (`APP_DETAILS`).
 * Public marketing only — not secrets.
 */

export const SISTER_BRANDS = {
  "rak-en-rolls": {
    id: "rak-en-rolls",
    name: "Rak en Rolls",
    tagline: "Lumpia, Turon & More",
    description:
      "Crispy homemade rolls and pastries — the perfect side dish or merienda treat.",
    address: {
      line1: "7353 Maria Clara Street, La Huerta",
      city: "Parañaque City",
      region: "Parañaque, Philippines",
      postalCode: "1700",
      full: "7353 Maria Clara Street, La Huerta, Parañaque City, Parañaque, Philippines, 1700",
    },
    phone: {
      display: "0995 017 6288",
      tel: "09950176288",
    },
    email: "rakenrollsph@gmail.com",
    social: {
      instagram: {
        handle: "rakenrollsph",
        url: "https://www.instagram.com/rakenrollsph/",
      },
    },
    assets: {
      logo: "/logo/rak%20en%20rolls.jpg",
      banner: "/branding/rak-en-rolls-banner.jpg",
    },
    /** UI accent hint from brand mark */
    accent: "red",
  },
  "oh-my-bilao": {
    id: "oh-my-bilao",
    name: "Oh My Bilao!",
    tagline: "Party Bilao Specialists",
    description:
      "Generous bilao trays for any occasion — from intimate gatherings to large celebrations.",
    address: {
      line1: "6827 JP Rizal St. La Huerta",
      city: "Parañaque",
      region: "Parañaque, Philippines",
      postalCode: "1700",
      full: "6827 JP Rizal St. La Huerta, Parañaque, Philippines, 1700",
    },
    phone: {
      display: "0998 302 4209",
      tel: "09983024209",
    },
    email: "mangfelipekitchen@gmail.com",
    social: null,
    assets: {
      logo: "/logo/oh-my-bilao.jpg",
      banner: "/branding/oh-my-bilao-banner.png",
    },
    accent: "coral",
  },
} as const

export type SisterBrandId = keyof typeof SISTER_BRANDS

export const SISTER_BRAND_LIST = Object.values(SISTER_BRANDS)

/** Combined strip for Home / History / footer “Our brands”. */
export const BRAND_FAMILY = {
  parent: "Happy Moments Food Corporation",
  primary: {
    id: "mang-felipe",
    name: "Mang Felipe",
    role: "primary" as const,
    assets: {
      logo: "/logo/mang-felipe.jpg",
      banner: "/branding/mang-felipe-banner.jpg",
      logosStrip: "/branding/brand-logos.png",
    },
  },
  sisters: SISTER_BRAND_LIST,
} as const
