"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { MenuCategorySummary } from "../server/admin-get-menu-hub"

type AdminCategoryDeleteDialogProps = {
  category: MenuCategorySummary | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isDeleting: boolean
  onDelete: () => void
}

export function AdminCategoryDeleteDialog({
  category,
  open,
  onOpenChange,
  isDeleting,
  onDelete,
}: AdminCategoryDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete category?</DialogTitle>
          <DialogDescription>
            {category?.itemCount
              ? `“${category.name}” has ${category.itemCount} dish${category.itemCount === 1 ? "" : "es"}. Hide it instead to keep its dishes and order history.`
              : `“${category?.name ?? "This category"}” has no dishes and will be permanently deleted.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            isLoading={isDeleting}
            disabled={Boolean(category?.itemCount)}
            onClick={onDelete}
          >
            Delete category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
