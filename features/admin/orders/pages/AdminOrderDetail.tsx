import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { FULFILLMENT_SLOTS, FULFILLMENT_TYPES, PAYMENT_CHANNELS } from "@/constants/payment"
import { formatFulfillmentDate, formatPhp } from "@/features/orders/utils/format"
import { LalamoveTrackingForm } from "@/features/orders/components/LalamoveTrackingForm"

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
      subtotalPhp: true,
      lalamoveTrackingUrl: true,
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

  if (!order) notFound()

  return (
    <div className="flex w-full flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Order {order.orderNumber}</CardTitle>
          <p className="text-sm text-muted-foreground">Status: {order.status}</p>
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
              {order.items.map((item, index) => (
                <li key={index} className="flex justify-between gap-4">
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
