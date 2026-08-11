"use client"

import { useAction } from "next-safe-action/hooks"
import { useForm } from "@tanstack/react-form"
import { onActionError } from "@/lib/action-utils"
import { trackOrderAction } from "@/features/track-order/actions/track-order.action"
import {
  TrackOrderLookupSchema,
  type TrackOrderResult,
} from "@/features/track-order/schema/track-order.schema"

export function useTrackOrderForm(opts: {
  initialOrderNumber?: string
  onResult: (order: TrackOrderResult) => void
}) {
  const { executeAsync, isExecuting } = useAction(trackOrderAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        opts.onResult(data.order)
      }
    },
    onError: onActionError,
  })

  const form = useForm({
    defaultValues: {
      orderNumber: opts.initialOrderNumber ?? "",
      customerPhone: "",
    },
    validators: {
      onSubmit: TrackOrderLookupSchema,
    },
    onSubmit: async ({ value }) => {
      await executeAsync(value)
    },
  })

  const loading = isExecuting || form.state.isSubmitting

  return { form, loading }
}
