import type { Metadata } from "next"

import { APP_DETAILS } from "@/constants/app.details"
import ContactPage from "@/features/landing/pages/ContactPage"

export const metadata: Metadata = {
  title: `Contact · ${APP_DETAILS.name}`,
  description:
    "Addresses, maps, and contact details for Mang Felipe, Rak en Rolls, and Oh My Bilao! in La Huerta, Parañaque.",
}

export default function Page() {
  return <ContactPage />
}
