"use client"

import Image from "next/image"
import { motion, type Variants } from "motion/react"

import {
  getMapsLinks,
  type BrandLocation,
} from "@/constants/brand-locations"
import { cn } from "@/lib/utils"

const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

const revealViewport = { once: true, amount: 0.18 } as const

const accentChrome = {
  forest: {
    rule: "bg-[#2E5339]",
    label: "text-[#2E5339]",
    mapRing: "ring-[#103d2d]/20",
  },
  red: {
    rule: "bg-[#c8452d]",
    label: "text-[#9e3423]",
    mapRing: "ring-[#c8452d]/25",
  },
  coral: {
    rule: "bg-[#e56d4d]",
    label: "text-[#ad452b]",
    mapRing: "ring-[#e56d4d]/25",
  },
} as const

const ContactLocationCard = ({
  location,
  index,
}: {
  location: BrandLocation
  index: number
}) => {
  const maps = getMapsLinks(location.address.full)
  const chrome = accentChrome[location.accent]
  const reverse = index % 2 === 1

  return (
    <motion.article
      id={location.id}
      className="scroll-mt-24 border-t border-[#103d2d]/12 py-14 sm:py-16"
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={revealViewport}
      transition={{ delay: (index % 2) * 0.08 }}
    >
      <div
        className={cn(
          "grid items-start gap-8 lg:grid-cols-2 lg:gap-12",
          reverse && "lg:[&>*:first-child]:order-2"
        )}
      >
        <div>
          <div className="flex items-center gap-4">
            <Image
              src={location.logo}
              alt=""
              width={64}
              height={64}
              className="size-14 shrink-0 rounded-full object-cover ring-2 ring-white sm:size-16"
            />
            <div>
              <p
                className={cn(
                  "text-xs font-semibold tracking-[0.16em] uppercase",
                  chrome.label
                )}
              >
                {location.tagline}
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#103d2d] sm:text-3xl">
                {location.name}
              </h2>
            </div>
          </div>

          <span
            className={cn("mt-5 block h-1 w-12 rounded-full", chrome.rule)}
            aria-hidden
          />

          <p className="mt-5 max-w-md text-sm leading-6 text-[#3f5b4f] sm:text-base">
            {location.description}
          </p>

          <address className="mt-6 not-italic">
            <p className="text-sm font-medium text-[#103d2d]">
              {location.address.line1}
            </p>
            <p className="mt-1 text-sm text-[#3f5b4f]">
              {location.address.city}, {location.address.region}{" "}
              {location.address.postalCode}
            </p>
          </address>

          <div className="mt-5 flex flex-col gap-2 text-sm">
            <a
              href={`tel:${location.phone.tel}`}
              className="w-fit font-medium text-[#103d2d] underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#103d2d]"
            >
              {location.phone.display}
            </a>
            <a
              href={`mailto:${location.email}`}
              className="w-fit text-[#3f5b4f] underline-offset-4 hover:text-[#103d2d] hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#103d2d]"
            >
              {location.email}
            </a>
            {location.social ? (
              <a
                href={location.social.url}
                target="_blank"
                rel="noreferrer"
                className="w-fit text-[#3f5b4f] underline-offset-4 hover:text-[#103d2d] hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#103d2d]"
              >
                {location.social.label}
              </a>
            ) : null}
          </div>

          <a
            href={maps.searchUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex text-sm font-semibold text-[#103d2d] underline decoration-[#e56d4d] decoration-2 underline-offset-6 transition hover:text-[#e56d4d] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#103d2d]"
          >
            Open in Google Maps
          </a>
        </div>

        <div
          className={cn(
            "overflow-hidden rounded-[1.5rem] bg-[#103d2d]/5 ring-1",
            chrome.mapRing
          )}
        >
          <iframe
            title={`Map for ${location.name}`}
            src={maps.embedUrl}
            className="aspect-[4/3] w-full border-0 sm:aspect-[16/11]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </motion.article>
  )
}

export default ContactLocationCard
