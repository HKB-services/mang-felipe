import { prisma } from "@/lib/prisma"

const UPCOMING_DAYS = 7

function startOfDay(date: Date) {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

function formatDay(date: Date) {
  return new Intl.DateTimeFormat("en-PH", {
    weekday: "short",
    day: "numeric",
  }).format(date)
}

export async function getDashboardOverview() {
  const today = startOfDay(new Date())
  const endDate = new Date(today)
  endDate.setDate(endDate.getDate() + UPCOMING_DAYS)

  const [pendingReviewCount, activeMenuItemCount, upcomingOrders] =
    await Promise.all([
      prisma.order.count({ where: { status: "pending_review" } }),
      prisma.menuItem.count({ where: { isActive: true } }),
      prisma.order.findMany({
        where: {
          status: "confirmed",
          fulfillmentDate: { gte: today, lt: endDate },
        },
        orderBy: { fulfillmentDate: "asc" },
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          fulfillmentDate: true,
          fulfillmentSlot: true,
          subtotalPhp: true,
        },
      }),
    ])

  const chartData = Array.from({ length: UPCOMING_DAYS }, (_, index) => {
    const date = new Date(today)
    date.setDate(date.getDate() + index)
    const dateKey = date.toDateString()

    return {
      date: date.toISOString(),
      label: formatDay(date),
      orders: upcomingOrders.filter(
        (order) => startOfDay(order.fulfillmentDate).toDateString() === dateKey
      ).length,
    }
  })

  return {
    activeMenuItemCount,
    pendingReviewCount,
    upcomingCount: upcomingOrders.length,
    chartData,
    upcomingOrders: upcomingOrders.slice(0, 5).map((order) => ({
      ...order,
      fulfillmentDate: order.fulfillmentDate.toISOString(),
    })),
  }
}
