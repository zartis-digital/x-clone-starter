import { queryOptions } from "@tanstack/react-query"

import { getSession } from "@/lib/auth-client"

export const sessionQueryOptions = queryOptions({
  queryKey: ["session"] as const,
  queryFn: async () => {
    const { data } = await getSession()
    return data
  },
  staleTime: 1000 * 60 * 5, // 5 minutes
})
