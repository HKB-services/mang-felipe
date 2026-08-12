"use client"

import Link from "next/link"
import { IconShoppingBag, IconTrash } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { QuantityControl } from "@/features/orders/components/QuantityControl"
import { useOrderCart } from "@/features/orders/hooks/use-order-cart"
import { useCartSheet } from "@/features/orders/hooks/use-cart-sheet"
import { formatPhp } from "@/features/orders/utils/format"
import { ROUTES } from "@/constants"

export function CartSummary({ compact = false, onCheckout }: { compact?: boolean; onCheckout?: () => void }) {
  const { items, count, subtotalPhp, setQuantity, remove } = useOrderCart()
  const { close: closeCartSheet } = useCartSheet()
  if (!items.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-12 text-center">
        <IconShoppingBag className="size-9 text-[#b44c35]" />
        <p className="text-sm text-muted-foreground">Your cart is empty. Add meals from menu to start order.</p>
        {compact ? (
          <Button
            render={<Link href={ROUTES.ORDER} onClick={closeCartSheet} />}
            nativeButton={false}
          >
            Browse menu
          </Button>
        ) : null}
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {count} {count === 1 ? "item" : "items"} in your spread
      </p>
      <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
        {items.map((line) => (
          <div key={line.id} className="flex gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-[#103d2d]">{line.itemName}</p>
              <p className="text-xs text-muted-foreground">
                {line.label} · {line.portionLabel}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#b44c35]">
                {formatPhp(line.pricePhp * line.quantity)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove ${line.itemName}`}
                onClick={() => remove(line.id)}
              >
                <IconTrash className="size-4" />
              </Button>
              <QuantityControl
                quantity={line.quantity}
                onChange={(quantity) => setQuantity(line.id, quantity)}
              />
            </div>
          </div>
        ))}
      </div>
      <Separator />
      <div className="flex items-center justify-between text-base font-semibold text-[#103d2d]">
        <span>Food subtotal</span>
        <span>{formatPhp(subtotalPhp)}</span>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">
        Delivery fee not included. Prices subject to change.
      </p>
      {!compact ? (
        <Button
          className="w-full"
          onClick={() => {
            closeCartSheet()
            onCheckout?.()
          }}
        >
          Continue to checkout
        </Button>
      ) : (
        <Button
          className="w-full"
          render={<Link href={ROUTES.ORDER_CHECKOUT} onClick={closeCartSheet} />}
          nativeButton={false}
        >
          Review order
        </Button>
      )}
    </div>
  )
}
