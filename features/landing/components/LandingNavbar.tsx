"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconMenu2, IconShoppingBag } from "@tabler/icons-react"

import { ROUTES } from "@/constants"
import { cn } from "@/lib/utils"
import AppLogo from "@/components/AppLogo"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { PUBLIC_NAV_LINKS } from "../utils/public-nav"
import { HERO_BG_CLASS } from "../utils/hero-theme"
import { CartSummary } from "@/features/orders/components/CartSummary"
import { useOrderCart } from "@/features/orders/hooks/use-order-cart"
import { useCartSheet } from "@/features/orders/hooks/use-cart-sheet"

const LandingNavbar = () => {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { count } = useOrderCart()
  const { open: cartSheetOpen, setOpen: setCartSheetOpen } = useCartSheet()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-200",
        scrolled
          ? "border-border bg-background/80 backdrop-blur-sm"
          : cn("border-transparent", HERO_BG_CLASS)
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <AppLogo width={40} height={40} className="size-10" priority />

        <div className="hidden items-center gap-8 md:flex">
          {PUBLIC_NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group relative py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
                <span
                  className={cn(
                    "absolute inset-x-0 -bottom-0.5 h-px scale-x-0 rounded-full bg-primary transition-transform group-hover:scale-x-100",
                    isActive && "scale-x-100"
                  )}
                  aria-hidden
                />
              </Link>
            )
          })}
        </div>

        <div className="hidden items-center gap-1 md:flex">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={`Open cart${count ? `, ${count} items` : ""}`}
            onClick={() => setCartSheetOpen(true)}
          >
            <IconShoppingBag className="size-5 text-primary" />
            {count ? <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-[#b44c35] text-[10px] text-white">{count > 99 ? "99+" : count}</span> : null}
          </Button>
          <Button
            render={<Link href={ROUTES.ORDER} />}
            nativeButton={false}
            className="ml-2"
          >
            Order now
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={`Open cart${count ? `, ${count} items` : ""}`}
            onClick={() => setCartSheetOpen(true)}
          >
            <IconShoppingBag className="size-5 text-primary" />
            {count ? <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-[#b44c35] text-[10px] text-white">{count > 99 ? "99+" : count}</span> : null}
          </Button>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" aria-label="Open menu" />}
            >
              <IconMenu2 />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>
                  <AppLogo
                    width={28}
                    height={28}
                    className="size-7"
                    showName
                    asLink={false}
                    nameClassName="text-base font-semibold"
                  />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-4">
                {PUBLIC_NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "text-base font-medium text-muted-foreground transition-colors hover:text-foreground",
                      pathname === link.href && "text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <SheetFooter>
                <Button
                  render={<Link href={ROUTES.ORDER} onClick={() => setMenuOpen(false)} />}
                  nativeButton={false}
                >
                  Order now
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <Sheet open={cartSheetOpen} onOpenChange={setCartSheetOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Cart</SheetTitle>
          </SheetHeader>
          <div className="flex flex-1 flex-col px-4"><CartSummary compact /></div>
        </SheetContent>
      </Sheet>
    </header>
  )
}

export default LandingNavbar
