"use client"

import { useState } from "react"
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

const LandingNavbar = () => {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <AppLogo width={40} height={40} className="size-10" />

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
            aria-label="Open cart"
            onClick={() => setCartOpen(true)}
          >
            <IconShoppingBag className="size-5 text-primary" />
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
            aria-label="Open cart"
            onClick={() => setCartOpen(true)}
          >
            <IconShoppingBag className="size-5 text-primary" />
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

      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Cart</SheetTitle>
          </SheetHeader>
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
            <IconShoppingBag className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Your cart is empty. Add meals from the menu to get started.
            </p>
          </div>
          <SheetFooter>
            <Button
              render={<Link href={ROUTES.ORDER} onClick={() => setCartOpen(false)} />}
              nativeButton={false}
            >
              Browse menu
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </header>
  )
}

export default LandingNavbar
