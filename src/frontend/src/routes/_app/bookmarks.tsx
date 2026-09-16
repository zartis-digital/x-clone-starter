import { createFileRoute } from "@tanstack/react-router"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { TweetCard } from "@/components/tweet-card"
import { seo } from "@/lib/seo"
import { sessionQueryOptions } from "@/lib/session"
import { bookmarksQueryOptions } from "@/queries/bookmarks"
import { timelineQueryOptions } from "@/queries/tweets"

export const Route = createFileRoute("/_app/bookmarks")({
  head: () => ({
    meta: seo({ title: "Bookmarks | X Clone" }),
  }),
  loader: async ({ context }) => {
    // _app's beforeLoad has already guaranteed a session.
    const session = await context.queryClient.ensureQueryData(sessionQueryOptions)
    if (session) {
      await context.queryClient.ensureQueryData(
        bookmarksQueryOptions(session.user.id)
      )
    }
  },
  component: BookmarksPage,
})

function BookmarksPage() {
  const queryClient = useQueryClient()
  const { data: session } = useQuery(sessionQueryOptions)
  const userId = session?.user.id ?? ""
  const { data: bookmarks = [] } = useQuery({
    ...bookmarksQueryOptions(userId),
    enabled: userId !== "",
  })

  // Snapshots go stale; prefer the timeline's copy of a tweet when it's cached.
  const fresh = new Map(
    queryClient
      .getQueryData(timelineQueryOptions.queryKey)
      ?.items.map((tweet) => [tweet.id, tweet])
  )

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Bookmarks</h1>
      {bookmarks.length === 0 ? (
        <div className="flex flex-col gap-1 py-8 text-center">
          <p className="font-bold text-foreground">Save posts for later</p>
          <p className="text-sm text-muted-foreground">
            Bookmark posts to easily find them again in the future.
          </p>
        </div>
      ) : (
        <div className="flex flex-col border-t border-border">
          {bookmarks.map((bookmark) => (
            <TweetCard
              key={bookmark.id}
              tweet={fresh.get(bookmark.id) ?? bookmark}
            />
          ))}
        </div>
      )}
    </div>
  )
}
