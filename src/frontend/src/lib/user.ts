type DisplayNameUser = { name?: string | null; email: string }

export function getDisplayName(user: DisplayNameUser): string {
  return user.name?.trim() || user.email.split("@")[0]
}
