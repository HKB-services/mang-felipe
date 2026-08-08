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

export function verifyFiuuNotifySkey(payload: FiuuNotifyPayload): boolean {
  const { secretKey } = getFiuuConfig()

  const tranID = payload.tranID ?? ""
  const orderid = payload.orderid ?? ""
  const status = payload.status ?? ""
  const domain = payload.domain ?? ""
  const amount = payload.amount ?? ""
  const currency = payload.currency ?? ""
  const paydate = payload.paydate ?? ""
  const appcode = payload.appcode ?? ""
  const skey = payload.skey ?? ""

  const preSkey = md5Hex(
    tranID + orderid + status + domain + amount + currency
  )
  const expected = md5Hex(paydate + domain + preSkey + appcode + secretKey)
  return expected === skey
}

export function isFiuuPaymentSuccess(status: string | undefined) {
  return status === "00"
}
