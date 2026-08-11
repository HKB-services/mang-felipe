"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { IconArrowUpRight, IconChecklist, IconMenu2, IconRefresh, IconTruckDelivery } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FULFILLMENT_SLOTS } from "@/constants/payment"
import { ROUTES } from "@/constants/app.routes"
import { formatFulfillmentDate, formatPhp } from "@/features/orders/utils/format"
import { getDashboardOverviewAction } from "../actions/get-dashboard-overview.action"
import UpcomingOrdersChart from "../components/UpcomingOrdersChart"

async function fetchDashboardOverview() {
  const result = await getDashboardOverviewAction()

  if (result.data?.success) {
    return result.data.overview
  }

  throw new Error(result.serverError ?? "Could not load dashboard data")
}

const DashboardPage = () => {
  const dashboardQuery = useQuery({
    queryKey: ["admin", "dashboard-overview"],
    queryFn: fetchDashboardOverview,
    retry: 1,
  })

  if (dashboardQuery.isLoading) {
    return <DashboardSkeleton />
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return <DashboardError onRetry={() => void dashboardQuery.refetch()} />
  }

  const overview = dashboardQuery.data

  return (
    <section className="flex w-full flex-col gap-6 py-1 sm:gap-8 sm:py-3">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Operations overview</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Today&rsquo;s service desk
          </h1>
          <p className="mt-2 text-muted-foreground">
            Review orders first, then keep the menu and delivery updates moving.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button render={<Link href={ROUTES.ADMIN_ORDERS} />} nativeButton={false}>
            Review orders
            <IconArrowUpRight className="size-4" aria-hidden />
          </Button>
          <Button
            variant="outline"
            render={<Link href={ROUTES.ADMIN_MENU} />}
            nativeButton={false}
          >
            Manage menu
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardMetric
          icon={IconChecklist}
          label="Pending review"
          value={overview.pendingReviewCount}
          description="Orders waiting for payment proof review"
        />
        <DashboardMetric
          icon={IconTruckDelivery}
          label="Upcoming confirmed"
          value={overview.upcomingCount}
          description="Fulfillments scheduled over next 7 days"
        />
        <DashboardMetric
          icon={IconMenu2}
          label="Active menu items"
          value={overview.activeMenuItemCount}
          description="Dishes currently available to order"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(22rem,1fr)]">
        <Card className="py-0 shadow-none">
          <CardHeader className="border-b py-5">
            <CardTitle>Confirmed fulfillment schedule</CardTitle>
            <p className="text-sm text-muted-foreground">Next 7 days</p>
          </CardHeader>
          <CardContent className="pt-5">
            <UpcomingOrdersChart data={overview.chartData} />
          </CardContent>
        </Card>

        <Card className="py-0 shadow-none">
          <CardHeader className="flex-row items-center justify-between border-b py-5">
            <div>
              <CardTitle>Next up</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Confirmed orders by fulfillment date
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              render={<Link href={ROUTES.ADMIN_ORDERS} />}
              nativeButton={false}
            >
              View all
            </Button>
          </CardHeader>
          <CardContent className="divide-y pt-1">
            {overview.upcomingOrders.length ? (
              overview.upcomingOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`${ROUTES.ADMIN_ORDERS}/${order.id}`}
                  className="flex items-center justify-between gap-4 py-4 transition-colors hover:text-primary"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{order.orderNumber}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {order.customerName} · {formatFulfillmentDate(new Date(order.fulfillmentDate))}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium">{formatPhp(order.subtotalPhp)}</p>
                    <p className="text-xs text-muted-foreground">
                      {FULFILLMENT_SLOTS[order.fulfillmentSlot].label}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No confirmed orders scheduled in the next 7 days.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function DashboardMetric({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: typeof IconChecklist
  label: string
  value: number
  description: string
}) {
  return (
    <Card className="py-0 shadow-none">
      <CardContent className="flex items-start justify-between gap-4 py-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
            {value}
          </p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden />
        </div>
      </CardContent>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <section className="flex w-full flex-col gap-6 py-1 sm:gap-8 sm:py-3">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Card key={index} className="h-40 py-0 shadow-none">
            <CardContent className="flex h-full items-start justify-between py-5">
              <div className="space-y-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-9 w-14" />
                <Skeleton className="h-4 w-44" />
              </div>
              <Skeleton className="size-10" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(22rem,1fr)]">
        <Card className="h-96 py-0 shadow-none">
          <CardContent className="space-y-5 py-5">
            <Skeleton className="h-5 w-60" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card className="h-96 py-0 shadow-none">
          <CardContent className="space-y-5 py-5">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function DashboardError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="py-0 shadow-none">
      <CardContent className="flex flex-col items-start gap-4 py-12">
        <div>
          <h1 className="font-semibold">Dashboard unavailable</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Dashboard data could not be loaded. Try again.
          </p>
        </div>
        <Button variant="outline" onClick={onRetry}>
          <IconRefresh className="size-4" aria-hidden />
          Retry
        </Button>
      </CardContent>
    </Card>
  )
}

export default DashboardPage
