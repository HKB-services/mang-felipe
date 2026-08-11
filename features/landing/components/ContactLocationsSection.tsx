"use client"

import { motion, MotionConfig, type Variants } from "motion/react"

import { BRAND_LOCATIONS } from "@/constants/brand-locations"
import ContactLocationCard from "./ContactLocationCard"

const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

const revealViewport = { once: true, amount: 0.18 } as const

const ContactLocationsSection = () => {
  return (
    <MotionConfig reducedMotion="user">
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          className="pt-12 sm:pt-14"
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
        >
          <h2 className="text-xs font-semibold tracking-[0.18em] text-[#8a5a1f] uppercase">
            Locations
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-[#3f5b4f]">
            Mang Felipe and Oh My Bilao! share the JP Rizal kitchen pin. Rak en
            Rolls is around the corner on Maria Clara.
          </p>
        </motion.div>

        {BRAND_LOCATIONS.map((location, index) => (
          <ContactLocationCard
            key={location.id}
            location={location}
            index={index}
          />
        ))}
      </section>
    </MotionConfig>
  )
}

export default ContactLocationsSection
