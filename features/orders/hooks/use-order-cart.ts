"use client"

import { useAtom } from "jotai"
import { orderCartAtom } from "@/features/orders/atom/order-cart.atom"
import type { OrderMenuItem, OrderMenuVariant } from "@/features/orders/types"

const clampQuantity = (quantity: number) => Math.min(99, Math.max(1, quantity))

export function useOrderCart() {
  const [items, setItems] = useAtom(orderCartAtom)

  const add = (menuItem: OrderMenuItem, variant: OrderMenuVariant) => {
    setItems((current) => {
      const existing = current.find((line) => line.id === variant.id)
      if (existing) {
        return current.map((line) =>
          line.id === variant.id
            ? { ...line, quantity: clampQuantity(line.quantity + 1) }
            : line
        )
      }
      return [...current, { ...variant, menuItemId: menuItem.id, itemName: menuItem.name, quantity: 1 }]
    })
  }

  const setQuantity = (variantId: string, quantity: number) => {
    setItems((current) =>
      quantity < 1
        ? current.filter((line) => line.id !== variantId)
        : current.map((line) =>
            line.id === variantId ? { ...line, quantity: clampQuantity(quantity) } : line
          )
    )
  }

  const remove = (variantId: string) => setItems((current) => current.filter((line) => line.id !== variantId))
  const clear = () => setItems([])
  const subtotalPhp = items.reduce((total, line) => total + line.pricePhp * line.quantity, 0)
  const count = items.reduce((total, line) => total + line.quantity, 0)

  return { items, add, setQuantity, remove, clear, subtotalPhp, count }
}
