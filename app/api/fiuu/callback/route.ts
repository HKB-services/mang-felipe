import { NextResponse } from "next/server"
import { env } from "@/config/env"
import { isFiuuPaymentEnabled } from "@/constants/payment"

export const runtime = "nodejs"

/**
 * Fiuu browser return / callback.
 * Prefer notify for payment truth; this only redirects the customer.
 * Register: `${APP_URL}/api/fiuu/callback`
 */
export async function GET(req: Request) {
  return handleCallback(req)
}

export async function POST(req: Request) {
  return handleCallback(req)
}

async function handleCallback(req: Request) {
  const appUrl = env.APP_URL.replace(/\/$/, "")

  if (!isFiuuPaymentEnabled()) {
    return NextResponse.redirect(`${appUrl}/`)
  }

  let orderNumber: string | null = null

  if (req.method === "POST") {
    const formData = await req.formData()
    const value = formData.get("orderid")
    orderNumber = typeof value === "string" ? value : null
  } else {
    orderNumber = new URL(req.url).searchParams.get("orderid")
  }

  if (orderNumber) {
    return NextResponse.redirect(
      `${appUrl}/orders/${encodeURIComponent(orderNumber)}`
    )
  }

  return NextResponse.redirect(`${appUrl}/`)
}
