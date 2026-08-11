import { notFound } from "next/navigation"
import { BackButton } from "@/components/BackButton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { resolveObjectReadUrl } from "@/lib/storage/r2.server"
import { FULFILLMENT_SLOTS, FULFILLMENT_TYPES, PAYMENT_CHANNELS } from "@/constants/payment"
import { formatFulfillmentDate, formatPhp } from "@/features/orders/utils/format"
import { LalamoveTrackingForm } from "@/features/orders/components/LalamoveTrackingForm"
import { AdminOrderBreadcrumbLabel } from "../components/AdminOrderBreadcrumbLabel"
import { AdminPaymentProofReview } from "../components/AdminPaymentProofReview"
import { orderStatusLabel, orderStatusVariant } from "../utils/order-status"

export default async function AdminOrderDetail({ orderId }: { orderId: string }) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      customerName: true,
      customerPhone: true,
      customerEmail: true,
      fulfillmentType: true,
      fulfillmentDate: true,
      fulfillmentSlot: true,
      deliveryAddress: true,
      paymentChannel: true,
      paymentProofKey: true,
      paymentProofUploadedAt: true,
      subtotalPhp: true,
      lalamoveTrackingUrl: true,
      items: {
        select: {
          id: true,
          itemName: true,
          variantLabel: true,
          quantity: true,
          lineTotalPhp: true,
        },
      },
    },
  })

  if (!order) notFound()
  const paymentProofUrl = order.paymentProofKey
    ? await resolveObjectReadUrl(order.paymentProofKey).catch(() => null)
    : null

  return (
    <div className="flex w-full flex-col gap-6">
      <AdminOrderBreadcrumbLabel orderId={order.id} orderNumber={order.orderNumber} />
      <BackButton
        path="/admin/orders"
        variant="ghost"
        label="Back to orders"
        className="text-muted-foreground"
      />
      <Card>
        <CardHeader>
          <CardTitle>Order {order.orderNumber}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Status:</span>
            <Badge variant={orderStatusVariant[order.status]}>
              {orderStatusLabel[order.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Customer
              </p>
              <p className="font-semibold">{order.customerName}</p>
              <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
              <p className="text-sm text-muted-foreground">
                {order.customerEmail ?? "No email on file"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {FULFILLMENT_TYPES[order.fulfillmentType].label}
              </p>
              <p className="font-semibold">{formatFulfillmentDate(order.fulfillmentDate)}</p>
              <p className="text-sm text-muted-foreground">
                {FULFILLMENT_SLOTS[order.fulfillmentSlot].label}
              </p>
              {order.fulfillmentType === "delivery" && order.deliveryAddress && (
                <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Items
            </p>
            <ul className="flex flex-col gap-1 text-sm">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-4">
                  <span>
                    {item.itemName} ({item.variantLabel}) × {item.quantity}
                  </span>
                  <span>{formatPhp(item.lineTotalPhp)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between border-t pt-3 text-sm">
            <span className="text-muted-foreground">
              Paid via {PAYMENT_CHANNELS[order.paymentChannel].label}
            </span>
            <span className="font-semibold">{formatPhp(order.subtotalPhp)}</span>
          </div>
        </CardContent>
      </Card>

      <AdminPaymentProofReview
        expectedSubtotalPhp={order.subtotalPhp}
        paymentChannel={order.paymentChannel}
        proofOcrUrl={
          order.paymentProofKey ? `/admin/orders/${order.id}/proof-image` : null
        }
        proofUrl={paymentProofUrl}
        uploadedAt={order.paymentProofUploadedAt?.toISOString() ?? null}
      />

      <Card>
        <CardHeader>
          <CardTitle>Delivery tracking</CardTitle>
          <p className="text-sm text-muted-foreground">
            Paste the Lalamove share link to save it and notify the customer.
          </p>
        </CardHeader>
        <CardContent>
          <LalamoveTrackingForm
            orderId={order.id}
            currentUrl={order.lalamoveTrackingUrl}
            hasCustomerEmail={Boolean(order.customerEmail)}
          />
        </CardContent>
      </Card>
    </div>
  )
}
