"use client"

import Image from "next/image"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { IconArrowLeft, IconAlertTriangle } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductDetailClient } from "@/features/orders/components/ProductDetailClient"
import { getOrderProductAction } from "@/features/orders/actions/get-order-product.action"

async function fetchOrderProduct(slug: string) {
  const result = await getOrderProductAction({ slug })
  if (result.data?.success) return result.data.product
  throw new Error(result.serverError ?? "Could not load this dish")
}

export default function ProductPage({ slug }: { slug: string }) {
  const productQuery = useQuery({
    queryKey: ["orders", "product", slug],
    queryFn: () => fetchOrderProduct(slug),
    retry: 1,
  })

  if (productQuery.isLoading) return <ProductSkeleton />

  if (productQuery.isError) {
    return <div className="mf-canvas min-h-[70vh]"><div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"><Card className="border-dashed bg-white py-12 text-center"><CardHeader><CardTitle>Could not load this dish</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Something went wrong while fetching this dish.</p><Button variant="outline" className="mt-5" onClick={() => void productQuery.refetch()}>Try again</Button></CardContent></Card></div></div>
  }

  const product = productQuery.data
  if (!product || product.variants.length === 0) {
    return <div className="mf-canvas min-h-[70vh]"><div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"><Card className="border-dashed bg-white py-12 text-center"><CardHeader><CardTitle>Dish not found</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">This dish may have been removed or is no longer available.</p><Button variant="outline" className="mt-5" render={<Link href="/order" />} nativeButton={false}>Back to menu</Button></CardContent></Card></div></div>
  }

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

function ProductSkeleton() {
  return <div className="mf-canvas min-h-[70vh]"><div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"><Skeleton className="h-5 w-32" /><div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:items-start"><Skeleton className="aspect-[4/3] w-full rounded-2xl" /><div className="rounded-2xl border border-emerald-950/10 bg-white p-6 shadow-sm sm:p-8"><div className="flex gap-2"><Skeleton className="h-5 w-20" /><Skeleton className="h-5 w-16" /></div><Skeleton className="mt-4 h-9 w-3/4" /><Skeleton className="mt-4 h-4 w-full" /><Skeleton className="mt-2 h-4 w-2/3" /><div className="mt-7 space-y-3"><Skeleton className="h-4 w-28" /><Skeleton className="h-16 w-full rounded-xl" /><Skeleton className="h-16 w-full rounded-xl" /></div><Skeleton className="mt-6 h-12 w-full rounded-xl" /></div></div></div></div>
}
