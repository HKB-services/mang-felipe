"use server"

import { z } from "zod"
import { buildObjectKey, createPresignedUploadUrl } from "@/lib/storage/r2.server"
import { PAYMENT_PROOF_ACCEPTED_TYPES, PAYMENT_PROOF_MAX_BYTES } from "@/features/orders/utils/payment-proof"

const PaymentProofUploadSchema = z.object({
  contentType: z.enum(PAYMENT_PROOF_ACCEPTED_TYPES),
  contentLength: z.number().int().positive().max(PAYMENT_PROOF_MAX_BYTES),
  extension: z.string().min(1).max(10),
})

/**
 * Public, purpose-limited upload intent. The returned object key is accepted only
 * by order creation after a server-side HEAD check.
 */
export async function createPaymentProofUploadIntent(input: unknown) {
  const parsed = PaymentProofUploadSchema.parse(input)
  const key = buildObjectKey({
    folder: "orders/payment-proofs",
    userId: "guest",
    extension: parsed.extension,
  })

  return createPresignedUploadUrl({
    key,
    contentType: parsed.contentType,
    contentLength: parsed.contentLength,
  })
}
