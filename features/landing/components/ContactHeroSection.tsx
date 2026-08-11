"use client"

import Image from "next/image"
import Link from "next/link"
import { Fraunces } from "next/font/google"
import { motion, MotionConfig, type Variants } from "motion/react"

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

const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.06 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: EASE } },
}

const copyContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

const riseItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

const ContactHeroSection = () => {
  return (
    <MotionConfig reducedMotion="user">
      <section
        className={cn(
          fraunces.variable,
          "relative overflow-hidden bg-[#103d2d] text-white"
        )}
      >
        <motion.div
          className="absolute inset-0"
          variants={imageReveal}
          initial="hidden"
          animate="show"
        >
          <Image
            src="https://images.pexels.com/photos/35482850/pexels-photo-35482850.jpeg"
            alt="Vibrant Filipino boodle-fight spread of rice, shrimp, and vegetables on banana leaves"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#08261b] via-[#08261b]/80 to-[#08261b]/45" />
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 20% 0%, #2E5339 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 90% 80%, #e56d4d33 0%, transparent 50%)",
          }}
          aria-hidden
        />
        <motion.div
          className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
          variants={copyContainer}
          initial="hidden"
          animate="show"
        >
          <motion.p
            variants={riseItem}
            className="font-mono text-[0.7rem] font-medium tracking-[0.2em] text-[#f2bd65] uppercase"
          >
            Happy Moments Food Corporation
          </motion.p>
          <motion.h1
            variants={riseItem}
            className="mt-4 max-w-2xl text-4xl leading-[1.08] font-semibold tracking-tight [font-family:var(--font-display)] sm:text-5xl lg:text-6xl"
          >
            Find us in <em className="text-[#f2bd65] italic">La Huerta</em>.
          </motion.h1>
          <motion.p
            variants={riseItem}
            className="mt-5 max-w-xl text-base leading-7 text-emerald-50/80 sm:text-lg"
          >
            Three brands, two Parañaque kitchen pins. Call, Viber, or stop by —
            maps and addresses for each brand below.
          </motion.p>

          <motion.div
            variants={riseItem}
            className="mt-8 flex flex-wrap items-center gap-3"
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
              render={
                <a href={`viber://chat?number=%2B${SHOP_CONTACT.viberTel}`} />
              }
              nativeButton={false}
              className="border-white/30 bg-transparent px-6 text-base text-white hover:bg-white/10"
            >
              {SHOP_CONTACT.viberDisplay}
            </Button>
          </motion.div>

          <motion.div
            variants={riseItem}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/15 pt-6 text-sm text-emerald-50/75"
          >
            <a
              href={`mailto:${SHOP_CONTACT.email}`}
              className="underline-offset-4 hover:text-white hover:underline"
            >
              {SHOP_CONTACT.email}
            </a>
            {SHOP_CONTACT.phones.map((phone) => (
              <a
                key={phone.id}
                href={`tel:${phone.tel}`}
                className="underline-offset-4 hover:text-white hover:underline"
              >
                {phone.display}
              </a>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </MotionConfig>
  )
}

export default ContactHeroSection
