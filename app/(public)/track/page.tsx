import type { Metadata } from "next"

import { APP_DETAILS } from "@/constants/app.details"
import TrackOrderPage from "@/features/track-order/pages/TrackOrderPage"

export const metadata: Metadata = {
  title: `Track order · ${APP_DETAILS.name}`,
  description: "Look up your Mang Felipe order status and delivery tracking link.",
}

export default async function Page({ searchParams }: PageProps<"/track">) {
  const params = await searchParams
  const orderParam = params.order
  const initialOrderNumber =
    typeof orderParam === "string" ? orderParam : undefined

  return <TrackOrderPage initialOrderNumber={initialOrderNumber} />
}
