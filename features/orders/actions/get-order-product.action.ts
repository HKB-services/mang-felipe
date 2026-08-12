"use server"

import { z } from "zod"
import { actionClient } from "@/lib/safe.action"
import { getOrderProduct } from "@/features/orders/server/menu.server"

export const getOrderProductAction = actionClient
  .metadata({ actionName: "getOrderProduct" })
  .inputSchema(z.object({ slug: z.string() }))
  .action(async ({ parsedInput }) => {
    return { success: true as const, product: await getOrderProduct(parsedInput.slug) }
  })
