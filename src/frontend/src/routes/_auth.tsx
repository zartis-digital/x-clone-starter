import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { sessionQueryOptions } from "@/lib/session"

export const Route = createFileRoute("/_auth")({
  // Mirrors /_app's guard in the opposite direction (XC-018) — without
  // this, browsing back to a stale /sign-in history entry while still
  // signed in just re-renders the form, indistinguishable from actually
  // being signed out.
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(
      sessionQueryOptions
    )

    if (session) {
      throw redirect({ to: "/" })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Outlet />
    </div>
  )
}
