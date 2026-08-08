import { z } from "zod"
import {
  FULFILLMENT_SLOTS,
  FULFILLMENT_TYPES,
  ORDER_MIN_LEAD_DAYS,
  PAYMENT_CHANNELS,
} from "@/constants/payment"

const fulfillmentTypeValues = Object.keys(FULFILLMENT_TYPES) as [
  keyof typeof FULFILLMENT_TYPES,
  ...Array<keyof typeof FULFILLMENT_TYPES>,
]

const fulfillmentSlotValues = Object.keys(FULFILLMENT_SLOTS) as [
  keyof typeof FULFILLMENT_SLOTS,
  ...Array<keyof typeof FULFILLMENT_SLOTS>,
]

const paymentChannelValues = Object.keys(PAYMENT_CHANNELS) as [
  keyof typeof PAYMENT_CHANNELS,
  ...Array<keyof typeof PAYMENT_CHANNELS>,
]

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function minFulfillmentDate(from = new Date()) {
  const min = startOfLocalDay(from)
  min.setDate(min.getDate() + ORDER_MIN_LEAD_DAYS)
  return min
}

/** Guest order form + cart payload for TanStack Form / server action. */
export const OrderCheckoutFormSchema = z
  .object({
    customerName: z.string().trim().min(2, "Name is required"),
    customerPhone: z.string().trim().min(7, "Phone number is required"),
    customerEmail: z
      .union([z.literal(""), z.email("Invalid email")])
      .optional()
      .transform((value) => (value ? value : null)),
    fulfillmentType: z.enum(fulfillmentTypeValues),
    fulfillmentDate: z.coerce.date(),
    fulfillmentSlot: z.enum(fulfillmentSlotValues),
    deliveryAddress: z.string().trim().optional().nullable(),
    deliveryNotes: z.string().trim().optional().nullable(),
    paymentChannel: z.enum(paymentChannelValues),
    paymentProofKey: z.string().trim().min(1).optional().nullable(),
    items: z
      .array(
        z.object({
          variantId: z.string().min(1),
          quantity: z.number().int().positive().max(99),
          notes: z.string().trim().optional().nullable(),
        })
      )
      .min(1, "Add at least one item"),
  })
  .superRefine((data, ctx) => {
    const minDate = minFulfillmentDate()
    const chosen = startOfLocalDay(data.fulfillmentDate)
    if (chosen < minDate) {
      ctx.addIssue({
        code: "custom",
        path: ["fulfillmentDate"],
        message: `Earliest date is next day (${minDate.toLocaleDateString()})`,
      })
    }

    if (data.fulfillmentType === "delivery") {
      const address = data.deliveryAddress?.trim() ?? ""
      if (address.length < 5) {
        ctx.addIssue({
          code: "custom",
          path: ["deliveryAddress"],
          message: "Delivery address is required",
        })
      }
    }
  })

export type OrderCheckoutForm = z.infer<typeof OrderCheckoutFormSchema>
