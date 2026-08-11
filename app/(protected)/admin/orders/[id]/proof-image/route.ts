import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getObjectBytes } from "@/lib/storage/r2.server"
import { getServerSession } from "@/features/auth/server/session.server"
import { ROLES } from "@/features/admin/users/schema/user.schema"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(_request: Request, { params }: RouteContext<"/admin/orders/[id]/proof-image">) {
  const session = await getServerSession()
  if (!session?.user.roles?.includes(ROLES.SUPER_ADMIN)) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    select: { paymentProofKey: true },
  })

  if (!order?.paymentProofKey) {
    return new NextResponse("Payment proof not found", { status: 404 })
  }

  try {
    const object = await getObjectBytes(order.paymentProofKey)
    const body = new Uint8Array(object.bytes.byteLength)
    body.set(object.bytes)
    return new NextResponse(body.buffer, {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Type": object.contentType,
      },
    })
  } catch {
    return new NextResponse("Payment proof not found", { status: 404 })
  }
}
