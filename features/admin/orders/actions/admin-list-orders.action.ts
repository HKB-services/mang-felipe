"use server"

import { ROLES } from "@/features/admin/users/schema/user.schema"
import { ActionError, authActionClient } from "@/lib/safe.action"
import { ListOrdersInputSchema } from "../schema/admin-list-orders.schema"
import { listOrders } from "../server/admin-list-orders"

export const listOrdersAction = authActionClient
  .metadata({ actionName: "listOrders" })
  .inputSchema(ListOrdersInputSchema)
  .action(async ({ parsedInput, ctx }) => {
    if (!ctx.session?.user.roles?.includes(ROLES.SUPER_ADMIN)) {
      throw new ActionError("Forbidden")
    }

    return {
      success: true as const,
      ...(await listOrders(parsedInput)),
    }
  })
