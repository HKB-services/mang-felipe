import { Prisma } from "@/generated/prisma/client"
import { ActionError } from "@/lib/safe.action"
import { prisma } from "@/lib/prisma"
import { resolveObjectReadUrl } from "@/lib/storage/r2.server"
import type { CategoryFormValues, UpdateCategorySchema } from "../schema/admin-category.schema"
import type { z } from "zod"

function createSlug(name: string) {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  if (!slug) throw new ActionError("Use a category name with letters or numbers")
  return slug
}

function actionErrorForDatabase(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return new ActionError("A category with this name already exists")
  }
  return error
}

export async function createCategory(values: CategoryFormValues) {
  try {
    const nextSortOrder = values.sortOrder ?? ((await prisma.category.aggregate({
      _max: { sortOrder: true },
    }))._max.sortOrder ?? -1) + 1

    return await prisma.category.create({
      data: {
        name: values.name,
        slug: createSlug(values.name),
        description: values.description || null,
        sortOrder: nextSortOrder,
      },
    })
  } catch (error) {
    throw actionErrorForDatabase(error)
  }
}

export async function updateCategory(values: z.infer<typeof UpdateCategorySchema>) {
  try {
    return await prisma.category.update({
      where: { id: values.id },
      data: {
        name: values.name,
        slug: createSlug(values.name),
        description: values.description || null,
        sortOrder: values.sortOrder ?? 0,
        isActive: values.isActive,
      },
    })
  } catch (error) {
    throw actionErrorForDatabase(error)
  }
}

export async function reorderCategories(ids: string[]) {
  await prisma.$transaction(
    ids.map((id, index) => prisma.category.update({ where: { id }, data: { sortOrder: index } }))
  )
}

export async function reorderMenuItems(ids: string[]) {
  await prisma.$transaction(
    ids.map((id, index) => prisma.menuItem.update({ where: { id }, data: { sortOrder: index } }))
  )
}

export async function reorderVariants(ids: string[]) {
  await prisma.$transaction(
    ids.map((id, index) => prisma.menuItemVariant.update({ where: { id }, data: { sortOrder: index } }))
  )
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
    select: { _count: { select: { items: true } } },
  })
  if (!category) throw new ActionError("Category not found")
  if (category._count.items > 0) {
    throw new ActionError("Categories with dishes cannot be deleted. Hide it instead.")
  }

  await prisma.category.delete({ where: { id } })
}

export async function getCategoryDetail(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true, name: true, description: true, sortOrder: true, isActive: true,
      items: {
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: {
          id: true, name: true, description: true, notes: true, code: true, imageKey: true,
          sortOrder: true, isActive: true, isFeatured: true,
          variants: { orderBy: { sortOrder: "asc" }, select: { id: true, sizeKey: true, label: true, portionLabel: true, pricePhp: true, sortOrder: true, isActive: true } },
        },
      },
    },
  })
  if (!category) return null

  const items = await Promise.all(
    category.items.map(async (item) => ({
      ...item,
      imageUrl: item.imageKey ? await resolveObjectReadUrl(item.imageKey) : null,
    }))
  )
  return { ...category, items }
}

export async function getMenuItemDetail(id: string) {
  const item = await prisma.menuItem.findUnique({
    where: { id },
    select: {
      id: true, name: true, description: true, notes: true, code: true, imageKey: true,
      sortOrder: true, isActive: true, isFeatured: true,
      category: { select: { id: true, name: true } },
      variants: { orderBy: { sortOrder: "asc" }, select: { id: true, sizeKey: true, label: true, portionLabel: true, pricePhp: true, sortOrder: true, isActive: true } },
    },
  })
  if (!item) return null

  return { ...item, imageUrl: item.imageKey ? await resolveObjectReadUrl(item.imageKey) : null }
}
