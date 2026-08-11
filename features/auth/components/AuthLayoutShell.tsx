import type { ReactNode } from "react"
import Image from "next/image"
import { Fraunces } from "next/font/google"

import AppLogo from "@/components/AppLogo"
import { APP_DETAILS } from "@/constants/app.details"
import { cn } from "@/lib/utils"

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
})

const AUTH_IMAGES = [
  {
    src: "https://images.pexels.com/photos/35482849/pexels-photo-35482849.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Filipino boodle-fight spread of grilled fish, shrimp, rice, and sides on banana leaves",
  },
  {
    src: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Shared table of freshly prepared Asian dishes and sides",
  },
  {
    src: "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Plated meal with rice, vegetables, and protein ready to serve",
  },
] as const

function AuthLayoutShell({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        fraunces.variable,
        "grid min-h-svh w-full lg:grid-cols-2"
      )}
    >
      <aside className="relative hidden overflow-hidden bg-[#103d2d] lg:block">
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1.5 p-1.5">
          <div className="relative row-span-2 overflow-hidden">
            <Image
              src={AUTH_IMAGES[0].src}
              alt={AUTH_IMAGES[0].alt}
              fill
              priority
              sizes="(min-width: 1024px) 25vw, 1px"
              className="object-cover object-center"
            />
          </div>
          <div className="relative overflow-hidden">
            <Image
              src={AUTH_IMAGES[1].src}
              alt={AUTH_IMAGES[1].alt}
              fill
              sizes="(min-width: 1024px) 25vw, 1px"
              className="object-cover object-center"
            />
          </div>
          <div className="relative overflow-hidden">
            <Image
              src={AUTH_IMAGES[2].src}
              alt={AUTH_IMAGES[2].alt}
              fill
              sizes="(min-width: 1024px) 25vw, 1px"
              className="object-cover object-center"
            />
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#08261b] via-[#08261b]/70 to-[#08261b]/25" />

        <div className="relative z-10 flex h-full flex-col justify-end p-10 text-white xl:p-14">
          <AppLogo
            width={48}
            height={48}
            showName
            asLink={false}
            nameClassName="text-lg text-white"
            className="ring-2 ring-white/20"
          />

          <p className="mt-6 max-w-md text-3xl leading-tight font-semibold tracking-tight [font-family:var(--font-display)] xl:text-4xl">
            Freshly prepared meals for{" "}
            <em className="text-[#f2bd65] italic">discerning</em> tables.
          </p>

          <p className="mt-4 max-w-sm text-sm leading-6 text-emerald-50/80">
            {APP_DETAILS.description}
          </p>

          <p className="mt-6 font-mono text-[0.65rem] tracking-[0.18em] text-[#f2bd65] uppercase">
            {APP_DETAILS.parentCompany} · Since {APP_DETAILS.foundedYear}
            <span className="mx-2 text-white/40" aria-hidden>
              ·
            </span>
            {APP_DETAILS.serviceAreas.join(" · ")}
          </p>
        </div>
      </aside>

      <div className="relative flex items-center justify-center bg-[#FBF6EC] p-6 dark:bg-[#0c2418] md:p-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12] lg:hidden"
          aria-hidden
        >
          <Image
            src={AUTH_IMAGES[0].src}
            alt=""
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 1px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#FBF6EC]/88 dark:bg-[#0c2418]/90" />
        </div>

        <div className="relative z-10 flex w-full max-w-sm flex-col gap-6">
          <div className="flex justify-center lg:hidden">
            <AppLogo
              width={44}
              height={44}
              showName
              asLink={false}
              nameClassName="text-lg text-[#103d2d] dark:text-white"
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

export { AuthLayoutShell }
