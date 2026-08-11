import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"
import { CheckoutForm } from "@/features/orders/components/CheckoutForm"

export default function CheckoutPage() {
  return <div className="mf-canvas min-h-[70vh]"><div className="mx-auto max-w-3xl px-4 py-8 sm:px-6"><Link href="/order" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#103d2d] underline-offset-4 hover:underline"><IconArrowLeft className="size-4" />Continue shopping</Link><section className="mt-5 rounded-2xl border border-emerald-950/10 bg-white p-5 shadow-sm sm:p-8"><p className="text-xs font-semibold tracking-[0.16em] text-[#b44c35] uppercase">Checkout</p><h1 className="mt-2 text-3xl font-semibold text-[#103d2d]">Confirm your order</h1><p className="mt-3 leading-6 text-muted-foreground">Your payment proof is required and your order is reviewed by Mang Felipe team.</p><div className="mt-8"><CheckoutForm /></div></section></div></div>
}
