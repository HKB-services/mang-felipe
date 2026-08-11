import { render } from "react-email"
import { APP_DETAILS } from "@/constants/app.details"
import { ROUTES } from "@/constants/app.routes"
import { env } from "@/config/env"
import {
  FULFILLMENT_SLOTS,
  FULFILLMENT_TYPES,
  type FulfillmentSlotId,
  type FulfillmentTypeId,
} from "@/constants/payment"
import { DeliveryTrackingEmail } from "@/emails/delivery-tracking"
import { OrderReceiptEmail } from "@/emails/order-receipt"
import { sendEmail } from "@/services/email.service"
import { formatFulfillmentDate, formatPhp } from "@/features/orders/utils/format"

type EmailSendResult =
  | Awaited<ReturnType<typeof sendEmail>>
  | { success: false; message: string }

type OrderReceiptInput = {
  customerEmail: string
  customerName: string
  orderNumber: string
  subtotalPhp: number
  fulfillmentDate: Date
  fulfillmentSlot: FulfillmentSlotId
  fulfillmentType: FulfillmentTypeId
}

type DeliveryTrackingInput = {
  customerEmail: string
  orderNumber: string
  fulfillmentDate: Date
  fulfillmentSlot: FulfillmentSlotId
  lalamoveTrackingUrl: string
}

function appUrl(path: string) {
  return new URL(path, env.NEXT_PUBLIC_APP_URL).toString()
}

function logoUrl() {
  return appUrl(APP_DETAILS.logo)
}

function trackUrl(orderNumber: string) {
  return appUrl(`${ROUTES.TRACK}?order=${encodeURIComponent(orderNumber)}`)
}

function fulfillmentSummary({
  fulfillmentDate,
  fulfillmentSlot,
  fulfillmentType,
}: {
  fulfillmentDate: Date
  fulfillmentSlot: FulfillmentSlotId
  fulfillmentType?: FulfillmentTypeId
}) {
  const date = formatFulfillmentDate(fulfillmentDate)
  const slot = FULFILLMENT_SLOTS[fulfillmentSlot].label
  if (!fulfillmentType) return `${date} · ${slot}`
  return `${FULFILLMENT_TYPES[fulfillmentType].label} · ${date} · ${slot}`
}

export async function sendOrderReceiptEmail(
  input: OrderReceiptInput
): Promise<EmailSendResult> {
  try {
    const htmlContent = await render(
      <OrderReceiptEmail
        customerName={input.customerName}
        fulfillmentSummary={fulfillmentSummary(input)}
        logoUrl={logoUrl()}
        orderNumber={input.orderNumber}
        orderUrl={appUrl(`/orders/${encodeURIComponent(input.orderNumber)}`)}
        subtotal={formatPhp(input.subtotalPhp)}
        trackUrl={trackUrl(input.orderNumber)}
      />
    )

    return sendEmail({
      htmlContent,
      recipients: [input.customerEmail],
      subject: `Your Mang Felipe order ${input.orderNumber}`,
    })
  } catch {
    return {
      success: false,
      message: "Failed to render order receipt email",
    }
  }
}

export async function sendDeliveryTrackingEmail(
  input: DeliveryTrackingInput
): Promise<EmailSendResult> {
  try {
    const htmlContent = await render(
      <DeliveryTrackingEmail
        fulfillmentSummary={fulfillmentSummary(input)}
        lalamoveTrackingUrl={input.lalamoveTrackingUrl}
        logoUrl={logoUrl()}
        orderNumber={input.orderNumber}
        trackUrl={trackUrl(input.orderNumber)}
      />
    )

    return sendEmail({
      htmlContent,
      recipients: [input.customerEmail],
      subject: `Your Mang Felipe order ${input.orderNumber} — delivery tracking`,
    })
  } catch {
    return {
      success: false,
      message: "Failed to render delivery tracking email",
    }
  }
}
