import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isFiuuPaymentEnabled } from "@/constants/payment"
import {
  isFiuuPaymentSuccess,
  verifyFiuuNotifySkey,
  type FiuuNotifyPayload,
} from "@/features/payments/server/fiuu-verify"

export const runtime = "nodejs"

/**
 * Fiuu Notify URL — payment source of truth.
 * Register: `${APP_URL}/api/fiuu/notify`
 */
export async function POST(req: Request) {
  if (!isFiuuPaymentEnabled()) {
    return new NextResponse("Fiuu disabled", { status: 503 })
  }

  const formData = await req.formData()
  const payload = Object.fromEntries(
    formData.entries()
  ) as FiuuNotifyPayload

  if (!verifyFiuuNotifySkey(payload)) {
    return new NextResponse("Invalid Signature", { status: 400 })
  }

  const orderNumber = payload.orderid
  if (!orderNumber) {
    return new NextResponse("Missing orderid", { status: 400 })
  }

  if (isFiuuPaymentSuccess(payload.status)) {
    await prisma.order.updateMany({
      where: {
        orderNumber,
        status: { in: ["pending_review"] },
      },
      data: {
        status: "confirmed",
        reviewedAt: new Date(),
        adminNotes: [
          "Confirmed via Fiuu notify",
          payload.tranID ? `tranID=${payload.tranID}` : null,
          payload.appcode ? `appcode=${payload.appcode}` : null,
        ]
          .filter(Boolean)
          .join(" | "),
      },
    })
  }

  return new NextResponse("OK")
}
