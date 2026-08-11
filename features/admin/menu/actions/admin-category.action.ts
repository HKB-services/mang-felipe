"use server"

import { ROLES } from "@/features/admin/users/schema/user.schema"
import { ActionError, authActionClient } from "@/lib/safe.action"
import {
  CreateCategorySchema,
  DeleteCategorySchema,
  ReorderSchema,
  UpdateCategorySchema,
  UpsertMenuItemSchema,
  DeleteMenuItemSchema,
  UpsertVariantSchema,
  DeleteVariantSchema,
  CreateMenuImageUploadSchema,
} from "../schema/admin-category.schema"
import {
  createCategory,
  deleteCategory,
  updateCategory,
  getCategoryDetail,
  getMenuItemDetail,
  reorderCategories,
  reorderMenuItems,
  reorderVariants,
} from "../server/admin-category.server"
import { prisma } from "@/lib/prisma"
import { buildObjectKey, createPresignedUploadUrl } from "@/lib/storage/r2.server"

function assertSuperAdmin(roles: string[] | undefined) {
  if (!roles?.includes(ROLES.SUPER_ADMIN)) throw new ActionError("Forbidden")
}

export const createCategoryAction = authActionClient
  .metadata({ actionName: "createCategory" })
  .inputSchema(CreateCategorySchema)
  .action(async ({ ctx, parsedInput }) => {
    assertSuperAdmin(ctx.session?.user.roles)
    await createCategory(parsedInput)
    return { success: true as const }
  })

export const updateCategoryAction = authActionClient
  .metadata({ actionName: "updateCategory" })
  .inputSchema(UpdateCategorySchema)
  .action(async ({ ctx, parsedInput }) => {
    assertSuperAdmin(ctx.session?.user.roles)
    await updateCategory(parsedInput)
    return { success: true as const }
  })

export const reorderCategoriesAction = authActionClient
  .metadata({ actionName: "reorderCategories" })
  .inputSchema(ReorderSchema)
  .action(async ({ ctx, parsedInput }) => {
    assertSuperAdmin(ctx.session?.user.roles)
    await reorderCategories(parsedInput.ids)
    return { success: true as const }
  })

export const reorderMenuItemsAction = authActionClient
  .metadata({ actionName: "reorderMenuItems" })
  .inputSchema(ReorderSchema)
  .action(async ({ ctx, parsedInput }) => {
    assertSuperAdmin(ctx.session?.user.roles)
    await reorderMenuItems(parsedInput.ids)
    return { success: true as const }
  })

export const reorderVariantsAction = authActionClient
  .metadata({ actionName: "reorderVariants" })
  .inputSchema(ReorderSchema)
  .action(async ({ ctx, parsedInput }) => {
    assertSuperAdmin(ctx.session?.user.roles)
    await reorderVariants(parsedInput.ids)
    return { success: true as const }
  })

export const deleteCategoryAction = authActionClient
  .metadata({ actionName: "deleteCategory" })
  .inputSchema(DeleteCategorySchema)
  .action(async ({ ctx, parsedInput }) => {
    assertSuperAdmin(ctx.session?.user.roles)
    await deleteCategory(parsedInput.id)
    return { success: true as const }
  })

export const getCategoryDetailAction = authActionClient
  .metadata({ actionName: "getCategoryDetail" })
  .inputSchema(DeleteCategorySchema)
  .action(async ({ ctx, parsedInput }) => {
    assertSuperAdmin(ctx.session?.user.roles)
    const category = await getCategoryDetail(parsedInput.id)
    if (!category) throw new ActionError("Category not found")
    return { success: true as const, category }
  })

export const getMenuItemDetailAction = authActionClient
  .metadata({ actionName: "getMenuItemDetail" })
  .inputSchema(DeleteCategorySchema)
  .action(async ({ ctx, parsedInput }) => {
    assertSuperAdmin(ctx.session?.user.roles)
    const item = await getMenuItemDetail(parsedInput.id)
    if (!item) throw new ActionError("Dish not found")
    return { success: true as const, item }
  })

export const upsertMenuItemAction = authActionClient.metadata({ actionName: "upsertMenuItem" }).inputSchema(UpsertMenuItemSchema).action(async ({ ctx, parsedInput }) => {
  assertSuperAdmin(ctx.session?.user.roles)
  const slug = parsedInput.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
  if (!slug) throw new ActionError("Use a dish name with letters or numbers")
  const data = { categoryId: parsedInput.categoryId, name: parsedInput.name, slug, description: parsedInput.description || null, notes: parsedInput.notes || null, code: parsedInput.code || null, imageKey: parsedInput.imageKey || null, sortOrder: parsedInput.sortOrder, isActive: parsedInput.isActive, isFeatured: parsedInput.isFeatured }
  try {
    const item = parsedInput.id
      ? await prisma.menuItem.update({ where: { id: parsedInput.id }, data, select: { id: true } })
      : await prisma.menuItem.create({ data, select: { id: true } })
    return { success: true as const, id: item.id }
  } catch { throw new ActionError("A dish with this name already exists") }
})

export const deleteMenuItemAction = authActionClient.metadata({ actionName: "deleteMenuItem" }).inputSchema(DeleteMenuItemSchema).action(async ({ ctx, parsedInput }) => {
  assertSuperAdmin(ctx.session?.user.roles)
  await prisma.menuItem.delete({ where: { id: parsedInput.id } })
  return { success: true as const }
})

export const upsertVariantAction = authActionClient.metadata({ actionName: "upsertVariant" }).inputSchema(UpsertVariantSchema).action(async ({ ctx, parsedInput }) => {
  assertSuperAdmin(ctx.session?.user.roles)
  const data = { menuItemId: parsedInput.menuItemId, sizeKey: parsedInput.sizeKey, label: parsedInput.label, portionLabel: parsedInput.portionLabel, pricePhp: parsedInput.pricePhp, sortOrder: parsedInput.sortOrder, isActive: parsedInput.isActive }
  if (parsedInput.id) await prisma.menuItemVariant.update({ where: { id: parsedInput.id }, data })
  else await prisma.menuItemVariant.create({ data })
  return { success: true as const }
})

export const deleteVariantAction = authActionClient.metadata({ actionName: "deleteVariant" }).inputSchema(DeleteVariantSchema).action(async ({ ctx, parsedInput }) => {
  assertSuperAdmin(ctx.session?.user.roles)
  await prisma.menuItemVariant.delete({ where: { id: parsedInput.id } })
  return { success: true as const }
})

export const createMenuImageUploadAction = authActionClient.metadata({ actionName: "createMenuImageUpload" }).inputSchema(CreateMenuImageUploadSchema).action(async ({ ctx, parsedInput }) => {
  assertSuperAdmin(ctx.session?.user.roles)
  const userId = ctx.session?.user.id
  if (!userId) throw new ActionError("Unauthorized")
  const key = buildObjectKey({ folder: "menu", userId, extension: parsedInput.extension })
  const intent = await createPresignedUploadUrl({ key, contentType: parsedInput.contentType, contentLength: parsedInput.contentLength })
  return { success: true as const, ...intent }
})
