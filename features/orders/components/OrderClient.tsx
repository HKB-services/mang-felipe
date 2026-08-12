"use client"

import { useDeferredValue, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { IconChevronDown, IconFilter, IconSearch, IconX } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { MenuItemCard } from "@/features/orders/components/MenuItemCard"
import { getOrderMenuAction } from "@/features/orders/actions/get-order-menu.action"
import type { OrderMenuCategory } from "@/features/orders/types"

const ORDER_MENU_QUERY_KEY = ["orders", "menu"]
const EMPTY_MENU: OrderMenuCategory[] = []

async function fetchOrderMenu() {
  const result = await getOrderMenuAction()
  if (result.data?.success) return result.data.menu
  throw new Error(result.serverError ?? "Could not load menu")
}

const PRICE_FILTERS = [
  { id: "all", label: "Any price", matches: () => true },
  { id: "under-1000", label: "Under ₱1,000", matches: (price: number) => price < 1000 },
  { id: "1000-2000", label: "₱1,000–₱1,999", matches: (price: number) => price >= 1000 && price < 2000 },
  { id: "2000-plus", label: "₱2,000 and above", matches: (price: number) => price >= 2000 },
] as const

const SORT_OPTIONS = [
  { id: "featured", label: "Recommended" },
  { id: "price-low", label: "Price: low to high" },
  { id: "price-high", label: "Price: high to low" },
  { id: "name", label: "Name: A–Z" },
] as const

type PriceFilterId = (typeof PRICE_FILTERS)[number]["id"]
type SortId = (typeof SORT_OPTIONS)[number]["id"]

export function OrderClient() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [priceFilter, setPriceFilter] = useState<PriceFilterId>("all")
  const [sort, setSort] = useState<SortId>("featured")
  const deferredQuery = useDeferredValue(query.trim().toLowerCase())
  const menuQuery = useQuery({
    queryKey: ORDER_MENU_QUERY_KEY,
    queryFn: fetchOrderMenu,
    retry: 1,
  })
  const menu = menuQuery.data ?? EMPTY_MENU
  const categoryOptions = useMemo(() => [{ slug: "all", name: "All dishes", count: menu.reduce((total, entry) => total + entry.items.length, 0) }, ...menu.map((entry) => ({ slug: entry.slug, name: entry.name, count: entry.items.length }))], [menu])
  const selectedCategory = categoryOptions.find((entry) => entry.slug === category) ?? categoryOptions[0]
  const selectedPrice = PRICE_FILTERS.find((entry) => entry.id === priceFilter)!
  const selectedSort = SORT_OPTIONS.find((entry) => entry.id === sort)!
  const results = useMemo(() => {
    const matches = menu.flatMap((entry) => entry.items.flatMap((item) => {
      const fromPrice = item.variants[0]?.pricePhp ?? 0
      const searchText = [item.name, item.description, item.code, item.notes, entry.name].filter(Boolean).join(" ").toLowerCase()
      if ((category !== "all" && entry.slug !== category) || (deferredQuery && !searchText.includes(deferredQuery)) || !selectedPrice.matches(fromPrice)) return []
      return [{ item, categoryName: entry.name, fromPrice, categoryOrder: entry.sortOrder }]
    }))
    return matches.toSorted((left, right) => {
      if (sort === "price-low") return left.fromPrice - right.fromPrice
      if (sort === "price-high") return right.fromPrice - left.fromPrice
      if (sort === "name") return left.item.name.localeCompare(right.item.name)
      return left.categoryOrder - right.categoryOrder
    })
  }, [category, deferredQuery, menu, selectedPrice, sort])
  const hasFilters = category !== "all" || priceFilter !== "all" || Boolean(query)
  const clearFilters = () => { setQuery(""); setCategory("all"); setPriceFilter("all") }

  return <div className="mf-canvas min-h-[70vh]">
    <section className="mf-hero border-b border-emerald-950/10"><div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><p className="text-xs font-semibold tracking-[0.2em] text-[var(--mf-gold)] uppercase">Mang Felipe catering</p><h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight [font-family:var(--font-display)] sm:text-5xl">Food made for table at center.</h1><p className="mt-4 max-w-xl leading-7 text-emerald-50/80">Browse catering trays, rolls, bilao packs, and packed meals. Choose portions from each dish page.</p></div></section>
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><div className="flex flex-col gap-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold tracking-[0.16em] text-[#b44c35] uppercase">Menu catalog</p><h2 className="mt-1 text-3xl font-semibold text-[#103d2d]">Find your spread</h2></div><p className="text-sm text-muted-foreground">{results.length} {results.length === 1 ? "dish" : "dishes"}</p></div><div className="flex flex-col gap-3 rounded-2xl border border-emerald-950/10 bg-white p-4 shadow-sm"><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><div className="relative flex-1"><IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 pl-9" placeholder="Search pansit, lechon, bilao…" aria-label="Search menu" />{query ? <Button variant="ghost" size="icon-sm" className="absolute top-1/2 right-1 -translate-y-1/2" aria-label="Clear search" onClick={() => setQuery("")}><IconX className="size-4" /></Button> : null}</div><DropdownMenu><DropdownMenuTrigger render={<Button variant="outline" className="min-h-11 justify-between sm:w-56" />}><IconFilter data-icon="inline-start" />Sort: {selectedSort.label}<IconChevronDown data-icon="inline-end" /></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-56"><DropdownMenuRadioGroup value={sort} onValueChange={(value) => setSort(value as SortId)}>{SORT_OPTIONS.map((option) => <DropdownMenuRadioItem key={option.id} value={option.id}>{option.label}</DropdownMenuRadioItem>)}</DropdownMenuRadioGroup></DropdownMenuContent></DropdownMenu></div><div className="flex flex-wrap gap-2"><DropdownMenu><DropdownMenuTrigger render={<Button variant="outline" className="min-h-10" />}><span>Category: {selectedCategory.name}</span><IconChevronDown data-icon="inline-end" /></DropdownMenuTrigger><DropdownMenuContent className="w-64"><DropdownMenuRadioGroup value={category} onValueChange={setCategory}>{categoryOptions.map((option) => <DropdownMenuRadioItem key={option.slug} value={option.slug}><span className="flex flex-1 justify-between gap-3"><span>{option.name}</span><span className="text-muted-foreground">{option.count}</span></span></DropdownMenuRadioItem>)}</DropdownMenuRadioGroup></DropdownMenuContent></DropdownMenu><DropdownMenu><DropdownMenuTrigger render={<Button variant="outline" className="min-h-10" />}><span>Price: {selectedPrice.label}</span><IconChevronDown data-icon="inline-end" /></DropdownMenuTrigger><DropdownMenuContent className="w-56"><DropdownMenuRadioGroup value={priceFilter} onValueChange={(value) => setPriceFilter(value as PriceFilterId)}>{PRICE_FILTERS.map((option) => <DropdownMenuRadioItem key={option.id} value={option.id}>{option.label}</DropdownMenuRadioItem>)}</DropdownMenuRadioGroup></DropdownMenuContent></DropdownMenu></div>{hasFilters ? <div className="flex flex-wrap items-center gap-2 border-t border-emerald-950/10 pt-3"><span className="text-sm text-muted-foreground">Active filters:</span>{category !== "all" ? <Badge variant="secondary">{selectedCategory.name}</Badge> : null}{priceFilter !== "all" ? <Badge variant="secondary">{selectedPrice.label}</Badge> : null}{query ? <Badge variant="secondary">“{query}”</Badge> : null}<DropdownMenuSeparator className="w-px self-stretch" /><Button variant="ghost" size="sm" onClick={clearFilters}>Clear all</Button></div> : null}</div></div>
      {menuQuery.isLoading ? <MenuGridSkeleton /> : menuQuery.isError ? <Card className="mt-8 border-dashed bg-white py-12 text-center"><CardHeader><CardTitle>Could not load the menu</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Something went wrong while fetching dishes.</p><Button variant="outline" className="mt-5" onClick={() => void menuQuery.refetch()}>Try again</Button></CardContent></Card> : results.length ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{results.map(({ item, categoryName }) => <MenuItemCard key={item.id} item={item} categoryName={categoryName} />)}</div> : <Card className="mt-8 border-dashed bg-white py-12 text-center"><CardHeader><CardTitle>No dishes match these filters</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Try a different name, category, or price range.</p><Button variant="outline" className="mt-5" onClick={clearFilters}>Clear filters</Button></CardContent></Card>}</section>
  </div>
}

function MenuGridSkeleton() {
  return <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <Card key={index} className="h-full overflow-hidden border-emerald-950/10 bg-white py-0 shadow-sm"><Skeleton className="aspect-[4/3] w-full rounded-none" /><CardContent className="flex flex-col gap-3 p-5"><Skeleton className="h-5 w-2/3" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5" /><div className="mt-2 flex items-end justify-between gap-3 border-t border-emerald-950/10 pt-4"><Skeleton className="h-3 w-20" /><Skeleton className="h-5 w-14" /></div></CardContent></Card>)}</div>
}
