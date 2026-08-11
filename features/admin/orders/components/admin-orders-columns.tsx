"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { ROUTES } from "@/constants/app.routes"
import { FULFILLMENT_SLOTS, FULFILLMENT_TYPES, PAYMENT_CHANNELS } from "@/constants/payment"
import { formatFulfillmentDate, formatPhp } from "@/features/orders/utils/format"
import { AdminOrderRowActions } from "./AdminOrderRowActions"
import { orderStatusLabel, orderStatusVariant } from "../utils/order-status"
import type { AdminOrderListItem } from "../server/admin-list-orders"

export const orderColumns: Array<ColumnDef<AdminOrderListItem>> = [
  {
    id: "orderNumber",
    accessorKey: "orderNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Order" />
    ),
    cell: ({ row }) => (
      <Link
        href={`${ROUTES.ADMIN_ORDERS}/${row.original.id}`}
        className="font-medium hover:text-primary hover:underline"
      >
        {row.original.orderNumber}
      </Link>
    ),
  },
  {
    id: "customerName",
    accessorKey: "customerName",
    enableColumnFilter: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Customer" />
    ),
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.customerName}</p>
        <p className="text-sm text-muted-foreground">{row.original.customerPhone}</p>
      </div>
    ),
    meta: {
      label: "Search",
      placeholder: "Order number, customer, phone…",
      variant: "text",
    },
  },
  {
    id: "status",
    accessorKey: "status",
    enableColumnFilter: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      return <Badge variant={orderStatusVariant[status]}>{orderStatusLabel[status]}</Badge>
    },
    meta: {
      label: "Status",
      variant: "multiSelect",
      options: Object.entries(orderStatusLabel).map(([value, label]) => ({ value, label })),
    },
  },
  {
    id: "fulfillmentDate",
    accessorKey: "fulfillmentDate",
    enableColumnFilter: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Fulfillment" />
    ),
    cell: ({ row }) => (
      <div>
        <p className="font-medium">
          {formatFulfillmentDate(new Date(row.original.fulfillmentDate))}
        </p>
        <p className="text-sm text-muted-foreground">
          {FULFILLMENT_TYPES[row.original.fulfillmentType].label} · {FULFILLMENT_SLOTS[row.original.fulfillmentSlot].shortLabel}
        </p>
      </div>
    ),
    meta: { label: "Fulfillment date", variant: "dateRange" },
  },
  {
    id: "fulfillmentType",
    accessorKey: "fulfillmentType",
    enableColumnFilter: true,
    header: "Type",
    cell: ({ row }) => FULFILLMENT_TYPES[row.original.fulfillmentType].label,
    meta: {
      label: "Type",
      variant: "multiSelect",
      options: Object.values(FULFILLMENT_TYPES).map(({ id, label }) => ({
        value: id,
        label,
      })),
    },
  },
  {
    id: "paymentChannel",
    accessorKey: "paymentChannel",
    enableColumnFilter: true,
    header: "Payment",
    cell: ({ row }) => PAYMENT_CHANNELS[row.original.paymentChannel].label,
    meta: {
      label: "Payment",
      variant: "multiSelect",
      options: Object.values(PAYMENT_CHANNELS).map(({ id, label }) => ({
        value: id,
        label,
      })),
    },
  },
  {
    id: "subtotalPhp",
    accessorKey: "subtotalPhp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Food subtotal" />
    ),
    cell: ({ row }) => (
      <span className="font-medium tabular-nums">{formatPhp(row.original.subtotalPhp)}</span>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <AdminOrderRowActions order={row.original} />,
  },
]
