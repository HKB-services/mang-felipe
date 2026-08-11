"use client";

import {
  IconBasket,
  IconCalendarCheck,
  IconCreditCardPay,
  IconMapPin,
  type TablerIcon,
} from "@tabler/icons-react";
import Link from "next/link";
import { domAnimation, LazyMotion, m, MotionConfig } from "motion/react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/app.routes";

type OrderingStep = {
  title: string;
  description: string;
  icon: TablerIcon;
};

const ORDERING_STEPS: OrderingStep[] = [
  {
    title: "Browse your spread",
    description: "Choose trays, rolls, bilao, or packed meals from our menu.",
    icon: IconBasket,
  },
  {
    title: "Pick your schedule",
    description:
      "Choose pickup or delivery, plus a next-day date and time slot.",
    icon: IconCalendarCheck,
  },
  {
    title: "Send payment proof",
    description:
      "Pay via UnionBank, GCash, or BPI, then upload your screenshot.",
    icon: IconCreditCardPay,
  },
  {
    title: "Track your order",
    description:
      "Use your order number and phone to check confirmation and delivery.",
    icon: IconMapPin,
  },
];

const HowItWorksSection = () => {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <section className="how-it-works bg-muted text-foreground overflow-hidden px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <m.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl"
            >
              <p className="text-primary font-mono text-[0.7rem] font-medium tracking-[0.2em] uppercase">
                From kitchen to gathering
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Good food, clearly planned.
              </h2>
              <p className="text-muted-foreground mt-5 max-w-xl text-base leading-7 sm:text-lg">
                Place your catering order in four clear steps. We prepare every
                spread for the date you choose.
              </p>
            </m.div>

            <ol className="how-it-works-path relative mt-12 grid gap-5 sm:mt-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
              <m.div
                aria-hidden
                className="how-it-works-route"
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
              {ORDERING_STEPS.map(
                ({ title, description, icon: Icon }, index) => (
                  <m.li
                    key={title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="how-it-works-step border-border bg-card/85 relative rounded-[1.5rem] border px-6 py-7 lg:rounded-none lg:border-y-0 lg:border-r-0 lg:px-7 lg:first:rounded-l-[1.5rem] lg:last:rounded-r-[1.5rem] lg:last:border-r"
                  >
                    <span className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-full shadow-sm">
                      <Icon className="size-6" stroke={1.8} aria-hidden />
                    </span>
                    <span className="text-primary mt-8 block font-mono text-xs font-medium tracking-[0.16em] uppercase">
                      Step {index + 1}
                    </span>
                    <h3 className="mt-3 text-xl font-semibold tracking-tight">
                      {title}
                    </h3>
                    <p className="text-muted-foreground mt-3 text-sm leading-6">
                      {description}
                    </p>
                  </m.li>
                ),
              )}
            </ol>

            <m.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
            >
              <Button
                size="lg"
                variant="default"
                render={<Link href={ROUTES.ORDER} />}
                nativeButton={false}
              >
                Start an order
              </Button>
              <Button
                size="lg"
                variant="link"
                render={<Link href={ROUTES.TRACK} />}
                nativeButton={false}
              >
                Track an existing order
              </Button>
            </m.div>
          </div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
};

export default HowItWorksSection;
