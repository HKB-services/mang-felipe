"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryState, useQueryStates } from "nuqs"
import { IconClipboardList } from "@tabler/icons-react"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useDataTable } from "@/hooks/use-data-table"
import { listOrdersAction } from "../actions/admin-list-orders.action"
import { orderColumns } from "../components/admin-orders-columns"
import type { ListOrdersInput } from "../schema/admin-list-orders.schema"

const DEFAULT_PAGE_SIZE = 10
const SEPARATOR = ","

function useOrdersQuery() {
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(DEFAULT_PAGE_SIZE))
  const [sort] = useQueryState("sort", parseAsString)
  const [filters] = useQueryStates({
    customerName: parseAsString,
    status: parseAsArrayOf(parseAsString, SEPARATOR),
    fulfillmentDate: parseAsArrayOf(parseAsString, SEPARATOR),
    fulfillmentType: parseAsArrayOf(parseAsString, SEPARATOR),
    paymentChannel: parseAsArrayOf(parseAsString, SEPARATOR),
  })

  const params: ListOrdersInput = {
    page,
    perPage,
    sort,
    search: filters.customerName,
    status: filters.status as ListOrdersInput["status"],
    fulfillmentType: filters.fulfillmentType as ListOrdersInput["fulfillmentType"],
    paymentChannel: filters.paymentChannel as ListOrdersInput["paymentChannel"],
    fulfillmentDate:
      filters.fulfillmentDate?.length === 2
        ? [Number(filters.fulfillmentDate[0]), Number(filters.fulfillmentDate[1])]
        : undefined,
  }

  return useQuery({
    queryKey: ["admin", "orders", params],
    queryFn: async () => {
      const result = await listOrdersAction(params)
      if (result.data?.success) return result.data
      throw new Error(result.serverError ?? "Could not load orders")
    },
    placeholderData: keepPreviousData,
  })
}

const AdminOrdersList = () => {
  const ordersQuery = useOrdersQuery()
  const { table } = useDataTable({
    data: ordersQuery.data?.orders ?? [],
    columns: orderColumns,
    pageCount: ordersQuery.data?.pageCount ?? 1,
  })

  return (
    <section className="flex w-full flex-col gap-6 py-1 sm:gap-8 sm:py-3">
      <div>
        <Badge variant="secondary">Orders</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">All orders</h1>
        <p className="mt-2 text-muted-foreground">
          Review payment proofs and fulfillment details before confirming orders.
        </p>
      </div>

      {ordersQuery.isLoading ? (
        <DataTableSkeleton
          columnCount={orderColumns.length}
          filterCount={5}
          rowCount={DEFAULT_PAGE_SIZE}
        />
      ) : ordersQuery.isError ? (
        <Card className="py-0 shadow-none">
          <CardContent className="py-12 text-center">
            <p className="font-medium">Orders could not be loaded.</p>
            <button
              type="button"
              className="mt-2 text-sm text-primary underline-offset-4 hover:underline"
              onClick={() => void ordersQuery.refetch()}
            >
              Try again
            </button>
          </CardContent>
        </Card>
      ) : (
        <DataTable
          table={table}
          emptyState={
            <div className="flex flex-col items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <IconClipboardList className="size-5 text-muted-foreground" aria-hidden />
              </div>
              <div>
                <p className="font-medium">No orders found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Adjust filters or wait for a new guest order.
                </p>
              </div>
            </div>
          }
        >
          <DataTableToolbar table={table} />
        </DataTable>
      )}
    </section>
  )
}

export default AdminOrdersList
