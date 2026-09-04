type AuthErrorLike = { code?: string; message?: string } | null | undefined

const messagesByCode: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "Incorrect email or password.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
    "An account with this email already exists. Try signing in instead.",
}

export function mapAuthErrorToMessage(error: AuthErrorLike): string {
  if (!error) return ""
  return (
    messagesByCode[error.code ?? ""] ??
    error.message ??
    "Something went wrong. Please try again."
  )
}
