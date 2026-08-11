"use server"

import { ROLES } from "@/features/admin/users/schema/user.schema"
import { ActionError, authActionClient } from "@/lib/safe.action"
import { getMenuHub } from "../server/admin-get-menu-hub"

export const getMenuHubAction = authActionClient
  .metadata({ actionName: "getMenuHub" })
  .action(async ({ ctx }) => {
    if (!ctx.session?.user.roles?.includes(ROLES.SUPER_ADMIN)) {
      throw new ActionError("Forbidden")
    }

    return { success: true as const, menu: await getMenuHub() }
  })
