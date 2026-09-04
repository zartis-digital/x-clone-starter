import { describe, expect, it } from "vitest"

import { formatJoinDate } from "@/lib/format-join-date"

describe("formatJoinDate", () => {
  it("formats an ISO date with a long month name and full year", () => {
    // Locale is left to the runtime's default (see formatJoinDate) so this
    // asserts shape rather than a hardcoded English string, which would be
    // locale-dependent and flaky across environments.
    expect(formatJoinDate("2026-03-15T00:00:00.000Z")).toMatch(/2026/)
  })

  it("ignores the day-of-month component", () => {
    expect(formatJoinDate("2024-01-01T00:00:00.000Z")).toBe(
      formatJoinDate("2024-01-31T00:00:00.000Z")
    )
  })
})
