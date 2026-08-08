import { z } from "zod"
import { PAYMENT_CHANNELS, PAYMENT_CHANNEL_LIST, type PaymentChannelId } from "@/constants/payment"

export const PaymentProofOcrSchema = z.object({
  rawText: z.string(),
  detectedAmountPhp: z.number().positive().nullable(),
  detectedReference: z.string().nullable(),
  detectedChannel: z.enum(["unionbank", "gcash", "bpi"]).nullable(),
  matchedAccountHint: z.string().nullable(),
  confidence: z.number().min(0).max(1),
})

export type PaymentProofOcrResult = z.infer<typeof PaymentProofOcrSchema>

const AMOUNT_PATTERNS = [
  /(?:php|₱|amount|total|paid|transfer(?:red)?)\s*[:\-]?\s*(?:php|₱)?\s*([\d,]+(?:\.\d{1,2})?)/i,
  /(?:php|₱)\s*([\d,]+(?:\.\d{1,2})?)/i,
]

const REFERENCE_PATTERNS = [
  /(?:ref(?:erence)?(?:\s*(?:no|number|#))?|txn(?:\s*id)?|transaction(?:\s*(?:id|no))?|trace(?:\s*no)?)\s*[:\-]?\s*([A-Z0-9\-]+)/i,
]

function parseAmountPhp(text: string): number | null {
  for (const pattern of AMOUNT_PATTERNS) {
    const match = text.match(pattern)
    if (!match?.[1]) continue
    const value = Number(match[1].replace(/,/g, ""))
    if (Number.isFinite(value) && value > 0) return value
  }
  return null
}

function parseReference(text: string): string | null {
  for (const pattern of REFERENCE_PATTERNS) {
    const match = text.match(pattern)
    if (match?.[1]) return match[1].trim()
  }
  return null
}

function detectChannel(text: string): PaymentChannelId | null {
  const lower = text.toLowerCase()
  if (lower.includes("gcash") || lower.includes("g-cash")) return "gcash"
  if (lower.includes("unionbank") || lower.includes("union bank")) {
    return "unionbank"
  }
  if (
    lower.includes("bpi") ||
    lower.includes("bank of the philippine islands")
  ) {
    return "bpi"
  }
  return null
}

function matchAccountHint(
  text: string,
  channel: PaymentChannelId | null
): string | null {
  const digits = text.replace(/\D/g, "")
  const channels = channel
    ? [PAYMENT_CHANNELS[channel]]
    : PAYMENT_CHANNEL_LIST

  for (const entry of channels) {
    const expected = entry.accountDetail.replace(/\D/g, "")
    if (expected.length >= 6 && digits.includes(expected)) {
      return `${entry.label} ${entry.accountDetailLabel}: ${entry.accountDetail}`
    }
    if (
      entry.accountName &&
      text.toLowerCase().includes(entry.accountName.toLowerCase())
    ) {
      return `Account name matches ${entry.label}: ${entry.accountName}`
    }
  }
  return null
}

/**
 * Parse OCR plain text from a payment screenshot into structured hints.
 * Assistive only — never auto-confirm payment from OCR alone.
 */
export function parsePaymentProofText(rawText: string): PaymentProofOcrResult {
  const normalized = rawText.replace(/\s+/g, " ").trim()
  const detectedChannel = detectChannel(normalized)
  const detectedAmountPhp = parseAmountPhp(normalized)
  const detectedReference = parseReference(normalized)
  const matchedAccountHint = matchAccountHint(normalized, detectedChannel)

  let confidence = 0.2
  if (detectedAmountPhp) confidence += 0.3
  if (detectedReference) confidence += 0.25
  if (detectedChannel) confidence += 0.15
  if (matchedAccountHint) confidence += 0.1

  return {
    rawText: normalized,
    detectedAmountPhp,
    detectedReference,
    detectedChannel,
    matchedAccountHint,
    confidence: Math.min(1, confidence),
  }
}
