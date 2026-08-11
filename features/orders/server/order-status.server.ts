import "server-only"

import { z } from "zod"
import { prisma } from "@/lib/prisma"

const OrderNumberSchema = z.string().regex(/^HM-\d{8}-[A-Z0-9]{4}$/)

export async function getPublicOrderReceipt(orderNumber: string) {
  if (!OrderNumberSchema.safeParse(orderNumber).success) return null
  return prisma.order.findUnique({
    where: { orderNumber },
    select: {
      orderNumber: true,
      status: true,
      fulfillmentType: true,
      fulfillmentDate: true,
      fulfillmentSlot: true,
      subtotalPhp: true,
    },
  })
}
