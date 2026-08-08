import { getFiuuConfig, md5Hex } from "@/features/payments/server/fiuu"

export type FiuuNotifyPayload = {
  tranID?: string
  orderid?: string
  status?: string
  domain?: string
  amount?: string
  currency?: string
  paydate?: string
  appcode?: string
  skey?: string
  [key: string]: string | undefined
}

function field(payload: FiuuNotifyPayload, key: keyof FiuuNotifyPayload) {
  return payload[key] ?? ""
}

export function verifyFiuuNotifySkey(payload: FiuuNotifyPayload): boolean {
  const { secretKey } = getFiuuConfig()
  const preSkey = md5Hex(
    [
      field(payload, "tranID"),
      field(payload, "orderid"),
      field(payload, "status"),
      field(payload, "domain"),
      field(payload, "amount"),
      field(payload, "currency"),
    ].join("")
  )
  const expected = md5Hex(
    [
      field(payload, "paydate"),
      field(payload, "domain"),
      preSkey,
      field(payload, "appcode"),
      secretKey,
    ].join("")
  )
  return expected === field(payload, "skey")
}

export function isFiuuPaymentSuccess(status: string | undefined) {
  return status === "00"
}
