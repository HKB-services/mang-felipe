"use client"

import Image from "next/image"
import Link from "next/link"
import { Fraunces } from "next/font/google"
import { motion, MotionConfig, type Variants } from "motion/react"

import { APP_DETAILS } from "@/constants/app.details"
import { ROUTES } from "@/constants/app.routes"
import { SHOP_CONTACT } from "@/constants/contact"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { HERO_BG_CLASS } from "../utils/hero-theme"

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
})

const EASE = [0.22, 1, 0.36, 1] as const

const copyContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

const riseItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: 0.15 },
  },
}

const HomeHeroSection = () => {
  return (
    <MotionConfig reducedMotion="user">
      <section
        className={cn(fraunces.variable, HERO_BG_CLASS, "relative overflow-hidden")}
      >
        <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-14 pb-20 sm:px-6 sm:pt-20 sm:pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:pt-24">
          <motion.div
            className="relative z-10"
            variants={copyContainer}
            initial="hidden"
            animate="show"
          >
            <motion.span
              variants={riseItem}
              className="inline-flex items-center gap-2 font-mono text-[0.7rem] font-medium tracking-[0.2em] text-[#8a5a1f] uppercase dark:text-[#f2bd65]"
            >
              <span className="h-px w-6 bg-[#e56d4d]" aria-hidden />
              Happy Moments Food Corp. &middot; Since {APP_DETAILS.foundedYear}
            </motion.span>

            <motion.h1
              variants={riseItem}
              className="mt-5 text-[2.75rem] leading-[1.05] font-semibold tracking-tight text-[#103d2d] [font-family:var(--font-display)] sm:text-6xl dark:text-white"
            >
              Real Filipino spreads,
              <br />
              plated <em className="text-primary italic">fresh</em> for your
              table.
            </motion.h1>

            <motion.p
              variants={riseItem}
              className="mt-6 max-w-md text-base leading-7 text-[#3f5b4f] sm:text-lg dark:text-emerald-50/80"
            >
              {APP_DETAILS.description}
            </motion.p>

            <motion.div
              variants={riseItem}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button
                size="lg"
                render={<Link href={ROUTES.ORDER} />}
                nativeButton={false}
                className="px-6 text-base"
              >
                Order now
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href={ROUTES.TRACK} />}
                nativeButton={false}
                className="border-[#103d2d]/20 px-6 text-base text-[#103d2d] hover:bg-[#103d2d]/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              >
                Track your order
              </Button>
            </motion.div>

            <motion.p
              variants={riseItem}
              className="mt-6 text-sm text-[#3f5b4f]/80 dark:text-emerald-50/60"
            >
              Ordering is easiest over Viber &mdash;{" "}
              <a
                href={`viber://chat?number=%2B${SHOP_CONTACT.viberTel}`}
                className="font-medium text-[#103d2d] underline-offset-4 hover:underline dark:text-white"
              >
                {SHOP_CONTACT.viberDisplay}
              </a>
              . Serving {APP_DETAILS.serviceAreas.join(", ")}.
            </motion.p>
          </motion.div>

          <motion.div
            variants={imageReveal}
            initial="hidden"
            animate="show"
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="relative aspect-[3/2] w-full -rotate-1 overflow-hidden rounded-[2.5rem] shadow-xl ring-4 ring-[#f2bd65]/70 ring-offset-4 ring-offset-[#FBF6EC] dark:ring-offset-[#0c2418]">
              <Image
                src="/marketing/mang-felipe-hero-banner.jpg"
                alt={`${APP_DETAILS.name} spread — catering trays, lumpia, and packed meals on banana leaf`}
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 90vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>

        <div aria-hidden className="hero-scallop absolute inset-x-0 bottom-0" />
      </section>
    </MotionConfig>
  )
}

export default HomeHeroSection
