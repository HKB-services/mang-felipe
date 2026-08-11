"use client"

import Image from "next/image"
import Link from "next/link"
import { Fraunces } from "next/font/google"
import { domAnimation, LazyMotion, m, MotionConfig } from "motion/react"

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

const ContactHeroSection = () => {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <section
          className={cn(
            fraunces.variable,
            "relative overflow-hidden bg-foreground text-primary-foreground"
          )}
        >
          <m.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <Image
              src="https://images.pexels.com/photos/35482850/pexels-photo-35482850.jpeg"
              alt="Vibrant Filipino boodle-fight spread of rice, shrimp, and vegetables on banana leaves"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </m.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/25" />
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 80% 60% at 20% 0%, color-mix(in oklab, var(--primary) 45%, transparent) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 90% 80%, color-mix(in oklab, var(--chart-2) 35%, transparent) 0%, transparent 50%)",
            }}
            aria-hidden
          />
          <m.div
            className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
            }}
          >
            <m.p
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
              className="font-mono text-[0.7rem] font-medium tracking-[0.2em] text-primary uppercase"
            >
              Happy Moments Food Corporation
            </m.p>
            <m.h1
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
              className="mt-4 max-w-2xl text-4xl leading-[1.08] font-semibold tracking-tight [font-family:var(--font-display)] sm:text-5xl lg:text-6xl"
            >
              Find us in <em className="text-primary italic">La Huerta</em>.
            </m.h1>
            <m.p
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
              className="mt-5 max-w-xl text-base leading-7 text-primary-foreground/80 sm:text-lg"
            >
              Three brands, two Parañaque kitchen pins. Call, Viber, or stop by —
              maps and addresses for each brand below.
            </m.p>

            <m.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button
                size="lg"
                variant="default"
                render={<Link href={ROUTES.ORDER} />}
                nativeButton={false}
                className="px-6 text-base"
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
                className="border-primary-foreground/30 bg-transparent px-6 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                {SHOP_CONTACT.viberDisplay}
              </Button>
            </m.div>

            <m.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
              className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-primary-foreground/15 pt-6 text-sm text-primary-foreground/75"
            >
              <a
                href={`mailto:${SHOP_CONTACT.email}`}
                className="underline-offset-4 hover:text-primary-foreground hover:underline"
              >
                {SHOP_CONTACT.email}
              </a>
              {SHOP_CONTACT.phones.map((phone) => (
                <a
                  key={phone.id}
                  href={`tel:${phone.tel}`}
                  className="underline-offset-4 hover:text-primary-foreground hover:underline"
                >
                  {phone.display}
                </a>
              ))}
            </m.div>
          </m.div>
        </section>
      </MotionConfig>
    </LazyMotion>
  )
}

export default ContactHeroSection
