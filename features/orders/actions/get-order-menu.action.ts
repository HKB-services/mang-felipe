"use server"

import { actionClient } from "@/lib/safe.action"
import { getOrderMenu } from "@/features/orders/server/menu.server"

export const getOrderMenuAction = actionClient
  .metadata({ actionName: "getOrderMenu" })
  .action(async () => {
    return { success: true as const, menu: await getOrderMenu() }
  })
