"use server"

import { customAlphabet } from "nanoid"
import { z } from "zod"
import { OrderCheckoutFormSchema } from "@/features/orders/schema/order-checkout.schema"
import { objectExists } from "@/lib/storage/r2.server"
import { prisma } from "@/lib/prisma"
import { sendOrderReceiptEmail } from "@/features/orders/server/send-order-emails"

const orderSuffix = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 4)
const proofPrefix = "orders/payment-proofs/guest/"

const CreateOrderSchema = OrderCheckoutFormSchema.safeExtend({
  paymentProofKey: z.string().trim().min(1, "Payment proof is required"),
})

function makeOrderNumber(now = new Date()) {
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("")
  return `HM-${date}-${orderSuffix()}`
}

export async function createOrder(input: unknown) {
  const parsed = CreateOrderSchema.safeParse(input)
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Check your order details")
  }

  const data = parsed.data
  if (!data.paymentProofKey.startsWith(proofPrefix)) {
    throw new Error("Invalid payment proof")
  }
  if (!(await objectExists(data.paymentProofKey))) {
    throw new Error("Payment proof upload was not found. Upload it again.")
  }

  const variants = await prisma.menuItemVariant.findMany({
    where: {
      id: { in: data.items.map((item) => item.variantId) },
      isActive: true,
      menuItem: { isActive: true, category: { isActive: true } },
    },
    include: { menuItem: true },
  })
  const byId = new Map(variants.map((variant) => [variant.id, variant]))
  if (byId.size !== data.items.length) {
    throw new Error("One or more selected menu items are no longer available")
  }

  const orderNumber = makeOrderNumber()
  const orderItems = data.items.map((item) => {
    const variant = byId.get(item.variantId)
    if (!variant) throw new Error("Selected menu item is unavailable")
    const lineTotalPhp = variant.pricePhp * item.quantity
    return {
      menuItemId: variant.menuItemId,
      variantId: variant.id,
      itemName: variant.menuItem.name,
      variantLabel: variant.label,
      portionLabel: variant.portionLabel,
      unitPricePhp: variant.pricePhp,
      quantity: item.quantity,
      lineTotalPhp,
      notes: item.notes ?? null,
    }
  })
  const subtotalPhp = orderItems.reduce((total, item) => total + item.lineTotalPhp, 0)

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName: data.customerName,
      customerPhone: data.customerPhone.replace(/[\s-]/g, ""),
      customerEmail: data.customerEmail,
      fulfillmentType: data.fulfillmentType,
      fulfillmentDate: data.fulfillmentDate,
      fulfillmentSlot: data.fulfillmentSlot,
      deliveryAddress: data.deliveryAddress?.trim() || null,
      deliveryNotes: data.deliveryNotes?.trim() || null,
      paymentChannel: data.paymentChannel,
      paymentProofKey: data.paymentProofKey,
      paymentProofUploadedAt: new Date(),
      subtotalPhp,
      items: { create: orderItems },
    },
    select: { orderNumber: true },
  })

  if (data.customerEmail) {
    void sendOrderReceiptEmail({
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      fulfillmentDate: data.fulfillmentDate,
      fulfillmentSlot: data.fulfillmentSlot,
      fulfillmentType: data.fulfillmentType,
      orderNumber: order.orderNumber,
      subtotalPhp,
    })
  }

  return { orderNumber: order.orderNumber }
}
