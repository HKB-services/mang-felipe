import { IconTruckDelivery } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FULFILLMENT_SLOTS, FULFILLMENT_TYPES, PAYMENT_CHANNELS } from "@/constants/payment"
import { formatFulfillmentDate, formatPhp } from "@/features/orders/utils/format"
import { STATUS_COPY } from "@/features/track-order/utils/status-copy"
import type { TrackOrderResult as TrackOrderResultData } from "@/features/track-order/schema/track-order.schema"

const STAMP_LABEL: Record<TrackOrderResultData["status"], string> = {
  pending_review: "Pending",
  confirmed: "Confirmed",
  rejected: "Not accepted",
  cancelled: "Cancelled",
}

const STAMP_STYLE: Record<TrackOrderResultData["status"], string> = {
  pending_review: "border-[var(--mf-notice-ink)] text-[var(--mf-notice-ink)]",
  confirmed: "border-primary text-primary",
  rejected: "border-[var(--mf-accent)] text-[var(--mf-accent)]",
  cancelled: "mf-muted border-[var(--mf-border)]",
}

export function TrackOrderResult({ order }: { order: TrackOrderResultData }) {
  return (
    <div className="mf-surface mf-ink flex flex-col gap-6 border p-6 shadow-lg sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mf-accent font-mono text-[0.65rem] font-medium tracking-[0.2em] uppercase">
            Order {order.orderNumber}
          </p>
          <p className="mt-1 text-sm leading-6">{STATUS_COPY[order.status]}</p>
        </div>
        <span
          className={cn(
            "shrink-0 -rotate-3 rounded-md border px-2.5 py-1 font-mono text-[0.65rem] font-bold tracking-[0.14em] uppercase",
            STAMP_STYLE[order.status]
          )}
        >
          {STAMP_LABEL[order.status]}
        </span>
      </div>

      <div className="grid gap-4 border-t border-dashed border-[var(--mf-border)] pt-5 sm:grid-cols-2">
        <div>
          <p className="mf-muted text-xs font-semibold tracking-wide uppercase">
            {FULFILLMENT_TYPES[order.fulfillmentType].label}
          </p>
          <p className="mt-1 font-medium">{formatFulfillmentDate(order.fulfillmentDate)}</p>
          <p className="mf-muted text-sm">{FULFILLMENT_SLOTS[order.fulfillmentSlot].label}</p>
        </div>
        {order.fulfillmentType === "delivery" && order.deliveryAddress && (
          <div>
            <p className="mf-muted text-xs font-semibold tracking-wide uppercase">
              Delivery address
            </p>
            <p className="mt-1 text-sm">{order.deliveryAddress}</p>
          </div>
        )}
      </div>

      <div className="border-t border-dashed border-[var(--mf-border)] pt-5">
        <p className="mf-muted text-xs font-semibold tracking-wide uppercase">Items</p>
        <ul className="mt-3 flex flex-col gap-2 font-mono text-sm">
          {order.items.map((item, index) => (
            <li key={index} className="flex items-baseline gap-2">
              <span className="shrink-0">
                {item.quantity}× {item.itemName} ({item.variantLabel})
              </span>
              <span className="mb-1 flex-1 border-b border-dotted border-[var(--mf-border)]" />
              <span className="shrink-0">{formatPhp(item.lineTotalPhp)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-dashed border-[var(--mf-border)] pt-4 text-sm">
          <span className="mf-muted">Paid via {PAYMENT_CHANNELS[order.paymentChannel].label}</span>
          <span className="font-mono font-semibold">{formatPhp(order.subtotalPhp)}</span>
        </div>
      </div>

      {order.lalamoveTrackingUrl ? (
        <div className="flex items-center gap-4 border-t border-dashed border-[var(--mf-border)] pt-5">
          <IconTruckDelivery className="mf-accent size-6 shrink-0" aria-hidden />
          <div className="flex-1">
            <p className="mf-accent font-mono text-[0.65rem] font-medium tracking-[0.2em] uppercase">
              Rider tracking
            </p>
            <p className="mf-muted mt-0.5 text-sm">Live via Lalamove</p>
          </div>
          <Button
            render={
              <a href={order.lalamoveTrackingUrl} target="_blank" rel="noreferrer" />
            }
            nativeButton={false}
          >
            Open tracking
          </Button>
        </div>
      ) : (
        <p className="mf-notice rounded-lg px-4 py-3 text-sm leading-6">
          Tracking link not available yet — we will email you when the rider
          is assigned.
        </p>
      )}
    </div>
  )
}
