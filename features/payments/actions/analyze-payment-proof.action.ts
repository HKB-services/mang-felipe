"use server"

import { z } from "zod"
import { ActionError, actionClient } from "@/lib/safe.action"
import { isManualPaymentEnabled } from "@/constants/payment"
import {
  parsePaymentProofText,
  PaymentProofOcrSchema,
} from "@/features/payments/utils/parse-payment-ocr"

const AnalyzePaymentProofTextSchema = z.object({
  rawText: z.string().trim().min(1).max(20_000),
})

/**
 * Server-side parse of OCR text (client runs tesseract, then can call this
 * for a shared Zod-validated shape). Does not auto-confirm payment.
 */
export const analyzePaymentProofTextAction = actionClient
  .metadata({ actionName: "analyzePaymentProofText" })
  .inputSchema(AnalyzePaymentProofTextSchema)
  .action(async ({ parsedInput }) => {
    if (!isManualPaymentEnabled()) {
      throw new ActionError(
        "Manual payment is disabled while Fiuu is enabled."
      )
    }

    const result = parsePaymentProofText(parsedInput.rawText)
    return {
      success: true as const,
      ocr: PaymentProofOcrSchema.parse(result),
    }
  })
