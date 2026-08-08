"use client"

import { createWorker, type Worker } from "tesseract.js"
import {
  parsePaymentProofText,
  type PaymentProofOcrResult,
} from "@/features/payments/utils/parse-payment-ocr"

export type PaymentProofImageSource = File | Blob | string

let sharedWorker: Worker | null = null

async function getOcrWorker(): Promise<Worker> {
  if (sharedWorker) return sharedWorker
  sharedWorker = await createWorker("eng")
  return sharedWorker
}

/**
 * Client-side OCR for manual payment screenshots (GCash / bank apps).
 * Returns parsed amount / ref / channel hints for checkout UI + admin assist.
 */
export async function extractPaymentProofDetails(
  source: PaymentProofImageSource
): Promise<PaymentProofOcrResult> {
  const worker = await getOcrWorker()
  const { data } = await worker.recognize(source)
  return parsePaymentProofText(data.text ?? "")
}

export async function terminatePaymentProofOcr() {
  if (!sharedWorker) return
  await sharedWorker.terminate()
  sharedWorker = null
}
