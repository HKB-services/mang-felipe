import { z } from "zod"

const categoryFields = {
  name: z.string().trim().min(1, "Category name is required").max(80),
  description: z.string().trim().max(280).nullable(),
  sortOrder: z.coerce.number().int().min(0).optional(),
}

export const CreateCategorySchema = z.object(categoryFields)

export const UpdateCategorySchema = z.object({
  id: z.string().min(1),
  ...categoryFields,
  isActive: z.boolean(),
})

export const DeleteCategorySchema = z.object({ id: z.string().min(1) })

export const ReorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
})

export const UpsertMenuItemSchema = z.object({
  id: z.string().min(1).optional(),
  categoryId: z.string().min(1),
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).nullable(),
  notes: z.string().trim().max(500).nullable(),
  code: z.string().trim().max(32).nullable(),
  imageKey: z.string().trim().max(500).nullable(),
  sortOrder: z.coerce.number().int().min(0),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
})

export const DeleteMenuItemSchema = z.object({ id: z.string().min(1) })

export const UpsertVariantSchema = z.object({
  id: z.string().min(1).optional(),
  menuItemId: z.string().min(1),
  sizeKey: z.string().trim().min(1).max(32),
  label: z.string().trim().min(1).max(80),
  portionLabel: z.string().trim().min(1).max(120),
  pricePhp: z.coerce.number().int().min(0),
  sortOrder: z.coerce.number().int().min(0),
  isActive: z.boolean(),
})

export const DeleteVariantSchema = z.object({ id: z.string().min(1) })

export const CreateMenuImageUploadSchema = z.object({
  contentType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
  contentLength: z.number().int().positive().max(5 * 1024 * 1024),
  extension: z.string().min(1).max(10),
})

export type CategoryFormValues = z.infer<typeof CreateCategorySchema>
