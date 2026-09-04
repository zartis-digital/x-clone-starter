import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"

import { mapAuthErrorToMessage } from "@/lib/auth-errors"

type AuthResult = { error: { code?: string; message?: string } | null }

export function useAuthSubmit() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [formError, setFormError] = useState<string | null>(null)

  const submit = async (authCall: () => Promise<AuthResult>) => {
    setFormError(null)

    const { error } = await authCall()

    if (error) {
      setFormError(mapAuthErrorToMessage(error))
      return
    }

    await queryClient.invalidateQueries({
      queryKey: ["session"],
      refetchType: "all",
    })
    navigate({ to: "/" })
  }

  return { formError, submit }
}
