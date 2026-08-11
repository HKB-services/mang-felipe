import { z } from "zod"

const OrderStatusSchema = z.enum([
  "pending_review",
  "confirmed",
  "rejected",
  "cancelled",
])
const FulfillmentTypeSchema = z.enum(["pickup", "delivery"])
const PaymentChannelSchema = z.enum(["unionbank", "gcash", "bpi"])

export const ListOrdersInputSchema = z.object({
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(100).default(10),
  sort: z.string().nullable().optional(),
  search: z.string().trim().max(120).nullable().optional(),
  status: z.array(OrderStatusSchema).nullable().optional(),
  fulfillmentType: z.array(FulfillmentTypeSchema).nullable().optional(),
  paymentChannel: z.array(PaymentChannelSchema).nullable().optional(),
  fulfillmentDate: z.tuple([z.coerce.number(), z.coerce.number()]).optional(),
})

export type ListOrdersInput = z.infer<typeof ListOrdersInputSchema>
