import { z } from "zod"

export const TrackOrderLookupSchema = z.object({
  orderNumber: z.string().trim().min(3, "Enter your order number"),
  customerPhone: z
    .string()
    .trim()
    .min(7, "Enter the phone number used at checkout"),
})

export type TrackOrderLookupInput = z.infer<typeof TrackOrderLookupSchema>

export type TrackOrderResultItem = {
  itemName: string
  variantLabel: string
  quantity: number
  lineTotalPhp: number
}

export type TrackOrderResult = {
  orderNumber: string
  status: "pending_review" | "confirmed" | "rejected" | "cancelled"
  fulfillmentType: "pickup" | "delivery"
  fulfillmentDate: Date
  fulfillmentSlot: "slot_10_12" | "slot_14_16" | "slot_17_19"
  deliveryAddress: string | null
  lalamoveTrackingUrl: string | null
  customerName: string
  subtotalPhp: number
  paymentChannel: "unionbank" | "gcash" | "bpi"
  items: TrackOrderResultItem[]
}
