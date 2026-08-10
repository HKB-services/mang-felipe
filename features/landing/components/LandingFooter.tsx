import Link from "next/link";

import AppLogo from "@/components/AppLogo";
import { APP_DETAILS } from "@/constants/app.details";
import { ROUTES } from "@/constants/app.routes";
import { SHOP_CONTACT } from "@/constants/contact";

const publicLinks = [
  { href: ROUTES.HOME, label: "Home" },
  { href: ROUTES.HISTORY, label: "Our story" },
  { href: ROUTES.ORDER, label: "Order now" },
  { href: ROUTES.TRACK, label: "Track order" },
];

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
            {publicLinks.map((link) => (
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
