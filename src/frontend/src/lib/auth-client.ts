import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  // handle is server-derived and never accepted as sign-up input —
  // input: false must match the API's own field config, or TS treats
  // handle as a required field on signUp.email's payload.
  plugins: [
    inferAdditionalFields({
      user: { handle: { type: "string", input: false } },
    }),
  ],
})

export const { signIn, signUp, signOut, getSession, useSession } = authClient
