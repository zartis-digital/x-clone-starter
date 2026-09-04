/**
 * "Joined March 2026" — join dates only need month/year, not the
 * relative-time treatment tweet timestamps get. Pinned to UTC (not the
 * viewer's local zone) so the displayed month doesn't shift depending on
 * where the viewer is relative to a join instant near a UTC month
 * boundary (code-audit finding, XC-007 PR2) — locale is still left to the
 * runtime default, only the zone is fixed.
 */
export function formatJoinDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso))
}
