import { useEffect } from "react"
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import type { Tweet } from "@/queries/tweets"

// The API has no bookmark endpoints and no GET /api/tweets/:id, so bookmarks
// live in localStorage, per user, as snapshots of the tweet at the time it
// was bookmarked. Only this file needs to change if the API gains support.
export type BookmarkedTweet = Tweet & { bookmarkedAt: string }

const storageKey = (userId: string) => `bookmarks:${userId}`

export function readBookmarks(userId: string): BookmarkedTweet[] {
  try {
    const raw = localStorage.getItem(storageKey(userId))
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? (parsed as BookmarkedTweet[]) : []
  } catch {
    return []
  }
}

export function writeBookmarks(userId: string, bookmarks: BookmarkedTweet[]) {
  localStorage.setItem(storageKey(userId), JSON.stringify(bookmarks))
}

/** Idempotent: sets the desired state rather than flipping it. Newest first. */
export function setBookmarked(
  bookmarks: BookmarkedTweet[],
  tweet: Tweet,
  bookmarked: boolean,
  now: string = new Date().toISOString()
): BookmarkedTweet[] {
  const rest = bookmarks.filter((b) => b.id !== tweet.id)
  return bookmarked ? [{ ...tweet, bookmarkedAt: now }, ...rest] : rest
}

export const bookmarksQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["bookmarks", userId] as const,
    queryFn: () => readBookmarks(userId),
    // localStorage only changes through useSetBookmarked below (or another
    // tab, which useBookmarksStorageSync picks up).
    staleTime: Infinity,
  })

/** Refresh bookmarks when another tab changes them. */
export function useBookmarksStorageSync() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key.startsWith("bookmarks:")) {
        void queryClient.invalidateQueries({ queryKey: ["bookmarks"] })
      }
    }
    window.addEventListener("storage", onStorage)
    return () => {
      window.removeEventListener("storage", onStorage)
    }
  }, [queryClient])
}

type SetBookmarkedVariables = { tweet: Tweet; bookmarked: boolean }

export function useSetBookmarked(userId: string) {
  const { queryKey } = bookmarksQueryOptions(userId)

  return useMutation({
    mutationFn: async ({ tweet, bookmarked }: SetBookmarkedVariables) => {
      writeBookmarks(
        userId,
        setBookmarked(readBookmarks(userId), tweet, bookmarked)
      )
    },
    onMutate: async ({ tweet, bookmarked }, { client }) => {
      await client.cancelQueries({ queryKey })
      const previous = client.getQueryData(queryKey)
      client.setQueryData(queryKey, (old) =>
        setBookmarked(old ?? [], tweet, bookmarked)
      )
      return { previous }
    },
    onError: (_error, _variables, result, { client }) => {
      client.setQueryData(queryKey, result?.previous)
    },
    onSettled: (_data, _error, _variables, _result, { client }) =>
      client.invalidateQueries({ queryKey }),
  })
}
