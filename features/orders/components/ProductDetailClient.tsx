"use client"

import Link from "next/link"
import { useState } from "react"
import { IconCheck, IconShoppingBag } from "@tabler/icons-react"
import { sileo } from "sileo"
import { Button } from "@/components/ui/button"
import { useOrderCart } from "@/features/orders/hooks/use-order-cart"
import type { OrderMenuItem, OrderMenuVariant } from "@/features/orders/types"
import { formatPhp } from "@/features/orders/utils/format"
import { ROUTES } from "@/constants"

export function ProductDetailClient({ item }: { item: OrderMenuItem }) {
  const [selectedId, setSelectedId] = useState(item.variants[0]?.id)
  const { add, count } = useOrderCart()
  const selected = item.variants.find((variant) => variant.id === selectedId) as OrderMenuVariant
  const addToCart = () => {
    add(item, selected)
    sileo.success({ title: "Added to cart", description: `${item.name} · ${selected.label}` })
  }

  return <div className="mt-7 space-y-6"><div><p className="text-sm font-medium text-[#103d2d]">Choose portion</p><div className="mt-3 grid gap-3">{item.variants.map((variant) => <button key={variant.id} type="button" onClick={() => setSelectedId(variant.id)} className={`flex min-h-16 items-center justify-between rounded-xl border p-4 text-left transition ${selectedId === variant.id ? "border-[#103d2d] bg-emerald-50 ring-1 ring-[#103d2d]" : "border-emerald-950/15 bg-white hover:border-[#103d2d]/50"}`}><span><span className="block font-semibold text-[#103d2d]">{variant.label}</span><span className="mt-0.5 block text-sm text-muted-foreground">{variant.portionLabel}</span></span><span className="font-semibold text-[#b44c35]">{formatPhp(variant.pricePhp)}</span></button>)}</div></div><Button size="lg" className="w-full" onClick={addToCart}><IconShoppingBag data-icon="inline-start" />Add {selected.label} to cart · {formatPhp(selected.pricePhp)}</Button>{count ? <Link href={ROUTES.ORDER_CHECKOUT} className="flex min-h-11 items-center justify-center gap-2 text-sm font-medium text-[#103d2d] underline underline-offset-4"><IconCheck className="size-4" />{count} item{count === 1 ? "" : "s"} in cart, checkout</Link> : null}</div>
}
