import { prisma } from "@/lib/prisma"

export type MenuCategorySummary = {
  id: string
  name: string
  description: string | null
  sortOrder: number
  isActive: boolean
  itemCount: number
  activeItemCount: number
}

export async function getMenuHub() {
  const [categories, activeItemCount, inactiveItemCount] = await Promise.all([
    prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        description: true,
        sortOrder: true,
        isActive: true,
        _count: { select: { items: true } },
        items: {
          where: { isActive: true },
          select: { id: true },
        },
      },
    }),
    prisma.menuItem.count({ where: { isActive: true } }),
    prisma.menuItem.count({ where: { isActive: false } }),
  ])

  return {
    activeItemCount,
    inactiveItemCount,
    categories: categories.map(
      (category): MenuCategorySummary => ({
        id: category.id,
        name: category.name,
        description: category.description,
        sortOrder: category.sortOrder,
        isActive: category.isActive,
        itemCount: category._count.items,
        activeItemCount: category.items.length,
      })
    ),
  }
}
