import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { IconArrowLeft, IconAlertTriangle } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { ProductDetailClient } from "@/features/orders/components/ProductDetailClient"
import { getOrderProduct } from "@/features/orders/server/menu.server"

export default async function ProductPage({ slug }: { slug: string }) {
  const product = await getOrderProduct(slug)
  if (!product || product.variants.length === 0) notFound()
  const item = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    notes: product.notes,
    code: product.code,
    imageUrl: product.imageUrl,
    variants: product.variants,
  }
  return <div className="mf-canvas min-h-[70vh]"><div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"><Link href="/order" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#103d2d] underline-offset-4 hover:underline"><IconArrowLeft className="size-4" />Back to menu</Link><div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:items-start"><div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#e5eee8] shadow-sm"><Image src={product.imageUrl} alt={product.name} fill priority sizes="(max-width: 1023px) 100vw, 58vw" className="object-cover" /></div><div className="rounded-2xl border border-emerald-950/10 bg-white p-6 shadow-sm sm:p-8"><div className="flex flex-wrap gap-2"><Badge variant="secondary">{product.category.name}</Badge>{product.code ? <Badge variant="outline">{product.code}</Badge> : null}</div><h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#103d2d] [font-family:var(--font-display)]">{product.name}</h1>{product.description ? <p className="mt-4 leading-7 text-muted-foreground">{product.description}</p> : null}{product.notes ? <p className="mt-5 flex gap-2 rounded-xl bg-[#fff5dc] p-3 text-sm leading-6 text-[#754d0d]"><IconAlertTriangle className="mt-1 size-4 shrink-0" aria-hidden />{product.notes}</p> : null}<ProductDetailClient item={item} /></div></div></div></div>
}
