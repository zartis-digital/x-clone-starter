import { queryOptions } from "@tanstack/react-query"

// Shape confirmed against GET /api/timeline from a signed-in session.
export type Tweet = {
  id: string
  authorId: string
  author: { name: string; handle: string }
  content: string
  mediaUrls: string[]
  createdAt: string
  likeCount: number
  retweetCount: number
  replyCount: number
  likedByMe: boolean
  retweetedByMe: boolean
}

export type TimelinePage = {
  items: Tweet[]
  nextCursor: string | null
}

export const timelineQueryOptions = queryOptions({
  queryKey: ["timeline"] as const,
  queryFn: async (): Promise<TimelinePage> => {
    const res = await fetch("/api/timeline", { credentials: "include" })
    if (!res.ok) {
      throw new Error(`Failed to load timeline (${res.status.toString()})`)
    }
    return res.json()
  },
})
