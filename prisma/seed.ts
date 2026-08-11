/**
 * Seed Happy Moments menu (structure from June 15, 2026 price list).
 *
 * Default prices are ₱1–10 test amounts — Fiuu has no sandbox, so live
 * gateway checks must stay cheap. Catalog (real) pesos stay in the MENU
 * literals for reference; set `SEED_REAL_PRICES=true` to seed those instead.
 *
 * Run: `bun run db:seed` (loads `.env.development` via prisma.config when
 * using migrate seed, or pass `PRISMA_ENV_FILE=.env.development`).
 */
import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { config as loadEnv } from "dotenv"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import { PACKED_MEALS_CONTACT_PHONE } from "../constants/payment"

for (const file of [
  process.env.PRISMA_ENV_FILE,
  ".env",
  ".env.local",
  ".env.development",
]) {
  if (!file) continue
  const path = resolve(process.cwd(), file)
  if (existsSync(path)) {
    loadEnv({ path, override: false })
    if (process.env.DATABASE_URL) break
  }
}

type VariantSeed = {
  sizeKey: string
  label: string
  portionLabel: string
  pricePhp: number
  sortOrder: number
}

type ItemSeed = {
  name: string
  slug: string
  code?: string
  description?: string
  notes?: string
  sortOrder: number
  isFeatured?: boolean
  variants: VariantSeed[]
}

type CategorySeed = {
  name: string
  slug: string
  description?: string
  sortOrder: number
  items: ItemSeed[]
}

/** Fiuu live-test band (₱1–10). */
const TEST_PRICE_BY_SIZE: Record<string, number> = {
  family: 2,
  fiesta: 5,
  super: 8,
  unit: 1,
}

const useRealPrices = process.env.SEED_REAL_PRICES === "true"

function resolveSeedPrice(sizeKey: string, catalogPricePhp: number): number {
  if (useRealPrices) return catalogPricePhp
  const base = TEST_PRICE_BY_SIZE[sizeKey] ?? 1
  // Slight variety inside 1–10 from catalog digits, still cheap for Fiuu.
  const bump = catalogPricePhp % 3
  return Math.min(10, Math.max(1, base + bump))
}

function v(
  sizeKey: string,
  label: string,
  portionLabel: string,
  catalogPricePhp: number,
  sortOrder: number
): VariantSeed {
  return {
    sizeKey,
    label,
    portionLabel,
    pricePhp: resolveSeedPrice(sizeKey, catalogPricePhp),
    sortOrder,
  }
}

const family = (portion: string, catalogPricePhp: number) =>
  v("family", "Family", portion, catalogPricePhp, 1)
const fiesta = (portion: string, catalogPricePhp: number) =>
  v("fiesta", "Fiesta", portion, catalogPricePhp, 2)
const superSize = (portion: string, catalogPricePhp: number) =>
  v("super", "Super", portion, catalogPricePhp, 3)
const unit = (portion: string, catalogPricePhp: number) =>
  v("unit", "Per meal", portion, catalogPricePhp, 1)

const PANSIT_PORTIONS = {
  family: "Up to 8 pax",
  fiesta: "Up to 15 pax",
  super: "Up to 25 pax",
} as const

const SEAFOOD_PORTIONS = {
  fiesta: "Up to 10 pax",
  super: "Up to 15 pax",
} as const

const ROLL_PORTIONS = {
  family: "20 rolls",
  fiesta: "35 rolls",
  super: "50 rolls",
} as const

const MENU: CategorySeed[] = [
  {
    name: "Pansit",
    slug: "pansit",
    sortOrder: 1,
    items: [
      {
        name: "Pansit Pusit",
        slug: "pansit-pusit",
        sortOrder: 1,
        variants: [
          family(PANSIT_PORTIONS.family, 1300),
          fiesta(PANSIT_PORTIONS.fiesta, 1650),
          superSize(PANSIT_PORTIONS.super, 2475),
        ],
      },
      {
        name: "Pansit Canton",
        slug: "pansit-canton",
        sortOrder: 2,
        isFeatured: true,
        variants: [
          family(PANSIT_PORTIONS.family, 900),
          fiesta(PANSIT_PORTIONS.fiesta, 1100),
          superSize(PANSIT_PORTIONS.super, 1650),
        ],
      },
      {
        name: "Pansit Bihon",
        slug: "pansit-bihon",
        sortOrder: 3,
        variants: [
          family(PANSIT_PORTIONS.family, 900),
          fiesta(PANSIT_PORTIONS.fiesta, 1100),
          superSize(PANSIT_PORTIONS.super, 1650),
        ],
      },
      {
        name: "Pansit Canton-Bihon",
        slug: "pansit-canton-bihon",
        sortOrder: 4,
        variants: [
          family(PANSIT_PORTIONS.family, 950),
          fiesta(PANSIT_PORTIONS.fiesta, 1150),
          superSize(PANSIT_PORTIONS.super, 1725),
        ],
      },
      {
        name: "Pansit Palabok",
        slug: "pansit-palabok",
        sortOrder: 5,
        variants: [
          family(PANSIT_PORTIONS.family, 1100),
          fiesta(PANSIT_PORTIONS.fiesta, 1300),
          superSize(PANSIT_PORTIONS.super, 1950),
        ],
      },
    ],
  },
  {
    name: "Pork, Chicken, Beef",
    slug: "pork-chicken-beef",
    sortOrder: 2,
    items: [
      {
        name: "Lechon Pork Belly",
        slug: "lechon-pork-belly",
        sortOrder: 1,
        isFeatured: true,
        notes: "Place your order at least two days in advance.",
        variants: [
          fiesta("Up to 12 pax / 2.5 Kilos", 2450),
          superSize("Up to 20 pax / 4 Kilos", 3675),
        ],
      },
      {
        name: "Pork BBQ",
        slug: "pork-bbq",
        sortOrder: 2,
        variants: [
          fiesta("30 sticks", 1650),
          superSize("50 sticks", 2750),
        ],
      },
      {
        name: "Pork Binagoongan",
        slug: "pork-binagoongan",
        sortOrder: 3,
        variants: [
          fiesta("Up to 10 pax", 1380),
          superSize("Up to 15 pax", 2250),
        ],
      },
      {
        name: "Baked Lemon Chicken",
        slug: "baked-lemon-chicken",
        sortOrder: 4,
        variants: [
          fiesta("Up to 10 pax", 1650),
          superSize("Up to 15 pax", 2475),
        ],
      },
      {
        name: "Kare-kare Beef + Ox Tripe",
        slug: "kare-kare-beef-ox-tripe",
        sortOrder: 5,
        variants: [
          fiesta("Up to 10 pax", 1850),
          superSize("Up to 15 pax", 2750),
        ],
      },
    ],
  },
  {
    name: "Seafood / Fish",
    slug: "seafood-fish",
    sortOrder: 3,
    items: [
      {
        name: "Garlic Butter Shrimp",
        slug: "garlic-butter-shrimp",
        sortOrder: 1,
        variants: [
          fiesta(SEAFOOD_PORTIONS.fiesta, 1750),
          superSize(SEAFOOD_PORTIONS.super, 2625),
        ],
      },
      {
        name: "Calamares",
        slug: "calamares",
        sortOrder: 2,
        variants: [
          fiesta(SEAFOOD_PORTIONS.fiesta, 1450),
          superSize(SEAFOOD_PORTIONS.super, 2175),
        ],
      },
      {
        name: "Baked Tahong with Cheese",
        slug: "baked-tahong-with-cheese",
        sortOrder: 3,
        variants: [
          fiesta(SEAFOOD_PORTIONS.fiesta, 1450),
          superSize(SEAFOOD_PORTIONS.super, 2175),
        ],
      },
      {
        name: "Relyenong Bangus",
        slug: "relyenong-bangus",
        sortOrder: 4,
        variants: [
          fiesta(SEAFOOD_PORTIONS.fiesta, 1550),
          superSize(SEAFOOD_PORTIONS.super, 2200),
        ],
      },
    ],
  },
  {
    name: "Vegetables",
    slug: "vegetables",
    sortOrder: 4,
    items: [
      {
        name: "Buttered Mixed Vegetables",
        slug: "buttered-mixed-vegetables",
        sortOrder: 1,
        variants: [
          fiesta("Up to 10 pax", 950),
          superSize("Up to 15 pax", 1375),
        ],
      },
    ],
  },
  {
    name: "Lumpia",
    slug: "lumpia",
    sortOrder: 5,
    items: [
      {
        name: "Pork Shanghai Lumpia",
        slug: "pork-shanghai-lumpia",
        sortOrder: 1,
        variants: [
          family(ROLL_PORTIONS.family, 680),
          fiesta(ROLL_PORTIONS.fiesta, 1155),
          superSize(ROLL_PORTIONS.super, 1590),
        ],
      },
      {
        name: "Yummy Veggie Lumpia",
        slug: "yummy-veggie-lumpia",
        sortOrder: 2,
        variants: [
          family(ROLL_PORTIONS.family, 700),
          fiesta(ROLL_PORTIONS.fiesta, 1190),
          superSize(ROLL_PORTIONS.super, 1650),
        ],
      },
      {
        name: "Double Cheese Lumpia",
        slug: "double-cheese-lumpia",
        sortOrder: 3,
        variants: [
          family(ROLL_PORTIONS.family, 680),
          fiesta(ROLL_PORTIONS.fiesta, 1155),
          superSize(ROLL_PORTIONS.super, 1590),
        ],
      },
    ],
  },
  {
    name: "Dynamite",
    slug: "dynamite",
    sortOrder: 6,
    items: [
      {
        name: "Cheese Melt Dynamite",
        slug: "cheese-melt-dynamite",
        sortOrder: 1,
        variants: [
          family(ROLL_PORTIONS.family, 690),
          fiesta(ROLL_PORTIONS.fiesta, 1190),
          superSize(ROLL_PORTIONS.super, 1650),
        ],
      },
    ],
  },
  {
    name: "Turon",
    slug: "turon",
    sortOrder: 7,
    items: [
      {
        name: "Senyorita Banana Turon",
        slug: "senyorita-banana-turon",
        sortOrder: 1,
        variants: [
          family(ROLL_PORTIONS.family, 450),
          fiesta(ROLL_PORTIONS.fiesta, 770),
          superSize(ROLL_PORTIONS.super, 1050),
        ],
      },
      {
        name: "Ube Baby & Cheese Turon",
        slug: "ube-baby-cheese-turon",
        sortOrder: 2,
        variants: [
          family(ROLL_PORTIONS.family, 690),
          fiesta(ROLL_PORTIONS.fiesta, 1190),
          superSize(ROLL_PORTIONS.super, 1650),
        ],
      },
    ],
  },
  {
    name: "Minatamis",
    slug: "minatamis",
    sortOrder: 8,
    items: [
      {
        name: "Ginataang Bilo-bilo",
        slug: "ginataang-bilo-bilo",
        sortOrder: 1,
        variants: [
          fiesta("Up to 10 pax", 1250),
          superSize("Up to 15 pax", 1700),
        ],
      },
      {
        name: "Biko with Latik",
        slug: "biko-with-latik",
        sortOrder: 2,
        variants: [
          fiesta("Up to 10 pax", 995),
          superSize("Up to 15 pax", 1450),
        ],
      },
    ],
  },
  {
    name: "Rice",
    slug: "rice",
    sortOrder: 9,
    items: [
      {
        name: "Steamed White Rice",
        slug: "steamed-white-rice",
        sortOrder: 1,
        variants: [
          fiesta("Up to 15 pax", 525),
          superSize("Up to 25 pax", 785),
        ],
      },
      {
        name: "Java Rice",
        slug: "java-rice",
        sortOrder: 2,
        variants: [
          fiesta("Up to 15 pax", 750),
          superSize("Up to 25 pax", 1125),
        ],
      },
    ],
  },
  {
    name: "Halo-Halo Bilao",
    slug: "halo-halo-bilao",
    description: "Fiesta = 20 rolls of each item. Super = 30 rolls of each item.",
    sortOrder: 10,
    items: [
      {
        name: "Combination 1",
        slug: "halo-halo-bilao-b1",
        code: "B1",
        description: "Pork Shanghai, Cheese Melt Dynamite",
        sortOrder: 1,
        variants: [
          fiesta("20 rolls of each", 1370),
          superSize("30 rolls of each", 1950),
        ],
      },
      {
        name: "Combination 2",
        slug: "halo-halo-bilao-b2",
        code: "B2",
        description: "Pork Shanghai, Ube Baby & Cheese Turon",
        sortOrder: 2,
        variants: [
          fiesta("20 rolls of each", 1370),
          superSize("30 rolls of each", 1950),
        ],
      },
      {
        name: "Combination 3",
        slug: "halo-halo-bilao-b3",
        code: "B3",
        description:
          "Pork Shanghai, Cheese Melt Dynamite, Ube Baby & Cheese Turon",
        sortOrder: 3,
        variants: [
          fiesta("20 rolls of each", 1895),
          superSize("30 rolls of each", 2950),
        ],
      },
    ],
  },
  {
    name: "Party Bilao",
    slug: "party-bilao",
    sortOrder: 11,
    items: [
      {
        name: "Party Pack",
        slug: "party-bilao-b4",
        code: "B4",
        description: "Pansit Bihon, Pinoy Spaghetti, Cheesy Puto, Fried Chicken",
        sortOrder: 1,
        isFeatured: true,
        variants: [
          fiesta("Up to 12 pax", 1950),
          superSize("Up to 20 pax", 2950),
        ],
      },
    ],
  },
  {
    name: "Packed Meals",
    slug: "packed-meals",
    description: `Orderable packed meals. For special menu details call/message ${PACKED_MEALS_CONTACT_PHONE}.`,
    sortOrder: 12,
    items: [
      {
        name: "Packed Meal",
        slug: "packed-meal",
        description: "Prices start at ₱120 per meal. Confirm menu with shop.",
        notes: `Call/message ${PACKED_MEALS_CONTACT_PHONE} for packed meal menu options.`,
        sortOrder: 1,
        variants: [unit("1 meal", 120)],
      },
    ],
  },
]

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set")
  }

  const pool = new Pool({ connectionString })
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

  try {
    for (const category of MENU) {
      const upsertedCategory = await prisma.category.upsert({
        where: { slug: category.slug },
        create: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          sortOrder: category.sortOrder,
          isActive: true,
        },
        update: {
          name: category.name,
          description: category.description,
          sortOrder: category.sortOrder,
          isActive: true,
        },
      })

      for (const item of category.items) {
        const upsertedItem = await prisma.menuItem.upsert({
          where: { slug: item.slug },
          create: {
            categoryId: upsertedCategory.id,
            name: item.name,
            slug: item.slug,
            code: item.code,
            description: item.description,
            notes: item.notes,
            sortOrder: item.sortOrder,
            isActive: true,
            isFeatured: item.isFeatured ?? false,
          },
          update: {
            categoryId: upsertedCategory.id,
            name: item.name,
            code: item.code,
            description: item.description,
            notes: item.notes,
            sortOrder: item.sortOrder,
            isActive: true,
            ...(item.isFeatured ? { isFeatured: true } : {}),
          },
        })

        for (const variant of item.variants) {
          await prisma.menuItemVariant.upsert({
            where: {
              menuItemId_sizeKey: {
                menuItemId: upsertedItem.id,
                sizeKey: variant.sizeKey,
              },
            },
            create: {
              menuItemId: upsertedItem.id,
              sizeKey: variant.sizeKey,
              label: variant.label,
              portionLabel: variant.portionLabel,
              pricePhp: variant.pricePhp,
              sortOrder: variant.sortOrder,
              isActive: true,
            },
            update: {
              label: variant.label,
              portionLabel: variant.portionLabel,
              pricePhp: variant.pricePhp,
              sortOrder: variant.sortOrder,
              isActive: true,
            },
          })
        }
      }
    }

    console.log(
      `Seeded ${MENU.length} categories with menu items (${
        useRealPrices ? "catalog (real) prices" : "Fiuu test prices ₱1–10"
      }).`
    )
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
