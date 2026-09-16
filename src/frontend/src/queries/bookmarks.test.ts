import {
  readBookmarks,
  setBookmarked,
  writeBookmarks,
} from "@/queries/bookmarks"
import type { Tweet } from "@/queries/tweets"

const tweet = (id: string): Tweet => ({
  id,
  authorId: "author-1",
  author: { name: "Author", handle: "@author" },
  content: `tweet ${id}`,
  mediaUrls: [],
  createdAt: "2026-09-15T20:00:00.000Z",
  likeCount: 0,
  retweetCount: 0,
  replyCount: 0,
  likedByMe: false,
  retweetedByMe: false,
})

describe("setBookmarked", () => {
  it("adds newest first and removes again", () => {
    const one = setBookmarked([], tweet("a"), true, "2026-09-16T10:00:00.000Z")
    const two = setBookmarked(one, tweet("b"), true, "2026-09-16T11:00:00.000Z")

    expect(two.map((b) => b.id)).toEqual(["b", "a"])
    expect(setBookmarked(two, tweet("a"), false).map((b) => b.id)).toEqual(["b"])
  })

  it("is idempotent", () => {
    const once = setBookmarked([], tweet("a"), true, "2026-09-16T10:00:00.000Z")
    const twice = setBookmarked(once, tweet("a"), true, "2026-09-16T10:00:00.000Z")

    expect(twice).toEqual(once)
    expect(setBookmarked([], tweet("a"), false)).toEqual([])
  })
})

describe("readBookmarks / writeBookmarks", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("keeps a separate list per user", () => {
    writeBookmarks("user-1", setBookmarked([], tweet("a"), true))

    expect(readBookmarks("user-1").map((b) => b.id)).toEqual(["a"])
    expect(readBookmarks("user-2")).toEqual([])
  })

  it("falls back to an empty list on corrupt or unexpected data", () => {
    localStorage.setItem("bookmarks:user-1", "{not json")
    expect(readBookmarks("user-1")).toEqual([])

    localStorage.setItem("bookmarks:user-1", JSON.stringify({ id: "a" }))
    expect(readBookmarks("user-1")).toEqual([])
  })
})
