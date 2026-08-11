import type { TrackOrderResult } from "@/features/track-order/schema/track-order.schema"

export const STATUS_COPY: Record<TrackOrderResult["status"], string> = {
  pending_review: "Received — waiting for payment review",
  confirmed: "Confirmed — preparing for your slot",
  rejected: "Not accepted — contact the shop",
  cancelled: "Cancelled",
}
