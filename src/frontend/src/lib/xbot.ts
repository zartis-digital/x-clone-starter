/**
 * XC-024: the @xbot assistant, client side.
 *
 * The mention rule is defined twice on purpose — here and in
 * backend/src/lib/xbot.ts — because the two run in different processes. The
 * story fixes the rule itself (`/(^|\s)@xbot\b/i`) so the copies can't drift
 * into disagreeing about what counts as a mention.
 */

export const XBOT_HANDLE = "xbot"

/** Un-global: a `/g` regex carries `lastIndex` between `.test()` calls. */
export const XBOT_MENTION_PATTERN = /(^|\s)@xbot\b/i

/** The handle must start the text or follow whitespace, so "hi@xbot" and "@xbotkit" don't count. */
export function mentionsXbot(content: string): boolean {
  return XBOT_MENTION_PATTERN.test(content)
}

/** True for a tweet @xbot authored — its handle arrives "@"-prefixed from the API. */
export function isXbotTweet(tweet: { author: { handle: string } }): boolean {
  return tweet.author.handle.replace(/^@/, "").toLowerCase() === XBOT_HANDLE
}

export interface TextSegment {
  text: string
  isMention: boolean
}

/**
 * Splits tweet text into plain runs and @xbot mentions, so the mention can
 * be styled while everything else renders as-is.
 *
 * It matches exactly what `mentionsXbot` matches — a near-miss like
 * "hi@xbot" stays unhighlighted, which is the point: seeing the handle
 * *not* light up is how you notice the mention won't register.
 *
 * A fresh regex per call, because this one needs the `g` flag and a shared
 * one would carry `lastIndex` between calls.
 */
export function splitXbotMentions(content: string): TextSegment[] {
  const pattern = /(^|\s)(@xbot)\b/gi
  const segments: TextSegment[] = []
  let cursor = 0

  for (const match of content.matchAll(pattern)) {
    // match[1] is the leading whitespace (or ""), which stays plain text.
    const mentionStart = (match.index ?? 0) + match[1].length
    if (mentionStart > cursor) {
      segments.push({ text: content.slice(cursor, mentionStart), isMention: false })
    }
    segments.push({ text: match[2], isMention: true })
    cursor = mentionStart + match[2].length
  }

  if (cursor < content.length) {
    segments.push({ text: content.slice(cursor), isMention: false })
  }

  return segments
}
