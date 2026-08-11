import Link from "next/link"
import { notFound } from "next/navigation"
import { IconCircleCheck, IconPackage, IconTruckDelivery } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ROUTES } from "@/constants"
import { getPublicOrderReceipt } from "@/features/orders/server/order-status.server"
import { formatFulfillmentDate, formatPhp } from "@/features/orders/utils/format"

const slotLabels = {
  slot_10_12: "10:00–12:00",
  slot_14_16: "14:00–16:00",
  slot_17_19: "17:00–19:00",
} as const

export default async function OrderSuccessPage({ orderNumber }: { orderNumber: string }) {
  const order = await getPublicOrderReceipt(orderNumber)
  if (!order) notFound()
  return <div className="mf-canvas min-h-[70vh] px-4 py-14 sm:px-6"><Card className="mx-auto max-w-2xl border-emerald-950/10 bg-white py-7 shadow-sm"><CardHeader className="text-center"><IconCircleCheck className="mx-auto size-12 text-emerald-700" /><p className="mt-4 text-xs font-semibold tracking-[0.18em] text-[#b44c35] uppercase">Order received</p><CardTitle className="mt-2 text-3xl text-[#103d2d]">Thank you for your order.</CardTitle><p className="mt-3 text-sm leading-6 text-muted-foreground">Payment proof received. Mang Felipe team will review your order shortly.</p></CardHeader><CardContent className="mt-4 space-y-5"><div className="rounded-xl bg-[#103d2d] p-5 text-white"><p className="text-xs tracking-[0.16em] text-[#f2bd65] uppercase">Order number</p><p className="mt-1 text-2xl font-semibold tracking-wide">{order.orderNumber}</p><p className="mt-3 text-sm text-emerald-50/75">Keep this number and your mobile number to track order.</p></div><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-emerald-950/10 p-4"><IconPackage className="size-5 text-[#b44c35]" /><p className="mt-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Food subtotal</p><p className="mt-1 text-lg font-semibold text-[#103d2d]">{formatPhp(order.subtotalPhp)}</p></div><div className="rounded-xl border border-emerald-950/10 p-4"><IconTruckDelivery className="size-5 text-[#b44c35]" /><p className="mt-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{order.fulfillmentType}</p><p className="mt-1 font-semibold text-[#103d2d]">{formatFulfillmentDate(order.fulfillmentDate)}</p><p className="text-sm text-muted-foreground">{slotLabels[order.fulfillmentSlot]}</p></div></div><p className="text-xs text-muted-foreground">Status: pending review. Delivery fee is not included in food subtotal.</p><div className="flex flex-col gap-3 sm:flex-row"><Button className="flex-1" render={<Link href={`${ROUTES.TRACK}?order=${encodeURIComponent(order.orderNumber)}`} />} nativeButton={false}>Track order</Button><Button variant="outline" className="flex-1" render={<Link href={ROUTES.ORDER} />} nativeButton={false}>Start another order</Button></div></CardContent></Card></div>
}
