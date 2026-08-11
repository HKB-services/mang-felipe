import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/app.routes"
import { prisma } from "@/lib/prisma"
import { resolveObjectReadUrl } from "@/lib/storage/r2.server"

const formatter = new Intl.NumberFormat("en-PH")

const FALLBACK_IMAGE_BY_SLUG: Record<string, string> = {
  "pansit-canton":
    "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "lechon-pork-belly":
    "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "party-bilao-b4":
    "https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg?auto=compress&cs=tinysrgb&w=1200",
}

const DEFAULT_FALLBACK_IMAGE =
  "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1200"

const FeaturedItemsSection = async () => {
  const items = await prisma.menuItem.findMany({
    where: {
      isActive: true,
      isFeatured: true,
      variants: { some: { isActive: true } },
    },
    orderBy: { sortOrder: "asc" },
    take: 6,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      notes: true,
      imageKey: true,
      variants: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        take: 1,
        select: { label: true, pricePhp: true },
      },
    },
  })

  if (items.length === 0) return null

  const itemsWithImages = await Promise.all(
    items.map(async (item) => ({
      ...item,
      imageUrl: item.imageKey
        ? await resolveObjectReadUrl(item.imageKey)
        : (FALLBACK_IMAGE_BY_SLUG[item.slug] ?? DEFAULT_FALLBACK_IMAGE),
    }))
  )

  return (
    <section className="featured-items overflow-hidden px-4 py-20 text-[#103d2d] dark:text-white sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="featured-items-intro max-w-2xl">
          <p className="font-mono text-[0.7rem] font-medium tracking-[0.2em] text-[#8a5a1f] uppercase dark:text-[#f2bd65]">
            From our kitchen
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Made for the table at center.
          </h2>
          <p className="mt-5 text-base leading-7 text-[#3f5b4f] dark:text-emerald-50/75 sm:text-lg">
            Popular spreads for gatherings, merienda, and every reason to eat together.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:mt-14 md:grid-cols-2 xl:grid-cols-3">
          {itemsWithImages.map((item, index) => {
            const variant = item.variants[0]

            return (
              <Link
                key={item.id}
                href={ROUTES.ORDER}
                className="featured-item-card group overflow-hidden rounded-[1.5rem] border border-[#103d2d]/15 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#103d2d] dark:border-white/15 dark:focus-visible:outline-white"
              >
                <span className="relative block aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 font-mono text-xs font-medium tracking-[0.12em] text-white drop-shadow-md">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </span>
                <span className="block px-6 py-6">
                  <span className="block text-2xl font-semibold tracking-tight transition-colors group-hover:text-[#8a5a1f] dark:group-hover:text-[#f2bd65]">
                    {item.name}
                  </span>
                  {(item.description || item.notes) && (
                    <span className="mt-3 block min-h-12 text-sm leading-6 text-[#3f5b4f] dark:text-emerald-50/70">
                      {item.description || item.notes}
                    </span>
                  )}
                  <span className="mt-7 flex items-end justify-between gap-4 border-t border-[#103d2d]/15 pt-4 dark:border-white/15">
                    <span className="text-xs font-semibold tracking-[0.14em] text-[#3f5b4f] uppercase dark:text-emerald-50/65">
                      From {variant.label}
                    </span>
                    <span className="text-xl font-semibold text-[#8a5a1f] dark:text-[#f2bd65]">
                      ₱{formatter.format(variant.pricePhp)}
                    </span>
                  </span>
                </span>
              </Link>
            )
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            render={<Link href={ROUTES.ORDER} />}
            nativeButton={false}
            className="border-[#103d2d] bg-transparent px-6 text-base text-[#103d2d] hover:bg-transparent hover:text-[#8a5a1f] dark:border-white dark:bg-transparent dark:text-white dark:hover:bg-transparent dark:hover:text-[#f2bd65]"
          >
            Order now
          </Button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedItemsSection
