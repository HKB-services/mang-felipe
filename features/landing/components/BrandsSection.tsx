"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, MotionConfig, type Variants } from "motion/react";

import { APP_DETAILS } from "@/constants/app.details";
import { ROUTES } from "@/constants/app.routes";
import { BRAND_FAMILY, SISTER_BRAND_LIST } from "@/constants/sister-brands";

const sisterCardStyles = {
  red: {
    surface: "bg-[#fff4f0] dark:bg-[#351c19]",
    rule: "bg-[#c8452d]",
    label: "text-[#9e3423] dark:text-[#ffb7a8]",
  },
  coral: {
    surface: "bg-[#fff3ed] dark:bg-[#382019]",
    rule: "bg-[#e56d4d]",
    label: "text-[#ad452b] dark:text-[#ffc2ae]",
  },
} as const;

const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const revealViewport = { once: true, amount: 0.18 } as const;

const BrandsSection = () => {
  return (
    <MotionConfig reducedMotion="user">
      <section className="bg-background px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="max-w-2xl"
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={revealViewport}
          >
            <p className="font-mono text-[0.7rem] font-medium tracking-[0.2em] text-[#8a5a1f] uppercase dark:text-[#f2bd65]">
              Happy Moments Food Corporation
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[#103d2d] sm:text-5xl dark:text-white">
              One kitchen, more ways to gather.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#3f5b4f] sm:text-lg dark:text-emerald-50/75">
              From everyday catering to crispy merienda and celebration-ready
              bilao, our family of brands brings good food to every kind of
              table.
            </p>
          </motion.div>

          <motion.article
            className="mt-12 overflow-hidden rounded-[2rem] bg-[#103d2d] text-white shadow-xl shadow-emerald-950/15 sm:mt-14 lg:grid lg:grid-cols-[1.12fr_0.88fr]"
            variants={reveal}
            initial="hidden"
            whileInView="show"
            whileHover={{ y: -4 }}
            viewport={revealViewport}
          >
            <div className="relative min-h-72 lg:min-h-full">
              <Image
                src={BRAND_FAMILY.primary.assets.banner}
                alt={`${APP_DETAILS.name} catering spread`}
                fill
                sizes="(max-width: 1023px) 100vw, 55vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#08261b]/70 via-transparent to-transparent lg:bg-linear-to-r lg:from-transparent lg:to-[#103d2d]/45" />
            </div>

            <div className="relative flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-12 lg:px-12">
              <Image
                src={APP_DETAILS.logo}
                alt={`${APP_DETAILS.name} logo`}
                width={88}
                height={88}
                className="size-[4.5rem] rounded-full border-2 border-white/55 object-cover sm:size-[5.5rem]"
              />
              <p className="mt-7 text-xs font-semibold tracking-[0.18em] text-[#f2bd65] uppercase">
                Main kitchen
              </p>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {APP_DETAILS.name}
              </h3>
              <p className="mt-4 max-w-md text-base leading-7 text-emerald-50/80">
                {APP_DETAILS.description}
              </p>
            </div>
          </motion.article>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {SISTER_BRAND_LIST.map((brand, index) => {
              const styles = sisterCardStyles[brand.accent];

              return (
                <motion.article
                  key={brand.id}
                  className={`overflow-hidden rounded-[1.75rem] ${styles.surface}`}
                  variants={reveal}
                  initial="hidden"
                  whileInView="show"
                  whileHover={{ y: -4 }}
                  viewport={revealViewport}
                  transition={{ delay: index * 0.08 }}
                >
                  <div className="relative aspect-[2.35/1]">
                    <Image
                      src={brand.assets.banner}
                      alt={`${brand.name} food selection`}
                      fill
                      sizes="(max-width: 767px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
                  </div>
                  <div className="relative px-6 pt-0 pb-7 sm:px-8 sm:pb-8">
                    <div className="-mt-9 flex items-end justify-between gap-4">
                      <Image
                        src={brand.assets.logo}
                        alt={`${brand.name} logo`}
                        width={80}
                        height={80}
                        className="size-20 rounded-full border-4 border-white object-cover shadow-md dark:border-[#251411]"
                      />
                      <span
                        className={`mb-2 h-1.5 w-14 rounded-full ${styles.rule}`}
                      />
                    </div>
                    <p
                      className={`mt-5 text-xs font-semibold tracking-[0.16em] uppercase ${styles.label}`}
                    >
                      {brand.tagline}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#103d2d] dark:text-white">
                      {brand.name}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-6 text-[#3f5b4f] dark:text-emerald-50/75">
                      {brand.description}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <motion.div
            className="mt-10 flex flex-col gap-4 border-t border-[#103d2d]/15 pt-7 sm:flex-row sm:items-center sm:justify-between dark:border-white/15"
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={revealViewport}
          >
            <p className="text-sm text-[#3f5b4f] dark:text-emerald-50/75">
              Meet brands, places, and stories behind Happy Moments Food
              Corporation.
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link
                href={ROUTES.CONTACT}
                className="w-fit text-sm font-semibold text-[#103d2d] underline decoration-[#e56d4d] decoration-2 underline-offset-6 transition hover:text-[#e56d4d] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#103d2d] dark:text-white dark:focus-visible:outline-white"
              >
                Locations &amp; maps
              </Link>
              <Link
                href={ROUTES.HISTORY}
                className="w-fit text-sm font-semibold text-[#103d2d] underline decoration-[#e56d4d] decoration-2 underline-offset-6 transition hover:text-[#e56d4d] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#103d2d] dark:text-white dark:focus-visible:outline-white"
              >
                Our story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
};

export default BrandsSection;
