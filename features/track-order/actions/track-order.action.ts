"use server"

import { ActionError, actionClient } from "@/lib/safe.action"
import { prisma } from "@/lib/prisma"
import { TrackOrderLookupSchema } from "@/features/track-order/schema/track-order.schema"
import { normalizePhone } from "@/features/track-order/utils/normalize-phone"

const NOT_FOUND_MESSAGE =
  "We couldn't find an order with that number and phone. Double-check both and try again."

export const trackOrderAction = actionClient
  .metadata({ actionName: "trackOrder" })
  .inputSchema(TrackOrderLookupSchema)
  .action(async ({ parsedInput }) => {
    const order = await prisma.order.findFirst({
      where: {
        orderNumber: parsedInput.orderNumber,
        customerPhone: normalizePhone(parsedInput.customerPhone),
      },
      select: {
        orderNumber: true,
        status: true,
        fulfillmentType: true,
        fulfillmentDate: true,
        fulfillmentSlot: true,
        deliveryAddress: true,
        lalamoveTrackingUrl: true,
        customerName: true,
        subtotalPhp: true,
        paymentChannel: true,
        items: {
          select: {
            itemName: true,
            variantLabel: true,
            quantity: true,
            lineTotalPhp: true,
          },
        },
      },
    })

    if (!order) {
      throw new ActionError(NOT_FOUND_MESSAGE)
    }

    return { success: true as const, order }
  })
