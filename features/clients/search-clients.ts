"use server"

/**
 * Legacy investment Client search — model removed for catering app.
 * Kept as stub so old routes do not crash until sidebar cleanup.
 */
import { authActionClient } from "@/lib/safe.action"
import { throwSearchActionError } from "@/lib/search/throw-search-action-error"
import { z } from "zod"

const SearchClientsInputSchema = z.object({
  term: z.string().trim().min(1, { message: "Search term is required" }),
  status: z.enum(["active", "inactive", "blacklisted"]).optional(),
  limit: z.number().int().positive().max(50).default(25),
})

export type SearchClientsInput = z.infer<typeof SearchClientsInputSchema>

export const SearchClientsAction = authActionClient
  .inputSchema(SearchClientsInputSchema)
  .action(async () => {
    throwSearchActionError(
      "Client directory removed. Use Orders / Menu admin instead."
    )
  })
