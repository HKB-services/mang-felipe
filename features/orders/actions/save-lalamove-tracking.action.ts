"use server"

import { z } from "zod"
import { ActionError, authActionClient } from "@/lib/safe.action"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/services/email.service"
import { ROUTES } from "@/constants/app.routes"
import { FULFILLMENT_SLOTS } from "@/constants/payment"
import { formatFulfillmentDate } from "@/features/orders/utils/format"

const SaveLalamoveTrackingSchema = z.object({
  orderId: z.string().min(1),
  lalamoveTrackingUrl: z.url(),
  resendEmail: z.boolean().optional(),
})

function buildTrackingEmailHtml(input: {
  orderNumber: string
  fulfillmentDate: Date
  fulfillmentSlot: keyof typeof FULFILLMENT_SLOTS
  lalamoveTrackingUrl: string
  trackUrl: string
}) {
  return `<p>Hi, here's your delivery tracking link for Mang Felipe order <strong>${input.orderNumber}</strong>.</p><p><strong>Delivery date:</strong> ${formatFulfillmentDate(input.fulfillmentDate)} (${FULFILLMENT_SLOTS[input.fulfillmentSlot].label})</p><p><strong>Track your Lalamove delivery:</strong> <a href="${input.lalamoveTrackingUrl}">${input.lalamoveTrackingUrl}</a></p><p>You can also check your order status anytime at <a href="${input.trackUrl}">${input.trackUrl}</a>.</p>`
}

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
      const trackUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}${ROUTES.TRACK}?order=${encodeURIComponent(updated.orderNumber)}`
      const result = await sendEmail({
        recipients: [updated.customerEmail],
        subject: `Your Mang Felipe order ${updated.orderNumber} — delivery tracking`,
        htmlContent: buildTrackingEmailHtml({
          orderNumber: updated.orderNumber,
          fulfillmentDate: updated.fulfillmentDate,
          fulfillmentSlot: updated.fulfillmentSlot,
          lalamoveTrackingUrl: updated.lalamoveTrackingUrl,
          trackUrl,
        }),
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
