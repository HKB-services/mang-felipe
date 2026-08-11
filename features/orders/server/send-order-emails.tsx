import { render } from "react-email";
import { ROUTES } from "@/constants/app.routes";
import { env } from "@/config/env";
import {
  FULFILLMENT_SLOTS,
  FULFILLMENT_TYPES,
  type FulfillmentSlotId,
  type FulfillmentTypeId,
} from "@/constants/payment";
import { DeliveryTrackingEmail } from "@/emails/delivery-tracking";
import { OrderReceiptEmail } from "@/emails/order-receipt";
import { OrderStatusUpdateEmail } from "@/emails/order-status-update";
import { sendEmail } from "@/services/email.service";
import {
  formatFulfillmentDate,
  formatPhp,
} from "@/features/orders/utils/format";

type EmailSendResult =
  | Awaited<ReturnType<typeof sendEmail>>
  | { success: false; message: string };

type OrderReceiptInput = {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  subtotalPhp: number;
  fulfillmentDate: Date;
  fulfillmentSlot: FulfillmentSlotId;
  fulfillmentType: FulfillmentTypeId;
};

type DeliveryTrackingInput = {
  customerEmail: string;
  orderNumber: string;
  fulfillmentDate: Date;
  fulfillmentSlot: FulfillmentSlotId;
  lalamoveTrackingUrl: string;
};

type OrderStatus = "pending_review" | "confirmed" | "rejected" | "cancelled";

type OrderStatusUpdateInput = {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  status: OrderStatus;
  fulfillmentDate: Date;
  fulfillmentSlot: FulfillmentSlotId;
  fulfillmentType: FulfillmentTypeId;
};

const ORDER_STATUS_EMAIL_COPY = {
  pending_review: {
    label: "Pending review",
    message:
      "Your order is back in pending review. Mang Felipe will review your payment and order details before confirmation.",
  },
  confirmed: {
    label: "Confirmed",
    message:
      "Good news — your order is confirmed. Please keep your order number handy.",
  },
  rejected: {
    label: "Rejected",
    message:
      "Your order was rejected after review. Please contact Mang Felipe if you need help placing a new order.",
  },
  cancelled: {
    label: "Cancelled",
    message:
      "Your order was cancelled. Please contact Mang Felipe if this was unexpected.",
  },
} satisfies Record<OrderStatus, { label: string; message: string }>;

function appUrl(path: string) {
  return new URL(path, env.NEXT_PUBLIC_APP_URL).toString();
}

function trackUrl(orderNumber: string) {
  return appUrl(`${ROUTES.TRACK}?order=${encodeURIComponent(orderNumber)}`);
}

function fulfillmentSummary({
  fulfillmentDate,
  fulfillmentSlot,
  fulfillmentType,
}: {
  fulfillmentDate: Date;
  fulfillmentSlot: FulfillmentSlotId;
  fulfillmentType?: FulfillmentTypeId;
}) {
  const date = formatFulfillmentDate(fulfillmentDate);
  const slot = FULFILLMENT_SLOTS[fulfillmentSlot].label;
  if (!fulfillmentType) return `${date} · ${slot}`;
  return `${FULFILLMENT_TYPES[fulfillmentType].label} · ${date} · ${slot}`;
}

export async function sendOrderReceiptEmail(
  input: OrderReceiptInput,
): Promise<EmailSendResult> {
  try {
    const htmlContent = await render(
      <OrderReceiptEmail
        customerName={input.customerName}
        fulfillmentSummary={fulfillmentSummary(input)}
        orderNumber={input.orderNumber}
        orderUrl={appUrl(`/orders/${encodeURIComponent(input.orderNumber)}`)}
        subtotal={formatPhp(input.subtotalPhp)}
        trackUrl={trackUrl(input.orderNumber)}
      />,
    );

    return sendEmail({
      htmlContent,
      recipients: [input.customerEmail],
      subject: `Your Mang Felipe order ${input.orderNumber}`,
    });
  } catch {
    return {
      success: false,
      message: "Failed to render order receipt email",
    };
  }
}

export async function sendDeliveryTrackingEmail(
  input: DeliveryTrackingInput,
): Promise<EmailSendResult> {
  try {
    const htmlContent = await render(
      <DeliveryTrackingEmail
        fulfillmentSummary={fulfillmentSummary(input)}
        lalamoveTrackingUrl={input.lalamoveTrackingUrl}
        orderNumber={input.orderNumber}
        trackUrl={trackUrl(input.orderNumber)}
      />,
    );

    return sendEmail({
      htmlContent,
      recipients: [input.customerEmail],
      subject: `Your Mang Felipe order ${input.orderNumber} — delivery tracking`,
    });
  } catch {
    return {
      success: false,
      message: "Failed to render delivery tracking email",
    };
  }
}

export async function sendOrderStatusUpdateEmail(
  input: OrderStatusUpdateInput,
): Promise<EmailSendResult> {
  const copy = ORDER_STATUS_EMAIL_COPY[input.status];

  try {
    const htmlContent = await render(
      <OrderStatusUpdateEmail
        customerName={input.customerName}
        fulfillmentSummary={fulfillmentSummary(input)}
        orderNumber={input.orderNumber}
        statusLabel={copy.label}
        statusMessage={copy.message}
        trackUrl={trackUrl(input.orderNumber)}
      />,
    );

    return sendEmail({
      htmlContent,
      recipients: [input.customerEmail],
      subject: `Your Mang Felipe order ${input.orderNumber} is ${copy.label.toLowerCase()}`,
    });
  } catch {
    return {
      success: false,
      message: "Failed to render order status update email",
    };
  }
}
