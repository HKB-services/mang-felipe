import { z } from "zod"
import {
  PAYMENT_CHANNELS,
  PAYMENT_CHANNEL_LIST,
  type PaymentChannelId,
} from "@/constants/payment"

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
  /(?:ref(?:erence)?|transaction|trace)\s*(?:no\.?|number|#|id)?\s*[:\-]?\s*([A-Z0-9\-]+)/i,
  /(?:txn|tx)\s*(?:id|no\.?|number|#)?\s*[:\-]?\s*([A-Z0-9\-]+)/i,
]

const CHANNEL_HINTS: Array<{ id: PaymentChannelId; needles: string[] }> = [
  { id: "gcash", needles: ["gcash", "g-cash"] },
  { id: "unionbank", needles: ["unionbank", "union bank"] },
  { id: "bpi", needles: ["bpi", "bank of the philippine islands"] },
]

function firstMatch(text: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match?.[1]) return match[1]
  }
  return null
}

function parseAmountPhp(text: string): number | null {
  const raw = firstMatch(text, AMOUNT_PATTERNS)
  if (!raw) return null
  const value = Number(raw.replace(/,/g, ""))
  return Number.isFinite(value) && value > 0 ? value : null
}

function parseReference(text: string): string | null {
  const raw = firstMatch(text, REFERENCE_PATTERNS)
  return raw?.trim() ?? null
}

function detectChannel(text: string): PaymentChannelId | null {
  const lower = text.toLowerCase()
  const hit = CHANNEL_HINTS.find((entry) =>
    entry.needles.some((needle) => lower.includes(needle))
  )
  return hit?.id ?? null
}

function matchAccountHint(
  text: string,
  channel: PaymentChannelId | null
): string | null {
  const digits = text.replace(/\D/g, "")
  const lower = text.toLowerCase()
  const channels = channel ? [PAYMENT_CHANNELS[channel]] : PAYMENT_CHANNEL_LIST

  for (const entry of channels) {
    const expected = entry.accountDetail.replace(/\D/g, "")
    if (expected.length >= 6 && digits.includes(expected)) {
      return `${entry.label} ${entry.accountDetailLabel}: ${entry.accountDetail}`
    }
    if (lower.includes(entry.accountName.toLowerCase())) {
      return `Account name matches ${entry.label}: ${entry.accountName}`
    }
  }
  return null
}

function scoreOcrConfidence(parts: {
  amount: boolean
  reference: boolean
  channel: boolean
  account: boolean
}) {
  return Math.min(
    1,
    0.2 +
      (parts.amount ? 0.3 : 0) +
      (parts.reference ? 0.25 : 0) +
      (parts.channel ? 0.15 : 0) +
      (parts.account ? 0.1 : 0)
  )
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

  return {
    rawText: normalized,
    detectedAmountPhp,
    detectedReference,
    detectedChannel,
    matchedAccountHint,
    confidence: scoreOcrConfidence({
      amount: Boolean(detectedAmountPhp),
      reference: Boolean(detectedReference),
      channel: Boolean(detectedChannel),
      account: Boolean(matchedAccountHint),
    }),
  }
}
