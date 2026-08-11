"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { MenuCategorySummary } from "../server/admin-get-menu-hub"

type AdminCategoryDialogProps = {
  category?: MenuCategorySummary
  defaultSortOrder: number
  open: boolean
  onOpenChange: (open: boolean) => void
  isSaving: boolean
  onSave: (values: { name: string; description: string | null; sortOrder: number }) => void
}

export function AdminCategoryDialog({
  category,
  defaultSortOrder,
  open,
  onOpenChange,
  isSaving,
  onSave,
}: AdminCategoryDialogProps) {
  const [name, setName] = useState(category?.name ?? "")
  const [description, setDescription] = useState(category?.description ?? "")
  const [sortOrder, setSortOrder] = useState(String(category?.sortOrder ?? defaultSortOrder))

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSave({
      name: name.trim(),
      description: description.trim() || null,
      sortOrder: Number(sortOrder),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Edit category" : "Add category"}</DialogTitle>
          <DialogDescription>
            {category
              ? "Update how this group appears in the guest menu."
              : "Create a group for related dishes in the guest menu."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium">
            Name
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Party trays"
              autoFocus
              required
              maxLength={80}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Description <span className="font-normal text-muted-foreground">(optional)</span>
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="A short guest-facing description"
              maxLength={280}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Sort order
            <Input
              type="number"
              min="0"
              step="1"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              required
            />
          </label>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {category ? "Save changes" : "Create category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
