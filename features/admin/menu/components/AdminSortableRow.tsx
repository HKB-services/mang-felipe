"use client"

import type { ReactNode } from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { IconGripVertical } from "@tabler/icons-react"
import { TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

/**
 * Split in two: DndContext renders a hidden a11y <div> as a direct child of
 * wherever it's mounted, so it must wrap the whole <Table> (not sit inside
 * <tbody>, which can't legally contain a <div>). SortableContext renders no
 * DOM of its own, so it's safe to nest directly inside <tbody>.
 */
export function AdminDndProvider({
  ids,
  onReorder,
  children,
}: {
  ids: string[]
  onReorder: (ids: string[]) => void
  children: ReactNode
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const oldIndex = ids.indexOf(String(active.id))
    const newIndex = ids.indexOf(String(over.id))
    if (oldIndex === -1 || newIndex === -1) return
    onReorder(arrayMove(ids, oldIndex, newIndex))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      {children}
    </DndContext>
  )
}

export function AdminSortableGroup({ ids, children }: { ids: string[]; children: ReactNode }) {
  return (
    <SortableContext items={ids} strategy={verticalListSortingStrategy}>
      {children}
    </SortableContext>
  )
}

export type AdminSortableHandle = {
  attributes: ReturnType<typeof useSortable>["attributes"]
  listeners: ReturnType<typeof useSortable>["listeners"]
}

export function AdminSortableRow({
  id,
  className,
  children,
}: {
  id: string
  className?: string
  children: (handle: AdminSortableHandle) => ReactNode
}) {
  const { setNodeRef, transform, transition, attributes, listeners, isDragging } = useSortable({ id })

  return (
    <TableRow
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(isDragging && "relative z-10 bg-muted/60 shadow-md", className)}
    >
      {children({ attributes, listeners })}
    </TableRow>
  )
}

export function AdminDragHandle({
  attributes,
  listeners,
  label,
}: AdminSortableHandle & { label: string }) {
  return (
    <button
      type="button"
      className="flex size-7 touch-none items-center justify-center rounded-md text-muted-foreground/60 hover:bg-muted hover:text-foreground active:cursor-grabbing"
      aria-label={`Reorder ${label}`}
      {...attributes}
      {...listeners}
    >
      <IconGripVertical className="size-4" aria-hidden />
    </button>
  )
}
