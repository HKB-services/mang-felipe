"use client"

import {
  IconBasket,
  IconCalendarCheck,
  IconCreditCardPay,
  IconMapPin,
  type TablerIcon,
} from "@tabler/icons-react"
import Link from "next/link"
import { motion, MotionConfig } from "motion/react"

import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/app.routes"

type OrderingStep = {
  title: string
  description: string
  icon: TablerIcon
}

const ORDERING_STEPS: OrderingStep[] = [
  {
    title: "Browse your spread",
    description: "Choose trays, rolls, bilao, or packed meals from our menu.",
    icon: IconBasket,
  },
  {
    title: "Pick your schedule",
    description: "Choose pickup or delivery, plus a next-day date and time slot.",
    icon: IconCalendarCheck,
  },
  {
    title: "Send payment proof",
    description: "Pay via UnionBank, GCash, or BPI, then upload your screenshot.",
    icon: IconCreditCardPay,
  },
  {
    title: "Track your order",
    description: "Use your order number and phone to check confirmation and delivery.",
    icon: IconMapPin,
  },
]

const HowItWorksSection = () => {
  return (
    <MotionConfig reducedMotion="user">
      <section className="how-it-works overflow-hidden bg-[#edf8f1] px-4 py-20 text-[#103d2d] dark:bg-[#103d2d] dark:text-white sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <p className="font-mono text-[0.7rem] font-medium tracking-[0.2em] text-[#f2bd65] uppercase">
              From kitchen to gathering
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Good food, clearly planned.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#3f5b4f] dark:text-emerald-50/75 sm:text-lg">
              Place your catering order in four clear steps. We prepare every
              spread for the date you choose.
            </p>
          </motion.div>

          <ol className="how-it-works-path relative mt-12 grid gap-5 sm:mt-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            <motion.div
              aria-hidden
              className="how-it-works-route"
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
            {ORDERING_STEPS.map(({ title, description, icon: Icon }, index) => (
              <motion.li
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="how-it-works-step relative rounded-[1.5rem] border border-[#103d2d]/12 bg-white/75 px-6 py-7 lg:rounded-none lg:border-y-0 lg:border-r-0 lg:px-7 lg:first:rounded-l-[1.5rem] lg:last:rounded-r-[1.5rem] lg:last:border-r dark:border-white/15 dark:bg-white/6"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-[#f2bd65] text-[#103d2d] shadow-sm">
                  <Icon className="size-6" stroke={1.8} aria-hidden />
                </span>
                <span className="mt-8 block font-mono text-xs font-medium tracking-[0.16em] text-[#f2bd65] uppercase">
                  Step {index + 1}
                </span>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#3f5b4f] dark:text-emerald-50/75">{description}</p>
              </motion.li>
            ))}
          </ol>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Button
              size="lg"
              render={<Link href={ROUTES.ORDER} />}
              nativeButton={false}
              className="bg-[#f2bd65] px-6 text-base text-[#103d2d] hover:bg-[#ffcf7d]"
            >
              Start an order
            </Button>
            <Link
              href={ROUTES.TRACK}
              className="text-sm font-semibold text-[#103d2d] underline decoration-[#e56d4d] decoration-2 underline-offset-6 transition hover:text-[#ad452b] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#103d2d] dark:text-white dark:hover:text-[#f2bd65] dark:focus-visible:outline-white"
            >
              Track an existing order
            </Link>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  )
}

export default HowItWorksSection
