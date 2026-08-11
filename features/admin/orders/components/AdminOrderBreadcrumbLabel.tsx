"use client"

import { useEffect } from "react"
import { useBreadcrumbLabels } from "@/features/sidebar/BreadcrumbLabelContext"

type AdminOrderBreadcrumbLabelProps = {
  orderId: string
  orderNumber: string
}

export function AdminOrderBreadcrumbLabel({
  orderId,
  orderNumber,
}: AdminOrderBreadcrumbLabelProps) {
  const { setLabel } = useBreadcrumbLabels()

  useEffect(() => {
    setLabel(orderId, `Order ${orderNumber}`)
  }, [orderId, orderNumber, setLabel])

  return null
}

