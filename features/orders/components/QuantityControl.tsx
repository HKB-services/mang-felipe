"use client"

import { IconMinus, IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export function QuantityControl({
  quantity,
  onChange,
}: {
  quantity: number
  onChange: (quantity: number) => void
}) {
  return (
    <div className="inline-flex min-h-11 items-center rounded-lg border border-emerald-950/15 bg-white" aria-label="Quantity controls">
      <Button variant="ghost" size="icon" aria-label="Decrease quantity" onClick={() => onChange(quantity - 1)}>
        <IconMinus className="size-4" />
      </Button>
      <span className="min-w-8 text-center text-sm font-semibold tabular-nums">{quantity}</span>
      <Button variant="ghost" size="icon" aria-label="Increase quantity" onClick={() => onChange(quantity + 1)} disabled={quantity >= 99}>
        <IconPlus className="size-4" />
      </Button>
    </div>
  )
}
