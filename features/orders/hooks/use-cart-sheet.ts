"use client"

import { useAtom } from "jotai"
import { cartSheetOpenAtom } from "@/features/orders/atom/order-cart.atom"

export function useCartSheet() {
  const [open, setOpen] = useAtom(cartSheetOpenAtom)
  return { open, setOpen, close: () => setOpen(false) }
}
