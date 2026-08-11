"use client"

import { IconTicket } from "@tabler/icons-react"
import { TextFormField } from "@/components/forms/TextFormField"
import { Button } from "@/components/ui/button"
import { stringFieldProps } from "@/lib/form-utils"
import { useTrackOrderForm } from "@/features/track-order/hooks/use-track-order-form"
import type { TrackOrderResult } from "@/features/track-order/schema/track-order.schema"

const SCALLOP_EDGE =
  "[mask-image:radial-gradient(circle_at_14px_0,transparent_11px,black_11.5px)] [-webkit-mask-image:radial-gradient(circle_at_14px_0,transparent_11px,black_11.5px)] [mask-repeat:repeat-x] [-webkit-mask-repeat:repeat-x] [mask-size:28px_100%] [-webkit-mask-size:28px_100%] [mask-position:top] [-webkit-mask-position:top]"

export function TrackOrderForm({
  initialOrderNumber,
  onResult,
}: {
  initialOrderNumber?: string
  onResult: (order: TrackOrderResult) => void
}) {
  const { form, loading } = useTrackOrderForm({ initialOrderNumber, onResult })

  return (
    <div className={`mf-surface mf-ink relative border shadow-lg ${SCALLOP_EDGE}`}>
      <div className="flex items-center justify-between px-6 pt-7 sm:px-8">
        <p className="mf-accent font-mono text-[0.65rem] font-medium tracking-[0.2em] uppercase">
          Order lookup
        </p>
        <IconTicket className="mf-muted size-5" aria-hidden />
      </div>

      <form
        action={() => form.handleSubmit()}
        className="flex flex-col gap-4 px-6 pt-4 pb-7 sm:px-8"
      >
        <form.Field name="orderNumber">
          {(field) => (
            <TextFormField
              label="Order number"
              placeholder="HM-20260811-A1B2"
              {...stringFieldProps(field)}
            />
          )}
        </form.Field>
        <form.Field name="customerPhone">
          {(field) => (
            <TextFormField
              label="Phone number"
              placeholder="Used at checkout"
              {...stringFieldProps(field)}
            />
          )}
        </form.Field>

        <div className="mt-1 border-t border-dashed border-[var(--mf-border)] pt-5">
          <Button type="submit" isLoading={loading} className="w-full">
            Track order
          </Button>
        </div>
      </form>
    </div>
  )
}
