import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { HugeiconsIcon } from "@hugeicons/react"
import { Logout01Icon } from "@hugeicons/core-free-icons"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth-client"
import { sessionQueryOptions } from "@/lib/session"
import { getDisplayName } from "@/lib/user"

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(
      sessionQueryOptions
    )

    if (!session) {
      throw redirect({ to: "/sign-in" })
    }
  },
  component: AppLayout,
})

function AppLayout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: session } = useQuery(sessionQueryOptions)
  const displayName = session?.user ? getDisplayName(session.user) : "You"

  const handleSignOut = async () => {
    await signOut()
    queryClient.clear()
    navigate({ to: "/sign-in" })
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="text-lg font-bold">x-clone</span>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <Button type="button" variant="outline" onClick={handleSignOut}>
            <HugeiconsIcon icon={Logout01Icon} className="size-4" />
            Sign out ({displayName})
          </Button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[600px] flex-1 px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
