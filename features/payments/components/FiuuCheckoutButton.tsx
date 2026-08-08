"use client"

import { createFiuuPaymentAction } from "@/features/payments/actions/create-fiuu-payment.action"
import { isFiuuPaymentEnabled } from "@/constants/payment"

type FiuuCheckoutButtonProps = {
  orderNumber: string
  className?: string
  label?: string
}

/**
 * Posts hidden form to Fiuu hosted payment page.
 * No-op UI when ENABLE_FIUU_PAYMENT is false.
 */
export function FiuuCheckoutButton({
  orderNumber,
  className,
  label = "Pay with Fiuu",
}: FiuuCheckoutButtonProps) {
  if (!isFiuuPaymentEnabled()) {
    return null
  }

  async function handleCheckout() {
    const result = await createFiuuPaymentAction({ orderNumber })
    if (!result?.data?.success) {
      console.error(result?.serverError ?? "Fiuu checkout failed")
      return
    }

    const form = document.createElement("form")
    form.method = "POST"
    form.action = result.data.paymentUrl

    for (const [key, value] of Object.entries(result.data.fields)) {
      const input = document.createElement("input")
      input.type = "hidden"
      input.name = key
      input.value = String(value)
      form.appendChild(input)
    }

    document.body.appendChild(form)
    form.submit()
  }

  return (
    <button type="button" className={className} onClick={handleCheckout}>
      {label}
    </button>
  )
}
