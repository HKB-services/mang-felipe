"use client"

import { useState } from "react"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "@tanstack/react-form"
import { sileo } from "sileo"
import { onActionError } from "@/lib/action-utils"
import { saveLalamoveTrackingAction } from "@/features/orders/actions/save-lalamove-tracking.action"

export function useLalamoveTrackingForm(opts: {
  orderId: string
  currentUrl: string | null
}) {
  const [savedUrl, setSavedUrl] = useState(opts.currentUrl)
  const { executeAsync, isExecuting } = useAction(saveLalamoveTrackingAction, {
    onSuccess: ({ data }) => {
      if (!data?.success) return
      setSavedUrl(data.order.lalamoveTrackingUrl)
      sileo.success({ title: "Tracking link saved" })
      if (data.emailWarning) {
        sileo.error({ title: data.emailWarning })
      }
    },
    onError: onActionError,
  })

  const form = useForm({
    defaultValues: {
      orderId: opts.orderId,
      lalamoveTrackingUrl: opts.currentUrl ?? "",
      resendEmail: false,
    },
    onSubmit: async ({ value }) => {
      await executeAsync(value)
    },
  })

  const loading = isExecuting || form.state.isSubmitting

  return { form, loading, savedUrl }
}
