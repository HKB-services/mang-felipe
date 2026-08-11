import type { ComponentProps } from "react"
import type { Badge } from "@/components/ui/badge"

type BadgeVariant = ComponentProps<typeof Badge>["variant"]

export const orderStatusLabel = {
  pending_review: "Pending review",
  confirmed: "Confirmed",
  rejected: "Rejected",
  cancelled: "Cancelled",
} as const

export const orderStatusVariant = {
  pending_review: "outline",
  confirmed: "default",
  rejected: "destructive",
  cancelled: "secondary",
} satisfies Record<keyof typeof orderStatusLabel, BadgeVariant>
