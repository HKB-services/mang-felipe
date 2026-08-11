import { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"

export type ListOrdersParams = {
  page: number
  perPage: number
  sort?: string | null
  search?: string | null
  status?: Array<"pending_review" | "confirmed" | "rejected" | "cancelled"> | null
  fulfillmentType?: Array<"pickup" | "delivery"> | null
  paymentChannel?: Array<"unionbank" | "gcash" | "bpi"> | null
  fulfillmentDate?: [number, number]
}

export type AdminOrderListItem = {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  status: "pending_review" | "confirmed" | "rejected" | "cancelled"
  fulfillmentType: "pickup" | "delivery"
  fulfillmentDate: string
  fulfillmentSlot: "slot_10_12" | "slot_14_16" | "slot_17_19"
  paymentChannel: "unionbank" | "gcash" | "bpi"
  subtotalPhp: number
  createdAt: string
}

const ORDER_BY_FIELDS = [
  "createdAt",
  "fulfillmentDate",
  "subtotalPhp",
  "status",
] as const

function getOrderBy(sort: string | null | undefined): Prisma.OrderOrderByWithRelationInput {
  const [field, direction] = sort?.split(".") ?? []

  if (
    !field ||
    !ORDER_BY_FIELDS.includes(field as (typeof ORDER_BY_FIELDS)[number]) ||
    (direction !== "asc" && direction !== "desc")
  ) {
    return { createdAt: "desc" }
  }

  return { [field]: direction } as Prisma.OrderOrderByWithRelationInput
}

function getFulfillmentDateFilter(range: [number, number] | undefined) {
  if (!range) return undefined

  const [start, end] = range
  const endDate = new Date(end)
  endDate.setHours(23, 59, 59, 999)

  return { gte: new Date(start), lte: endDate }
}

export async function listOrders(params: ListOrdersParams) {
  const search = params.search?.trim()
  const where: Prisma.OrderWhereInput = {
    ...(search
      ? {
          OR: [
            { orderNumber: { contains: search, mode: "insensitive" } },
            { customerName: { contains: search, mode: "insensitive" } },
            { customerPhone: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(params.status?.length ? { status: { in: params.status } } : {}),
    ...(params.fulfillmentType?.length
      ? { fulfillmentType: { in: params.fulfillmentType } }
      : {}),
    ...(params.paymentChannel?.length
      ? { paymentChannel: { in: params.paymentChannel } }
      : {}),
    ...(params.fulfillmentDate
      ? { fulfillmentDate: getFulfillmentDateFilter(params.fulfillmentDate) }
      : {}),
  }

  const [total, orders] = await prisma.$transaction([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: getOrderBy(params.sort),
      skip: (params.page - 1) * params.perPage,
      take: params.perPage,
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        customerPhone: true,
        status: true,
        fulfillmentType: true,
        fulfillmentDate: true,
        fulfillmentSlot: true,
        paymentChannel: true,
        subtotalPhp: true,
        createdAt: true,
      },
    }),
  ])

  return {
    orders: orders.map((order): AdminOrderListItem => ({
      ...order,
      fulfillmentDate: order.fulfillmentDate.toISOString(),
      createdAt: order.createdAt.toISOString(),
    })),
    pageCount: Math.max(1, Math.ceil(total / params.perPage)),
  }
}
