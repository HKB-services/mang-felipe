import "server-only"

import { prisma } from "@/lib/prisma"
import { resolveObjectReadUrl } from "@/lib/storage/r2.server"

const FALLBACK_IMAGE_BY_SLUG: Record<string, string> = {
  "pansit-canton": "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "lechon-pork-belly": "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "party-bilao-b4": "https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg?auto=compress&cs=tinysrgb&w=1200",
}

const DEFAULT_FALLBACK_IMAGE = "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1200"

async function getItemImageUrl(item: { slug: string; imageKey: string | null }) {
  if (!item.imageKey) return FALLBACK_IMAGE_BY_SLUG[item.slug] ?? DEFAULT_FALLBACK_IMAGE
  try {
    return await resolveObjectReadUrl(item.imageKey)
  } catch {
    return FALLBACK_IMAGE_BY_SLUG[item.slug] ?? DEFAULT_FALLBACK_IMAGE
  }
}

export async function getOrderMenu() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      sortOrder: true,
      items: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          notes: true,
          code: true,
          imageKey: true,
          variants: {
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
            select: {
              id: true,
              label: true,
              portionLabel: true,
              pricePhp: true,
            },
          },
        },
      },
    },
  })
  return Promise.all(categories.map(async (category) => ({
    ...category,
    items: await Promise.all(category.items.map(async (item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      notes: item.notes,
      code: item.code,
      imageUrl: await getItemImageUrl(item),
      variants: item.variants,
    }))),
  })))
}

export async function getOrderProduct(slug: string) {
  const item = await prisma.menuItem.findFirst({
    where: { slug, isActive: true, category: { isActive: true } },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      notes: true,
      code: true,
      imageKey: true,
      category: { select: { name: true, slug: true } },
      variants: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: { id: true, label: true, portionLabel: true, pricePhp: true },
      },
    },
  })
  if (!item) return null
  return { ...item, imageUrl: await getItemImageUrl(item) }
}

export type OrderMenu = Awaited<ReturnType<typeof getOrderMenu>>
export type OrderProduct = Awaited<ReturnType<typeof getOrderProduct>>
