import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import { TweetCard } from "@/components/tweet-card"
import { sessionQueryOptions } from "@/lib/session"
import { getDisplayName } from "@/lib/user"
import { timelineQueryOptions } from "@/queries/tweets"

export const Route = createFileRoute("/_app/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(timelineQueryOptions),
  component: Home,
})

function Home() {
  const { data: session } = useQuery(sessionQueryOptions)
  const displayName = session?.user ? getDisplayName(session.user) : "there"
  const { data: timeline } = useQuery(timelineQueryOptions)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Welcome, {displayName}!</h1>
        <p className="text-muted-foreground">
          You're signed in. This is where your work starts.
        </p>
      </div>
      <div className="flex flex-col border-t border-border">
        {timeline?.items.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
      </div>
    </div>
  )
}
