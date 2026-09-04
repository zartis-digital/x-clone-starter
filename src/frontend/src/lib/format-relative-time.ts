const MINUTE = 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const WEEK = DAY * 7

/**
 * Twitter/X-style compact relative timestamp: "3s", "12m", "4h", "2d", then
 * falls back to an absolute date past a week.
 */
export function formatRelativeTime(iso: string): string {
  const diffSeconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  )

  if (diffSeconds < MINUTE) return `${diffSeconds.toString()}s`
  if (diffSeconds < HOUR) return `${Math.floor(diffSeconds / MINUTE).toString()}m`
  if (diffSeconds < DAY) return `${Math.floor(diffSeconds / HOUR).toString()}h`
  if (diffSeconds < WEEK) return `${Math.floor(diffSeconds / DAY).toString()}d`

  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })
}
