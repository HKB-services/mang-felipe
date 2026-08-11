"use client"

import { useEffect, useState } from "react"
import { IconArrowUp } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SHOW_AFTER_PX = 400

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    })
  }

  return (
    <Button
      type="button"
      variant="default"
      size="icon-lg"
      aria-label="Scroll to top"
      onClick={scrollToTop}
      className={cn(
        "fixed right-4 bottom-4 z-50 shadow-md rounded-full transition-[opacity,transform] duration-200 sm:right-6 sm:bottom-6",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      )}
    >
      <IconArrowUp className="size-5" />
    </Button>
  )
}

export default ScrollToTop
