import Image from "next/image"
import Link from "next/link"
import { IconArrowUpRight, IconAlertTriangle } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { OrderMenuItem } from "@/features/orders/types"
import { formatPhp } from "@/features/orders/utils/format"

export function MenuItemCard({ item, categoryName }: { item: OrderMenuItem; categoryName: string }) {
  const startingVariant = item.variants[0]
  return <Card className="group h-full border-emerald-950/10 bg-white py-0 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
    <Link href={`/order/${item.slug}`} className="flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#103d2d]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#e5eee8]"><Image src={item.imageUrl} alt={item.name} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" /><div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/35 to-transparent" /><Badge variant="secondary" className="absolute top-3 left-3 bg-white/90" style={{ color: "#103d2d" }}>{categoryName}</Badge>{item.code ? <Badge variant="outline" className="absolute top-3 right-3 border-white/60 bg-black/25 text-white">{item.code}</Badge> : null}</div>
      <CardContent className="flex flex-1 flex-col p-5"><div className="flex items-start justify-between gap-3"><h3 className="text-lg font-semibold text-[#103d2d]">{item.name}</h3><IconArrowUpRight className="mt-1 size-5 shrink-0 text-[#b44c35] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden /></div>{item.description ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{item.description}</p> : <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">Freshly prepared for your table.</p>}{item.notes ? <p className="mt-3 flex gap-1.5 text-xs leading-5 text-[#8a5a1f]"><IconAlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden />{item.notes}</p> : null}<div className="mt-auto flex items-end justify-between gap-3 border-t border-emerald-950/10 pt-4"><span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">From {startingVariant.label}</span><span className="text-lg font-semibold text-[#b44c35]">{formatPhp(startingVariant.pricePhp)}</span></div></CardContent>
    </Link>
  </Card>
}
