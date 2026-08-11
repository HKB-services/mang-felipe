"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { IconArrowLeft, IconChevronRight, IconPlus, IconStar, IconToolsKitchen2, IconTrash } from "@tabler/icons-react"
import { sileo } from "sileo"
import { useBreadcrumbLabels } from "@/features/sidebar/BreadcrumbLabelContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteMenuItemAction, getCategoryDetailAction, reorderMenuItemsAction, upsertMenuItemAction } from "../actions/admin-category.action"
import { AdminDndProvider, AdminDragHandle, AdminSortableGroup, AdminSortableRow, type AdminSortableHandle } from "../components/AdminSortableRow"

type Dish = {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  sortOrder: number
  isActive: boolean
  isFeatured: boolean
  variants: { id: string }[]
}
type Category = { id: string; name: string; items: Dish[] }

function categoryQueryKey(categoryId: string) {
  return ["admin", "menu-category", categoryId]
}

async function fetchCategory(categoryId: string) {
  const result = await getCategoryDetailAction({ id: categoryId })
  if (!result.data?.success) throw new Error(result.serverError ?? "Could not load category")
  return result.data.category as Category
}

export default function AdminCategoryDetail({ categoryId }: { categoryId: string }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setLabel } = useBreadcrumbLabels()
  const [adding, setAdding] = useState(false)
  const query = useQuery({ queryKey: categoryQueryKey(categoryId), queryFn: () => fetchCategory(categoryId) })

  useEffect(() => {
    if (query.data) setLabel(categoryId, query.data.name)
  }, [categoryId, query.data, setLabel])

  const refresh = () => queryClient.invalidateQueries({ queryKey: categoryQueryKey(categoryId) })
  const openDish = (dishId: string) => router.push(`/admin/menu/items/${dishId}`)

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const nextSortOrder = (query.data?.items.at(-1)?.sortOrder ?? -1) + 1
      const result = await upsertMenuItemAction({
        categoryId,
        name,
        description: null,
        notes: null,
        code: null,
        imageKey: null,
        sortOrder: nextSortOrder,
        isActive: true,
        isFeatured: false,
      })
      if (!result.data?.success) throw new Error(result.serverError ?? "Could not create dish")
      return result.data.id
    },
    onSuccess: (id) => {
      setAdding(false)
      openDish(id)
    },
    onError: (error) => sileo.error({ title: error.message }),
  })

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteMenuItemAction({ id })
      if (!result.data?.success) throw new Error(result.serverError ?? "Could not delete dish")
    },
    onSuccess: async () => {
      await refresh()
      sileo.success({ title: "Dish deleted" })
    },
    onError: (error) => sileo.error({ title: error.message }),
  })

  const reorderMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const result = await reorderMenuItemsAction({ ids })
      if (!result.data?.success) throw new Error(result.serverError ?? "Could not reorder dishes")
    },
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: categoryQueryKey(categoryId) })
      const previous = queryClient.getQueryData<Category>(categoryQueryKey(categoryId))
      queryClient.setQueryData<Category>(categoryQueryKey(categoryId), (old) => {
        if (!old) return old
        const byId = new Map(old.items.map((item) => [item.id, item]))
        const items = ids.flatMap((id, index) => {
          const item = byId.get(id)
          return item ? [{ ...item, sortOrder: index }] : []
        })
        return { ...old, items }
      })
      return { previous }
    },
    onError: (error, _ids, context) => {
      if (context?.previous) queryClient.setQueryData(categoryQueryKey(categoryId), context.previous)
      sileo.error({ title: error.message })
    },
    onSettled: refresh,
  })

  if (query.isLoading) return <CategoryDetailSkeleton />
  if (query.isError || !query.data) return <p className="text-destructive">Could not load this category.</p>
  const category = query.data

  const rows = category.items.map((dish) => (
    <DishRow
      key={dish.id}
      dish={dish}
      onOpen={() => openDish(dish.id)}
      onDelete={() => removeMutation.mutate(dish.id)}
      isDeleting={removeMutation.isPending && removeMutation.variables === dish.id}
    />
  ))

  return (
    <section className="flex w-full flex-col gap-6 py-1 sm:gap-8 sm:py-3">
      <div>
        <Link href="/admin/menu" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          <IconArrowLeft className="size-4" aria-hidden />
          Back to menu
        </Link>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <Badge variant="secondary">Category</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">{category.name}</h1>
            <p className="mt-2 text-muted-foreground">Configure the dishes guests can order.</p>
          </div>
          <Button onClick={() => setAdding(true)}>
            <IconPlus className="size-4" aria-hidden />
            Add dish
          </Button>
        </div>
      </div>

      <Card className="py-0 shadow-none">
        <CardHeader className="border-b py-5">
          <CardTitle>Dishes</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag to reorder, or open a dish to edit its details, image, and portion sizes.
          </p>
        </CardHeader>
        <CardContent className="px-0">
          {category.items.length ? (
            <AdminDndProvider
              ids={category.items.map((dish) => dish.id)}
              onReorder={(ids) => reorderMutation.mutate(ids)}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-9 pl-5" />
                    <TableHead>Dish</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Portions</TableHead>
                    <TableHead className="w-16 pr-5"><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AdminSortableGroup ids={category.items.map((dish) => dish.id)}>
                    {rows}
                  </AdminSortableGroup>
                </TableBody>
              </Table>
            </AdminDndProvider>
          ) : (
            <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <IconToolsKitchen2 className="size-5 text-muted-foreground" aria-hidden />
              </div>
              <div>
                <p className="font-medium">No dishes yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Add the first dish in this category.</p>
              </div>
              <Button onClick={() => setAdding(true)}><IconPlus className="size-4" aria-hidden />Add dish</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddDishDialog
        open={adding}
        isSaving={createMutation.isPending}
        onOpenChange={setAdding}
        onCreate={(name) => createMutation.mutate(name)}
      />
    </section>
  )
}

function DishRow({
  dish,
  onOpen,
  onDelete,
  isDeleting,
}: {
  dish: Dish
  onOpen: () => void
  onDelete: () => void
  isDeleting: boolean
}) {
  return (
    <AdminSortableRow id={dish.id}>
      {(handle: AdminSortableHandle) => (
        <>
          <TableCell className="pl-5">
            <AdminDragHandle {...handle} label={dish.name} />
          </TableCell>
          <TableCell
            className="cursor-pointer"
            onClick={onOpen}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => event.key === "Enter" && onOpen()}
          >
            <div className="flex items-center gap-3">
              <DishThumbnail imageUrl={dish.imageUrl} name={dish.name} />
              <div>
                <p className="font-medium">{dish.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{dish.description ?? "No description"}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Badge variant={dish.isActive ? "default" : "secondary"}>{dish.isActive ? "Active" : "Hidden"}</Badge>
          </TableCell>
          <TableCell>{dish.isFeatured ? <IconStar className="size-4 fill-current text-primary" aria-hidden /> : "—"}</TableCell>
          <TableCell>{dish.variants.length}</TableCell>
          <TableCell className="pr-5 text-right">
            <div className="flex items-center justify-end gap-1">
              <Button size="icon-sm" variant="ghost" onClick={onOpen} aria-label={`Open ${dish.name}`}>
                <IconChevronRight className="size-4" aria-hidden />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={onDelete}
                isLoading={isDeleting}
                aria-label={`Delete ${dish.name}`}
              >
                <IconTrash className="size-4 text-destructive" aria-hidden />
              </Button>
            </div>
          </TableCell>
        </>
      )}
    </AdminSortableRow>
  )
}

function DishThumbnail({ imageUrl, name }: { imageUrl: string | null; name: string }) {
  if (!imageUrl) {
    return (
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
        <IconToolsKitchen2 className="size-4 text-muted-foreground" aria-hidden />
      </div>
    )
  }
  return (
    <Image
      src={imageUrl}
      alt={name}
      width={40}
      height={40}
      className="size-10 shrink-0 rounded-md object-cover"
      unoptimized
    />
  )
}

function AddDishDialog({
  open,
  isSaving,
  onOpenChange,
  onCreate,
}: {
  open: boolean
  isSaving: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (name: string) => void
}) {
  const [name, setName] = useState("")

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setName("")
        onOpenChange(next)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add dish</DialogTitle>
          <DialogDescription>
            Name it now — description, image, and portion sizes come next.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (name.trim()) onCreate(name.trim())
          }}
          className="grid gap-4"
        >
          <label className="grid gap-2 text-sm font-medium">
            Name
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Chicken adobo"
              autoFocus
              required
              maxLength={120}
            />
          </label>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSaving}>Continue</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function CategoryDetailSkeleton() {
  return (
    <section className="flex w-full flex-col gap-6 py-1 sm:gap-8 sm:py-3">
      <div className="space-y-3">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-80" />
      </div>
      <Card className="py-0 shadow-none">
        <CardContent className="space-y-4 py-5">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    </section>
  )
}
