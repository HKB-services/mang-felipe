"use client"

import Link from "next/link"
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  IconArrowLeft,
  IconLoader2,
  IconPencil,
  IconPhoto,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react"
import { sileo } from "sileo"
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { formatPhp } from "@/features/orders/utils/format"
import {
  createMenuImageUploadAction,
  deleteVariantAction,
  getMenuItemDetailAction,
  reorderVariantsAction,
  upsertMenuItemAction,
  upsertVariantAction,
} from "../actions/admin-category.action"
import { AdminDndProvider, AdminDragHandle, AdminSortableGroup, AdminSortableRow, type AdminSortableHandle } from "../components/AdminSortableRow"

type Variant = {
  id: string
  sizeKey: string
  label: string
  portionLabel: string
  pricePhp: number
  sortOrder: number
  isActive: boolean
}
type ItemDetail = {
  id: string
  name: string
  description: string | null
  notes: string | null
  code: string | null
  imageKey: string | null
  imageUrl: string | null
  sortOrder: number
  isActive: boolean
  isFeatured: boolean
  category: { id: string; name: string }
  variants: Variant[]
}

function itemQueryKey(itemId: string) {
  return ["admin", "menu-item", itemId]
}

async function fetchItem(itemId: string) {
  const result = await getMenuItemDetailAction({ id: itemId })
  if (!result.data?.success) throw new Error(result.serverError ?? "Could not load dish")
  return result.data.item as ItemDetail
}

export default function AdminItemDetail({ itemId }: { itemId: string }) {
  const queryClient = useQueryClient()
  const [editingVariant, setEditingVariant] = useState<Variant | null | undefined>(undefined)
  const query = useQuery({ queryKey: itemQueryKey(itemId), queryFn: () => fetchItem(itemId) })
  const refresh = () => queryClient.invalidateQueries({ queryKey: itemQueryKey(itemId) })

  const reorderMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const result = await reorderVariantsAction({ ids })
      if (!result.data?.success) throw new Error(result.serverError ?? "Could not reorder portions")
    },
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: itemQueryKey(itemId) })
      const previous = queryClient.getQueryData<ItemDetail>(itemQueryKey(itemId))
      queryClient.setQueryData<ItemDetail>(itemQueryKey(itemId), (old) => {
        if (!old) return old
        const byId = new Map(old.variants.map((variant) => [variant.id, variant]))
        const variants = ids.flatMap((id, index) => {
          const variant = byId.get(id)
          return variant ? [{ ...variant, sortOrder: index }] : []
        })
        return { ...old, variants }
      })
      return { previous }
    },
    onError: (error, _ids, context) => {
      if (context?.previous) queryClient.setQueryData(itemQueryKey(itemId), context.previous)
      sileo.error({ title: error.message })
    },
    onSettled: refresh,
  })

  const deleteVariantMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteVariantAction({ id })
      if (!result.data?.success) throw new Error(result.serverError ?? "Could not delete portion")
    },
    onSuccess: async () => {
      await refresh()
      sileo.success({ title: "Portion deleted" })
    },
    onError: (error) => sileo.error({ title: error.message }),
  })

  const saveVariantMutation = useMutation({
    mutationFn: async (input: Omit<Variant, "id" | "sortOrder"> & { id?: string }) => {
      const nextSortOrder = (query.data?.variants.at(-1)?.sortOrder ?? -1) + 1
      const result = await upsertVariantAction({ ...input, menuItemId: itemId, sortOrder: input.id ? editingVariant?.sortOrder ?? nextSortOrder : nextSortOrder })
      if (!result.data?.success) throw new Error(result.serverError ?? "Could not save portion")
    },
    onSuccess: async () => {
      await refresh()
      setEditingVariant(undefined)
      sileo.success({ title: "Portion saved" })
    },
    onError: (error) => sileo.error({ title: error.message }),
  })

  if (query.isLoading) return <ItemDetailSkeleton />
  if (query.isError || !query.data) return <p className="text-destructive">Could not load this dish.</p>
  const item = query.data

  return (
    <section className="flex w-full flex-col gap-6 py-1 sm:gap-8 sm:py-3">
      <div>
        <Link href={`/admin/menu/categories/${item.category.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
          <IconArrowLeft className="size-4" aria-hidden />
          Back to {item.category.name}
        </Link>
        <div className="mt-4">
          <Badge variant="secondary">Dish</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{item.name}</h1>
          <p className="mt-2 text-muted-foreground">Edit details, image, and portion sizes.</p>
        </div>
      </div>

      <DishDetailsForm itemId={itemId} item={item} categoryId={item.category.id} onSaved={refresh} />

      <Card className="py-0 shadow-none">
        <CardHeader className="border-b py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Portion sizes</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Guests pick one of these when they order this dish.
              </p>
            </div>
            <Button onClick={() => setEditingVariant(null)}>
              <IconPlus className="size-4" aria-hidden />
              Add portion
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {item.variants.length ? (
            <AdminDndProvider
              ids={item.variants.map((variant) => variant.id)}
              onReorder={(ids) => reorderMutation.mutate(ids)}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-9 pl-5" />
                    <TableHead>Portion</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-20 pr-5"><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AdminSortableGroup ids={item.variants.map((variant) => variant.id)}>
                    {item.variants.map((variant) => (
                      <VariantRow
                        key={variant.id}
                        variant={variant}
                        onEdit={() => setEditingVariant(variant)}
                        onDelete={() => deleteVariantMutation.mutate(variant.id)}
                        isDeleting={deleteVariantMutation.isPending && deleteVariantMutation.variables === variant.id}
                      />
                    ))}
                  </AdminSortableGroup>
                </TableBody>
              </Table>
            </AdminDndProvider>
          ) : (
            <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
              <div>
                <p className="font-medium">No portion sizes yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Guests can&apos;t order this dish until it has at least one.</p>
              </div>
              <Button onClick={() => setEditingVariant(null)}><IconPlus className="size-4" aria-hidden />Add portion</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {editingVariant !== undefined ? (
        <VariantDialog
          key={editingVariant?.id ?? "new"}
          variant={editingVariant ?? undefined}
          isSaving={saveVariantMutation.isPending}
          onOpenChange={(open) => !open && setEditingVariant(undefined)}
          onSave={(values) => saveVariantMutation.mutate({ ...values, id: editingVariant?.id })}
        />
      ) : null}
    </section>
  )
}

function DishDetailsForm({
  itemId,
  item,
  categoryId,
  onSaved,
}: {
  itemId: string
  item: ItemDetail
  categoryId: string
  onSaved: () => Promise<void>
}) {
  const [form, setForm] = useState({
    name: item.name,
    description: item.description ?? "",
    notes: item.notes ?? "",
    code: item.code ?? "",
    imageKey: item.imageKey ?? "",
    isActive: item.isActive,
    isFeatured: item.isFeatured,
  })
  const [imageName, setImageName] = useState<string | null>(item.imageKey?.split("/").at(-1) ?? null)
  const [imagePreview, setImagePreview] = useState<string | null>(item.imageUrl)
  const [uploading, setUploading] = useState(false)

  const saveMutation = useMutation({
    mutationFn: async () => {
      const result = await upsertMenuItemAction({
        id: itemId,
        categoryId,
        name: form.name,
        description: form.description || null,
        notes: form.notes || null,
        code: form.code || null,
        imageKey: form.imageKey || null,
        sortOrder: item.sortOrder,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
      })
      if (!result.data?.success) throw new Error(result.serverError ?? "Could not save dish")
    },
    onSuccess: async () => {
      await onSaved()
      sileo.success({ title: "Dish saved" })
    },
    onError: (error) => sileo.error({ title: error.message }),
  })

  const uploadImage = async (file: File | undefined) => {
    if (!file) return
    if (!(["image/jpeg", "image/png", "image/webp", "image/gif"] as string[]).includes(file.type) || file.size > 5 * 1024 * 1024) {
      sileo.error({ title: "Use a JPEG, PNG, WebP, or GIF up to 5 MB" })
      return
    }
    setUploading(true)
    try {
      const result = await createMenuImageUploadAction({
        contentType: file.type as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
        contentLength: file.size,
        extension: file.name.split(".").at(-1) ?? "image",
      })
      if (!result.data?.success) throw new Error(result.serverError ?? "Could not start upload")
      const response = await fetch(result.data.uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } })
      if (!response.ok) throw new Error("Image upload failed")
      setForm((prev) => ({ ...prev, imageKey: result.data.key }))
      setImageName(file.name)
      setImagePreview((previous) => {
        if (previous?.startsWith("blob:")) URL.revokeObjectURL(previous)
        return URL.createObjectURL(file)
      })
    } catch (error) {
      sileo.error({ title: error instanceof Error ? error.message : "Image upload failed" })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="py-0 shadow-none">
      <CardHeader className="border-b py-5">
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent className="py-5">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            saveMutation.mutate()
          }}
          className="grid gap-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Name
              <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required maxLength={120} />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Code <span className="font-normal text-muted-foreground">(optional, kitchen/POS reference)</span>
              <Input value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} maxLength={32} />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-medium">
            Description <span className="font-normal text-muted-foreground">(guest-facing)</span>
            <Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} maxLength={500} />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Notes <span className="font-normal text-muted-foreground">(internal, staff-only)</span>
            <Textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} maxLength={500} />
          </label>
          <div className="grid gap-2 text-sm font-medium">
            Image
            <Input id="dish-image" className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => void uploadImage(event.target.files?.[0])} />
            <Attachment state={uploading ? "uploading" : imageName ? "done" : "idle"} className="w-full">
              <AttachmentMedia variant={imagePreview && !uploading ? "image" : "icon"}>
                {uploading ? (
                  <IconLoader2 className="animate-spin" aria-hidden />
                ) : imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element -- small preview of a presigned R2 URL, not worth the image optimizer
                  <img src={imagePreview} alt="" />
                ) : (
                  <IconPhoto aria-hidden />
                )}
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>{imageName ?? "Upload image"}</AttachmentTitle>
                <AttachmentDescription>JPEG, PNG, WebP, or GIF · max 5 MB</AttachmentDescription>
              </AttachmentContent>
              <label htmlFor="dish-image" className="absolute inset-0 z-10 cursor-pointer" />
            </Attachment>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Checkbox id="dish-active" checked={form.isActive} onCheckedChange={(checked) => setForm({ ...form, isActive: checked === true })} />
              <Label htmlFor="dish-active" className="font-normal">Visible to guests</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="dish-featured" checked={form.isFeatured} onCheckedChange={(checked) => setForm({ ...form, isFeatured: checked === true })} />
              <Label htmlFor="dish-featured" className="font-normal">Featured on Home</Label>
            </div>
          </div>
          <div className="flex justify-end border-t pt-5">
            <Button type="submit" disabled={uploading} isLoading={saveMutation.isPending}>Save changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function VariantRow({
  variant,
  onEdit,
  onDelete,
  isDeleting,
}: {
  variant: Variant
  onEdit: () => void
  onDelete: () => void
  isDeleting: boolean
}) {
  return (
    <AdminSortableRow id={variant.id}>
      {(handle: AdminSortableHandle) => (
        <>
          <TableCell className="pl-5">
            <AdminDragHandle {...handle} label={variant.label} />
          </TableCell>
          <TableCell>
            <p className="font-medium">{variant.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">{variant.portionLabel}</p>
          </TableCell>
          <TableCell className="tabular-nums">{formatPhp(variant.pricePhp)}</TableCell>
          <TableCell>
            <Badge variant={variant.isActive ? "default" : "secondary"}>{variant.isActive ? "Active" : "Hidden"}</Badge>
          </TableCell>
          <TableCell className="pr-5 text-right">
            <div className="flex items-center justify-end gap-1">
              <Button size="icon-sm" variant="ghost" onClick={onEdit} aria-label={`Edit ${variant.label}`}>
                <IconPencil className="size-4" aria-hidden />
              </Button>
              <Button size="icon-sm" variant="ghost" onClick={onDelete} isLoading={isDeleting} aria-label={`Delete ${variant.label}`}>
                <IconTrash className="size-4 text-destructive" aria-hidden />
              </Button>
            </div>
          </TableCell>
        </>
      )}
    </AdminSortableRow>
  )
}

function VariantDialog({
  variant,
  isSaving,
  onOpenChange,
  onSave,
}: {
  variant?: Variant
  isSaving: boolean
  onOpenChange: (open: boolean) => void
  onSave: (values: { sizeKey: string; label: string; portionLabel: string; pricePhp: number; isActive: boolean }) => void
}) {
  const [form, setForm] = useState({
    sizeKey: variant?.sizeKey ?? "",
    label: variant?.label ?? "",
    portionLabel: variant?.portionLabel ?? "",
    pricePhp: String(variant?.pricePhp ?? ""),
    isActive: variant?.isActive ?? true,
  })

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{variant ? "Edit portion" : "Add portion"}</DialogTitle>
          <DialogDescription>Set the size, label, and price guests see at checkout.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            onSave({
              sizeKey: form.sizeKey.trim(),
              label: form.label.trim(),
              portionLabel: form.portionLabel.trim(),
              pricePhp: Number(form.pricePhp),
              isActive: form.isActive,
            })
          }}
          className="grid gap-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Size key <span className="font-normal text-muted-foreground">(e.g. small)</span>
              <Input value={form.sizeKey} onChange={(event) => setForm({ ...form, sizeKey: event.target.value })} required maxLength={32} autoFocus />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Label <span className="font-normal text-muted-foreground">(e.g. Small tray)</span>
              <Input value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} required maxLength={80} />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-medium">
            Portion <span className="font-normal text-muted-foreground">(e.g. Good for 5-6 pax)</span>
            <Input value={form.portionLabel} onChange={(event) => setForm({ ...form, portionLabel: event.target.value })} required maxLength={120} />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Price (PHP)
            <Input type="number" min="0" step="1" value={form.pricePhp} onChange={(event) => setForm({ ...form, pricePhp: event.target.value })} required />
          </label>
          <div className="flex items-center gap-2">
            <Checkbox id="variant-active" checked={form.isActive} onCheckedChange={(checked) => setForm({ ...form, isActive: checked === true })} />
            <Label htmlFor="variant-active" className="font-normal">Visible to guests</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSaving}>{variant ? "Save changes" : "Add portion"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function ItemDetailSkeleton() {
  return (
    <section className="flex w-full flex-col gap-6 py-1 sm:gap-8 sm:py-3">
      <div className="space-y-3">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-80" />
      </div>
      <Card className="py-0 shadow-none">
        <CardContent className="space-y-4 py-5">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    </section>
  )
}
