import { createHash } from "node:crypto"
import { env } from "@/config/env"
import { isFiuuPaymentEnabled } from "@/constants/payment"

export function md5Hex(value: string) {
  return createHash("md5").update(value).digest("hex")
}

/** Fiuu amount format: always two decimal places. */
export function formatFiuuAmount(phpPesos: number) {
  if (!Number.isFinite(phpPesos) || phpPesos < 0) {
    throw new Error("Invalid Fiuu amount")
  }
  return phpPesos.toFixed(2)
}

export function getFiuuConfig() {
  if (!isFiuuPaymentEnabled()) {
    throw new Error("Fiuu payment is disabled. Set ENABLE_FIUU_PAYMENT = true.")
  }

  const merchantId = env.FIUU_MERCHANT_ID
  const verifyKey = env.FIUU_VERIFY_KEY
  const secretKey = env.FIUU_SECRET_KEY
  const payUrl = env.FIUU_PAY_URL
  const apiBaseUrl = env.FIUU_API_BASE_URL

  if (!merchantId || !verifyKey || !secretKey || !payUrl) {
    throw new Error("Fiuu env is incomplete (merchant / verify / secret / pay URL).")
  }

  return { merchantId, verifyKey, secretKey, payUrl, apiBaseUrl }
}

export function buildFiuuPaymentUrl(merchantId: string, payUrlBase: string) {
  const base = payUrlBase.replace(/\/$/, "")
  if (base.includes(merchantId)) return `${base}/`
  return `${base}/${merchantId}/`
}

export function buildFiuuVcode(input: {
  amount: string
  merchantId: string
  orderId: string
  verifyKey: string
  currency?: string
}) {
  const currency = input.currency ?? "PHP"
  return md5Hex(
    input.amount +
      input.merchantId +
      input.orderId +
      input.verifyKey +
      currency
  )
}

export type FiuuCheckoutFields = {
  merchant_id: string
  amount: string
  orderid: string
  currency: string
  bill_name: string
  bill_email: string
  bill_mobile: string
  vcode: string
}

export function buildFiuuCheckoutPayload(input: {
  orderNumber: string
  subtotalPhp: number
  customerName: string
  customerEmail: string
  customerPhone: string
}): { paymentUrl: string; fields: FiuuCheckoutFields } {
  const { merchantId, verifyKey, payUrl } = getFiuuConfig()
  const amount = formatFiuuAmount(input.subtotalPhp)
  const currency = "PHP"
  const vcode = buildFiuuVcode({
    amount,
    merchantId,
    orderId: input.orderNumber,
    verifyKey,
    currency,
  })

  return {
    paymentUrl: buildFiuuPaymentUrl(merchantId, payUrl),
    fields: {
      merchant_id: merchantId,
      amount,
      orderid: input.orderNumber,
      currency,
      bill_name: input.customerName,
      bill_email: input.customerEmail,
      bill_mobile: input.customerPhone,
      vcode,
    },
  }
}
