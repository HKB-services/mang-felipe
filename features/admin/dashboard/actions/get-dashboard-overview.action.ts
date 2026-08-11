"use server"

import { ROLES } from "@/features/admin/users/schema/user.schema"
import { ActionError, authActionClient } from "@/lib/safe.action"
import { getDashboardOverview } from "../server/get-dashboard-overview"

export const getDashboardOverviewAction = authActionClient
  .metadata({ actionName: "getDashboardOverview" })
  .action(async ({ ctx }) => {
    if (!ctx.session?.user.roles?.includes(ROLES.SUPER_ADMIN)) {
      throw new ActionError("Forbidden")
    }

    return {
      success: true as const,
      overview: await getDashboardOverview(),
    }
  })
