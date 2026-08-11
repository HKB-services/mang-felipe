import Link from "next/link";
import { IconBrandFacebook, IconBrandInstagram } from "@tabler/icons-react";

import AppLogo from "@/components/AppLogo";
import { APP_DETAILS } from "@/constants/app.details";
import { SHOP_CONTACT } from "@/constants/contact";
import { PUBLIC_NAV_LINKS } from "../utils/public-nav";

const LandingFooter = () => {
  return (
    <footer className="border-t border-emerald-950/20 bg-[#103d2d] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:px-8 lg:grid-cols-[1.4fr_0.8fr_1fr] lg:gap-16 lg:px-12">
        <div className="max-w-sm">
          <AppLogo
            width={48}
            height={48}
            className="size-12 border border-white/30"
            showName
            linkClassName="rounded-sm outline-offset-4 focus-visible:outline-2 focus-visible:outline-white"
            nameClassName="text-lg"
          />
          <p className="mt-5 text-sm leading-6 text-emerald-50/75">
            {APP_DETAILS.description}
          </p>
          <p className="mt-3 text-sm text-emerald-50/90">
            For orders,{" "}
            <a
              href={`viber://chat?number=%2B${SHOP_CONTACT.viberTel}`}
              className="underline-offset-4 hover:underline"
            >
              {SHOP_CONTACT.viberDisplay}
            </a>
            .
          </p>
          <div className="mt-7 flex items-center gap-3 text-xs font-medium tracking-[0.16em] text-emerald-50/70 uppercase">
            <span className="h-px w-7 bg-[#e56d4d]" />
            Sister brands
          </div>
          <p className="mt-3 text-sm text-white/90">
            Raken Rolls · Oh My Bilao!
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold tracking-[0.18em] text-[#f2bd65] uppercase">
            Explore
          </h2>
          <nav
            aria-label="Footer navigation"
            className="mt-5 flex flex-col items-start gap-3"
          >
            {PUBLIC_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-emerald-50/80 underline-offset-4 transition hover:text-white hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-xs font-semibold tracking-[0.18em] text-[#f2bd65] uppercase">
            Get in touch
          </h2>
          <address className="mt-5 not-italic">
            <a
              href={`mailto:${SHOP_CONTACT.email}`}
              className="text-sm text-emerald-50/80 underline-offset-4 transition hover:text-white hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-white"
            >
              {SHOP_CONTACT.email}
            </a>
            <div className="mt-3 flex flex-col gap-2">
              {SHOP_CONTACT.phones.map((phone) => (
                <a
                  key={phone.id}
                  href={`tel:${phone.tel}`}
                  className="w-fit text-sm text-emerald-50/80 underline-offset-4 transition hover:text-white hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-white"
                >
                  {phone.display}
                </a>
              ))}
            </div>
          </address>
          <p className="mt-6 text-sm leading-6 text-emerald-50/75">
            Pay via UnionBank, GCash, or BPI. Payment details shown at checkout.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://www.facebook.com/MangFelipeKitchen"
              target="_blank"
              rel="noreferrer"
              aria-label="Mang Felipe Kitchen on Facebook"
              className="grid size-9 place-items-center rounded-full border border-white/25 text-emerald-50/80 transition hover:border-white hover:bg-white hover:text-[#103d2d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <IconBrandFacebook className="size-5" aria-hidden />
            </a>
            <span
              aria-label="Instagram link coming soon"
              className="grid size-9 place-items-center rounded-full border border-white/15 text-emerald-50/40"
            >
              <IconBrandInstagram className="size-5" aria-hidden />
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-xs text-emerald-50/65 sm:flex-row sm:justify-between sm:px-8 lg:px-12">
          <p>
            © {new Date().getFullYear()} {APP_DETAILS.parentCompany}
          </p>
          <p>Prices subject to change. Delivery fee not included.</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
