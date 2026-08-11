"use client"

import { useState } from "react"
import Image from "next/image"
import { Fraunces } from "next/font/google"
import { TrackOrderForm } from "@/features/track-order/components/TrackOrderForm"
import { TrackOrderResult as TrackOrderResultView } from "@/features/track-order/components/TrackOrderResult"
import type { TrackOrderResult } from "@/features/track-order/schema/track-order.schema"
import { cn } from "@/lib/utils"

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
})

export default function TrackOrderPage({
  initialOrderNumber,
}: {
  initialOrderNumber?: string
}) {
  const [result, setResult] = useState<TrackOrderResult | null>(null)

  return (
    <div className={cn(fraunces.variable, "mf-canvas min-h-[70vh]")}>
      <section className="mf-hero relative overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/35482849/pexels-photo-35482849.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Filipino boodle-fight spread of grilled fish, shrimp, rice, and sides on banana leaves"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/55 to-[var(--mf-hero)]" />
        <div className="relative mx-auto max-w-2xl px-4 pt-14 pb-24 sm:px-6 sm:pt-16 sm:pb-28">
          <p className="font-mono text-[0.7rem] font-medium tracking-[0.22em] text-[var(--mf-gold)] uppercase">
            Claim ticket
          </p>
          <h1 className="mt-3 text-3xl leading-tight font-semibold tracking-tight [font-family:var(--font-display)] sm:text-4xl">
            Where&rsquo;s my <em className="text-[var(--mf-gold)] italic">order</em>?
          </h1>
          <p className="mt-3 max-w-md text-sm leading-6 opacity-80">
            Order number and checkout phone — that&rsquo;s your stub. Enter both
            to see where things stand.
          </p>
        </div>
      </section>

      <div className="mx-auto -mt-14 flex w-full max-w-2xl flex-col gap-6 px-4 pb-16 sm:px-6">
        <TrackOrderForm
          initialOrderNumber={initialOrderNumber}
          onResult={setResult}
        />
        {result && <TrackOrderResultView order={result} />}
      </div>
    </div>
  )
}
