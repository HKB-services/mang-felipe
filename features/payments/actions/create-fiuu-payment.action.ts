"use server"

import { z } from "zod"
import { ActionError, actionClient } from "@/lib/safe.action"
import { prisma } from "@/lib/prisma"
import { isFiuuPaymentEnabled } from "@/constants/payment"
import { buildFiuuCheckoutPayload } from "@/features/payments/server/fiuu"

const CreateFiuuPaymentSchema = z.object({
  orderNumber: z.string().trim().min(1),
})

/**
 * Build Fiuu hosted-pay POST payload for an existing order.
 * Requires ENABLE_FIUU_PAYMENT = true and FIUU_* env.
 */
export const createFiuuPaymentAction = actionClient
  .metadata({ actionName: "createFiuuPayment" })
  .inputSchema(CreateFiuuPaymentSchema)
  .action(async ({ parsedInput }) => {
    if (!isFiuuPaymentEnabled()) {
      throw new ActionError(
        "Fiuu is disabled. Set ENABLE_FIUU_PAYMENT = true in constants/payment.ts."
      )
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber: parsedInput.orderNumber },
    })

    if (!order) {
      throw new ActionError("Order not found")
    }

    if (order.status === "cancelled" || order.status === "rejected") {
      throw new ActionError("Order cannot be paid")
    }

    const checkout = buildFiuuCheckoutPayload({
      orderNumber: order.orderNumber,
      subtotalPhp: order.subtotalPhp,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
    })

    return { success: true as const, ...checkout }
  })
