import { useQuery } from "@tanstack/react-query"
import { HugeiconsIcon } from "@hugeicons/react"
import { Bookmark02Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { formatRelativeTime } from "@/lib/format-relative-time"
import { sessionQueryOptions } from "@/lib/session"
import { cn } from "@/lib/utils"
import { bookmarksQueryOptions, useSetBookmarked } from "@/queries/bookmarks"
import type { Tweet } from "@/queries/tweets"

export function TweetCard({ tweet }: { tweet: Tweet }) {
  return (
    <article className="flex flex-col gap-2 border-b border-border px-4 py-3">
      <header className="flex items-baseline gap-1 text-sm">
        <span className="font-bold text-foreground">{tweet.author.name}</span>
        <span className="text-muted-foreground">{tweet.author.handle}</span>
        <span className="text-muted-foreground" aria-hidden>
          ·
        </span>
        <time dateTime={tweet.createdAt} className="text-muted-foreground">
          {formatRelativeTime(tweet.createdAt)}
        </time>
      </header>

      {tweet.content && (
        <p className="text-sm break-words whitespace-pre-wrap text-foreground">
          {tweet.content}
        </p>
      )}

      {tweet.mediaUrls.length > 0 && (
        <div
          className={cn(
            "grid gap-0.5 overflow-hidden rounded-xl border border-border",
            tweet.mediaUrls.length > 1 && "grid-cols-2"
          )}
        >
          {tweet.mediaUrls.map((url) => (
            <img
              key={url}
              src={url}
              alt=""
              loading="lazy"
              className="aspect-video size-full object-cover"
            />
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <BookmarkButton tweet={tweet} />
      </div>
    </article>
  )
}

function BookmarkButton({ tweet }: { tweet: Tweet }) {
  const { data: session } = useQuery(sessionQueryOptions)
  const userId = session?.user.id ?? ""
  const { data: isBookmarked = false } = useQuery({
    ...bookmarksQueryOptions(userId),
    enabled: userId !== "",
    select: (bookmarks) => bookmarks.some((b) => b.id === tweet.id),
  })
  const { mutate } = useSetBookmarked(userId)

  const toggle = () => {
    const bookmarked = !isBookmarked
    mutate(
      { tweet, bookmarked },
      {
        onSuccess: () => {
          toast.success(bookmarked ? "Added to Bookmarks" : "Removed from Bookmarks")
        },
        onError: () => {
          toast.error("Couldn't update Bookmarks")
        },
      }
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
      disabled={!userId}
      onClick={toggle}
      className={cn(
        "text-muted-foreground hover:text-primary",
        isBookmarked && "text-primary"
      )}
    >
      <HugeiconsIcon
        icon={Bookmark02Icon}
        className="size-4"
        fill={isBookmarked ? "currentColor" : "none"}
      />
    </Button>
  )
}
