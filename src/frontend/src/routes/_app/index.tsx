import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sessionQueryOptions } from "@/lib/session"
import { getDisplayName } from "@/lib/user"

export const Route = createFileRoute("/_app/")({
  component: Home,
})

function Home() {
  const { data: session } = useQuery(sessionQueryOptions)
  const displayName = session?.user ? getDisplayName(session.user) : "there"

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Welcome, {displayName}!</h1>
      <p className="text-muted-foreground">
        You're signed in. This is where your work starts.
      </p>
    </div>
  )
}
