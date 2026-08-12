import { ROUTES } from "@/constants";

export const PUBLIC_NAV_LINKS = [
  { label: "Home", href: ROUTES.HOME },
  { label: "Contact", href: ROUTES.CONTACT },
  { label: "Order", href: ROUTES.ORDER },
  { label: "Track order", href: ROUTES.TRACK },
] as const;
