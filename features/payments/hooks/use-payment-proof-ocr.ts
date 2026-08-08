"use client"

import { useCallback, useEffect, useState } from "react"
import {
  extractPaymentProofDetails,
  terminatePaymentProofOcr,
  type PaymentProofImageSource,
} from "@/features/payments/utils/extract-payment-proof"
import type { PaymentProofOcrResult } from "@/features/payments/utils/parse-payment-ocr"
import { isManualPaymentEnabled } from "@/constants/payment"

export function usePaymentProofOcr() {
  const [isReading, setIsReading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PaymentProofOcrResult | null>(null)

  const reset = useCallback(() => {
    setError(null)
    setResult(null)
  }, [])

  const analyze = useCallback(async (source: PaymentProofImageSource) => {
    if (!isManualPaymentEnabled()) {
      setError("Manual payment OCR is disabled while Fiuu is enabled.")
      return null
    }

    setIsReading(true)
    setError(null)
    try {
      const next = await extractPaymentProofDetails(source)
      setResult(next)
      return next
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to read payment screenshot"
      setError(message)
      setResult(null)
      return null
    } finally {
      setIsReading(false)
    }
  }, [])

  useEffect(() => {
    return () => {
      void terminatePaymentProofOcr()
    }
  }, [])

  return {
    enabled: isManualPaymentEnabled(),
    isReading,
    error,
    result,
    analyze,
    reset,
  }
}
