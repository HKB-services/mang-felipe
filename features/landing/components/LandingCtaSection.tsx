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
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

const revealViewport = { once: true, amount: 0.35 } as const

const LandingCtaSection = () => {
  return (
    <MotionConfig reducedMotion="user">
      <section className={cn(fraunces.variable, "relative overflow-hidden bg-[#103d2d]")}>
        <div className="relative min-h-[520px] sm:min-h-[560px] lg:min-h-[620px]">
          <Image
            src="https://images.pexels.com/photos/35482849/pexels-photo-35482849.jpeg"
            alt="Boodle-fight spread of grilled fish, shrimp, rice, and sides laid down a banana leaf runner"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08261b] via-[#08261b]/55 to-[#08261b]/10" />
          <div className="absolute inset-0 bg-[#08261b]/15" />

          <motion.div
            className="relative z-10 mx-auto flex min-h-[520px] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center sm:min-h-[560px] sm:px-6 sm:py-24 lg:min-h-[620px]"
            variants={copyContainer}
            initial="hidden"
            whileInView="show"
            viewport={revealViewport}
          >
            <motion.span
              variants={riseItem}
              className="inline-flex items-center gap-2 font-mono text-[0.7rem] font-medium tracking-[0.2em] text-[#f2bd65] uppercase"
            >
              <span className="h-px w-6 bg-[#e56d4d]" aria-hidden />
              Kain na &mdash; ready when you are
            </motion.span>

            <motion.h2
              variants={riseItem}
              className="mt-5 text-4xl leading-[1.08] font-semibold tracking-tight text-white [font-family:var(--font-display)] sm:text-5xl"
            >
              There&apos;s always <em className="text-[#f2bd65] italic">room</em>{" "}
              at our table.
            </motion.h2>

            <motion.p
              variants={riseItem}
              className="mt-5 max-w-lg text-base leading-7 text-emerald-50/85 sm:text-lg"
            >
              Order online for pickup or delivery, or track a spread already on
              its way. Serving {APP_DETAILS.serviceAreas.join(", ")}.
            </motion.p>

            <motion.div
              variants={riseItem}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <Button
                size="lg"
                render={<Link href={ROUTES.ORDER} />}
                nativeButton={false}
                className="bg-[#e56d4d] px-6 text-base text-white hover:bg-[#d75f40]"
              >
                Order now
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href={ROUTES.TRACK} />}
                nativeButton={false}
                className="border-white/30 bg-transparent px-6 text-base text-white hover:bg-white/10"
              >
                Track your order
              </Button>
            </motion.div>

            <motion.div
              variants={riseItem}
              className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/15 pt-6 text-sm text-emerald-50/75"
            >
              <span>Packed meals or questions? We&apos;re one message away.</span>
              <span className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
                <a
                  href={`viber://chat?number=%2B${SHOP_CONTACT.viberTel}`}
                  className="font-medium text-white underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  {SHOP_CONTACT.viberDisplay}
                </a>
                <Link
                  href={ROUTES.CONTACT}
                  className="font-medium text-white underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Locations &amp; maps
                </Link>
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  )
}

export default LandingCtaSection
