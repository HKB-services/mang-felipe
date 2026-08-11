"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  IconChevronRight,
  IconDots,
  IconMenu2,
  IconPencil,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconToolsKitchen2,
} from "@tabler/icons-react"
import { sileo } from "sileo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getMenuHubAction } from "../actions/admin-get-menu-hub.action"
import {
  createCategoryAction,
  deleteCategoryAction,
  reorderCategoriesAction,
  updateCategoryAction,
} from "../actions/admin-category.action"
import { AdminCategoryDeleteDialog } from "../components/AdminCategoryDeleteDialog"
import { AdminCategoryDialog } from "../components/AdminCategoryDialog"
import { AdminDndProvider, AdminDragHandle, AdminSortableGroup, AdminSortableRow, type AdminSortableHandle } from "../components/AdminSortableRow"
import type { MenuCategorySummary } from "../server/admin-get-menu-hub"

const MENU_HUB_QUERY_KEY = ["admin", "menu-hub"]

async function fetchMenuHub() {
  const result = await getMenuHubAction()
  if (result.data?.success) return result.data.menu
  throw new Error(result.serverError ?? "Could not load menu")
}

type MenuHubData = Awaited<ReturnType<typeof fetchMenuHub>>

const AdminManageMenu = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [editor, setEditor] = useState<MenuCategorySummary | null | undefined>(undefined)
  const [deleteTarget, setDeleteTarget] = useState<MenuCategorySummary | null>(null)
  const [search, setSearch] = useState("")
  const menuQuery = useQuery({
    queryKey: MENU_HUB_QUERY_KEY,
    queryFn: fetchMenuHub,
    retry: 1,
  })

  const refreshMenu = async () => {
    await queryClient.invalidateQueries({ queryKey: MENU_HUB_QUERY_KEY })
  }
  const openCategory = (categoryId: string) => router.push(`/admin/menu/categories/${categoryId}`)

  const createMutation = useMutation({
    mutationFn: async (input: { name: string; description: string | null; sortOrder: number }) => {
      const result = await createCategoryAction(input)
      if (!result.data?.success) throw new Error(result.serverError ?? "Could not create category")
    },
    onSuccess: async () => {
      await refreshMenu()
      setEditor(undefined)
      sileo.success({ title: "Category created" })
    },
    onError: (error) => sileo.error({ title: error.message }),
  })
  const updateMutation = useMutation({
    mutationFn: async (input: {
      id: string
      name: string
      description: string | null
      sortOrder: number
      isActive: boolean
    }) => {
      const result = await updateCategoryAction(input)
      if (!result.data?.success) throw new Error(result.serverError ?? "Could not update category")
    },
    onSuccess: async () => {
      await refreshMenu()
      setEditor(undefined)
      sileo.success({ title: "Category updated" })
    },
    onError: (error) => sileo.error({ title: error.message }),
  })
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteCategoryAction({ id })
      if (!result.data?.success) throw new Error(result.serverError ?? "Could not delete category")
    },
    onSuccess: async () => {
      await refreshMenu()
      setDeleteTarget(null)
      sileo.success({ title: "Category deleted" })
    },
    onError: (error) => sileo.error({ title: error.message }),
  })
  const reorderMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const result = await reorderCategoriesAction({ ids })
      if (!result.data?.success) throw new Error(result.serverError ?? "Could not reorder categories")
    },
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: MENU_HUB_QUERY_KEY })
      const previous = queryClient.getQueryData<MenuHubData>(MENU_HUB_QUERY_KEY)
      queryClient.setQueryData<MenuHubData>(MENU_HUB_QUERY_KEY, (old) => {
        if (!old) return old
        const byId = new Map(old.categories.map((category) => [category.id, category]))
        const categories = ids.flatMap((id, index) => {
          const category = byId.get(id)
          return category ? [{ ...category, sortOrder: index }] : []
        })
        return { ...old, categories }
      })
      return { previous }
    },
    onError: (error, _ids, context) => {
      if (context?.previous) queryClient.setQueryData(MENU_HUB_QUERY_KEY, context.previous)
      sileo.error({ title: error.message })
    },
    onSettled: refreshMenu,
  })

  if (menuQuery.isLoading) return <MenuHubSkeleton />
  if (menuQuery.isError || !menuQuery.data) {
    return <MenuHubError onRetry={() => void menuQuery.refetch()} />
  }

  const menu = menuQuery.data
  const normalizedSearch = search.trim().toLocaleLowerCase()
  const isFiltered = normalizedSearch.length > 0
  const visibleCategories = isFiltered
    ? menu.categories.filter((category) =>
      [category.name, category.description ?? ""].some((value) =>
        value.toLocaleLowerCase().includes(normalizedSearch)
      )
    )
    : menu.categories

  const rows = visibleCategories.map((category) => (
    <CategoryRow
      key={category.id}
      category={category}
      draggable={!isFiltered}
      onOpen={() => openCategory(category.id)}
      onEdit={() => setEditor(category)}
      onToggle={() => updateMutation.mutate({
        id: category.id,
        name: category.name,
        description: category.description,
        sortOrder: category.sortOrder,
        isActive: !category.isActive,
      })}
      onDelete={() => setDeleteTarget(category)}
    />
  ))

  return (
    <section className="flex w-full flex-col gap-6 py-1 sm:gap-8 sm:py-3">
      <div>
        <Badge variant="secondary">Menu</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Manage menu</h1>
        <p className="mt-2 text-muted-foreground">
          Keep categories and dishes available for guest orders. No inventory tracking.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <MenuMetric
          label="Available dishes"
          value={menu.activeItemCount}
          description="Visible to guests"
          icon={IconToolsKitchen2}
        />
        <MenuMetric
          label="Hidden dishes"
          value={menu.inactiveItemCount}
          description="Not currently orderable"
          icon={IconMenu2}
        />
      </div>

      <Card className="py-0 shadow-none">
        <CardHeader className="border-b py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Categories</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Drag to reorder how categories appear on the guest menu.
              </p>
            </div>
            <Button onClick={() => setEditor(null)}>
              <IconPlus className="size-4" aria-hidden />
              Add category
            </Button>
          </div>
          <div className="relative mt-4">
            <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search categories"
              className="pl-9"
              aria-label="Search categories"
            />
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {visibleCategories.length ? (
            <AdminDndProvider
              ids={visibleCategories.map((category) => category.id)}
              onReorder={(ids) => reorderMutation.mutate(ids)}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-9 pl-5" />
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Available dishes</TableHead>
                    <TableHead className="w-12 pr-5"><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isFiltered ? (
                    rows
                  ) : (
                    <AdminSortableGroup ids={visibleCategories.map((category) => category.id)}>
                      {rows}
                    </AdminSortableGroup>
                  )}
                </TableBody>
              </Table>
            </AdminDndProvider>
          ) : menu.categories.length ? (
            <div className="px-6 py-14 text-center">
              <p className="font-medium">No matching categories</p>
              <p className="mt-1 text-sm text-muted-foreground">Try a different name or description.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <IconMenu2 className="size-5 text-muted-foreground" aria-hidden />
              </div>
              <div>
                <p className="font-medium">No menu categories yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Start by adding your first category.</p>
              </div>
              <Button onClick={() => setEditor(null)}><IconPlus className="size-4" aria-hidden />Add category</Button>
            </div>
          )}
        </CardContent>
      </Card>
      {editor !== undefined ? (
        <AdminCategoryDialog
          key={editor?.id ?? "new"}
          category={editor ?? undefined}
          defaultSortOrder={(menu.categories.at(-1)?.sortOrder ?? -1) + 1}
          open
          onOpenChange={(open) => !open && setEditor(undefined)}
          isSaving={createMutation.isPending || updateMutation.isPending}
          onSave={(values) => {
            if (editor) {
              updateMutation.mutate({ ...values, id: editor.id, isActive: editor.isActive })
              return
            }
            createMutation.mutate(values)
          }}
        />
      ) : null}
      <AdminCategoryDeleteDialog
        category={deleteTarget}
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        isDeleting={deleteMutation.isPending}
        onDelete={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </section>
  )
}

function CategoryRow({
  category,
  draggable,
  onOpen,
  onEdit,
  onToggle,
  onDelete,
}: {
  category: MenuCategorySummary
  draggable: boolean
  onOpen: () => void
  onEdit: () => void
  onToggle: () => void
  onDelete: () => void
}) {
  const content = (handle?: AdminSortableHandle) => (
    <>
      <TableCell className="pl-5">
        {handle ? <AdminDragHandle {...handle} label={category.name} /> : null}
      </TableCell>
      <TableCell
        className="cursor-pointer"
        onClick={onOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => event.key === "Enter" && onOpen()}
      >
        <p className="font-medium">{category.name}</p>
        {category.description ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {category.description}
          </p>
        ) : null}
      </TableCell>
      <TableCell>
        <Badge variant={category.isActive ? "default" : "secondary"}>
          {category.isActive ? "Active" : "Hidden"}
        </Badge>
      </TableCell>
      <TableCell>{category.activeItemCount} of {category.itemCount}</TableCell>
      <TableCell className="pr-5 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button size="icon-sm" variant="ghost" onClick={onOpen} aria-label={`Open ${category.name}`}>
            <IconChevronRight className="size-4" aria-hidden />
          </Button>
          <CategoryActions category={category} onEdit={onEdit} onToggle={onToggle} onDelete={onDelete} />
        </div>
      </TableCell>
    </>
  )

  if (!draggable) {
    return <TableRow>{content()}</TableRow>
  }

  return (
    <AdminSortableRow id={category.id}>
      {(handle) => content(handle)}
    </AdminSortableRow>
  )
}

function CategoryActions({
  category,
  onEdit,
  onToggle,
  onDelete,
}: {
  category: MenuCategorySummary
  onEdit: () => void
  onToggle: () => void
  onDelete: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`Manage ${category.name}`} />}>
        <IconDots className="size-4" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={onEdit}><IconPencil />Edit category</DropdownMenuItem>
        <DropdownMenuItem onClick={onToggle}>{category.isActive ? "Hide category" : "Show category"}</DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={onDelete}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MenuMetric({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string
  value: number
  description: string
  icon: typeof IconMenu2
}) {
  return (
    <Card className="py-0 shadow-none">
      <CardContent className="flex items-start justify-between py-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
          <p className="mt-2 text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden />
        </div>
      </CardContent>
    </Card>
  )
}

function MenuHubSkeleton() {
  return (
    <section className="flex w-full flex-col gap-6 py-1 sm:gap-8 sm:py-3">
      <div className="space-y-3">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {["available", "hidden"].map((key) => (
          <Card key={key} className="h-36 py-0 shadow-none">
            <CardContent className="flex h-full items-start justify-between py-5">
              <div className="space-y-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-9 w-14" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="size-10" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="py-0 shadow-none">
        <CardContent className="space-y-4 py-5">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    </section>
  )
}

function MenuHubError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="py-0 shadow-none">
      <CardContent className="flex flex-col items-start gap-4 py-12">
        <div>
          <h1 className="font-semibold">Menu unavailable</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Menu data could not be loaded. Try again.
          </p>
        </div>
        <Button variant="outline" onClick={onRetry}>
          <IconRefresh className="size-4" aria-hidden />
          Retry
        </Button>
      </CardContent>
    </Card>
  )
}

export default AdminManageMenu
