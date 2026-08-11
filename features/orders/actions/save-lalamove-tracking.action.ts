"use server"

import { z } from "zod"
import { ActionError, authActionClient } from "@/lib/safe.action"
import { prisma } from "@/lib/prisma"
import { sendDeliveryTrackingEmail } from "@/features/orders/server/send-order-emails"

const SaveLalamoveTrackingSchema = z.object({
  orderId: z.string().min(1),
  lalamoveTrackingUrl: z.url(),
  resendEmail: z.boolean().optional(),
})

export const saveLalamoveTrackingAction = authActionClient
  .metadata({ actionName: "saveLalamoveTracking" })
  .inputSchema(SaveLalamoveTrackingSchema)
  .action(async ({ parsedInput }) => {
    const existing = await prisma.order.findUnique({
      where: { id: parsedInput.orderId },
      select: { lalamoveTrackingUrl: true },
    })
    if (!existing) {
      throw new ActionError("Order not found")
    }

    const isFirstSave = !existing.lalamoveTrackingUrl

    const updated = await prisma.order.update({
      where: { id: parsedInput.orderId },
      data: {
        lalamoveTrackingUrl: parsedInput.lalamoveTrackingUrl,
        lalamoveTrackingSavedAt: new Date(),
      },
      select: {
        orderNumber: true,
        customerEmail: true,
        fulfillmentDate: true,
        fulfillmentSlot: true,
        lalamoveTrackingUrl: true,
        lalamoveTrackingSavedAt: true,
        lalamoveTrackingEmailedAt: true,
      },
    })

    const shouldEmail =
      Boolean(updated.customerEmail) &&
      (isFirstSave || parsedInput.resendEmail === true)

    let emailWarning: string | null = null

    if (shouldEmail && updated.customerEmail && updated.lalamoveTrackingUrl) {
      const result = await sendDeliveryTrackingEmail({
        customerEmail: updated.customerEmail,
        fulfillmentDate: updated.fulfillmentDate,
        fulfillmentSlot: updated.fulfillmentSlot,
        lalamoveTrackingUrl: updated.lalamoveTrackingUrl,
        orderNumber: updated.orderNumber,
      })

      if (result.success) {
        const emailed = await prisma.order.update({
          where: { id: parsedInput.orderId },
          data: { lalamoveTrackingEmailedAt: new Date() },
          select: { lalamoveTrackingEmailedAt: true },
        })
        updated.lalamoveTrackingEmailedAt = emailed.lalamoveTrackingEmailedAt
      } else {
        emailWarning = `Tracking link saved, but the email failed to send. ${result.message}`
      }
    }

    return {
      success: true as const,
      order: {
        lalamoveTrackingUrl: updated.lalamoveTrackingUrl,
        lalamoveTrackingSavedAt: updated.lalamoveTrackingSavedAt,
        lalamoveTrackingEmailedAt: updated.lalamoveTrackingEmailedAt,
      },
      emailWarning,
    }
  })
