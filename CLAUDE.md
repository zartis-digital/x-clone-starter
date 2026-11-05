# X Clone Starter

A frontend for an X (Twitter)-style app. The API is already deployed — this repo is
frontend-only, living under `src/frontend/`.

## Stack

- **React 19** + **Vite** + **TypeScript**
- **TanStack Router** — file-based routing (`src/frontend/src/routes/`)
- **TanStack Query** — server state / data fetching
- **Tailwind CSS v4** + shadcn-style primitives in `src/frontend/src/components/ui/`
- **better-auth** (React client) for authentication
- **Vitest** + `@testing-library/react` for tests

## Structure

```
src/frontend/src/
  routes/          File-based routes (TanStack Router). `_app.tsx` and `_auth.tsx` are
                   pathless layout routes — `_app` requires a signed-in session,
                   `_auth` requires a signed-out one (see their `beforeLoad` guards).
  components/
    ui/            Generic, feature-agnostic primitives (button, dialog, form, ...)
  hooks/           Reusable React hooks
  lib/             Framework-agnostic utilities (auth client, formatting, session query)
  stores/          Client-side state outside React Query (currently: theme)
```

## Conventions

- **Routing**: add a new page by adding a file under `src/frontend/src/routes/`. Auth-gated
  pages go under `_app/`; the layout at `src/frontend/src/routes/_app.tsx` renders the
  header/nav shared by all of them. `routeTree.gen.ts` is generated — never edit it by hand, it
  regenerates on `pnpm dev`/`pnpm build`.
- **Data fetching**: API calls live in `src/frontend/src/queries/<domain>.ts` (a directory you'll
  create) as plain `fetch` calls wrapped in `queryOptions(...)` (see `lib/session.ts` for the
  pattern). Always pass `credentials: "include"` — auth is cookie-based.
- **Auth**: `lib/auth-client.ts` wraps `better-auth/react`; `lib/session.ts` exposes
  `sessionQueryOptions` for reading the current session via React Query.
- **Env config**: the API base URL is read from `VITE_API_URL` (see
  `src/frontend/.env.example` and `src/frontend/vite.config.ts`'s `/api` proxy) — never hardcode
  the API origin in application code.

## The @xbot assistant

- `@xbot` is an assistant account on the shared API. Mentioning it in a tweet
  (`/(^|\s)@xbot\b/i` — the rule lives in `src/frontend/src/lib/xbot.ts`, and the backend uses
  the same one) means it should answer in that tweet's thread.
- `POST /api/tweets/:id/xbot-reply` with `{ content }` posts a reply as `@xbot`, where `:id` is
  the tweet that mentioned it. Only that tweet's author may call it (`403`), it must mention
  `@xbot` (`400`), and each mention is answered once (`409` after that).
- A mention inside a reply continues the thread: replies are single-level, so the answer is
  posted as that reply's **sibling** under the same original tweet. The API derives the parent
  itself — callers never send one.
- **The API never calls a model** — it only stores the answer. The answer itself is written
  locally by `vite-plugin-xbot.ts`, a dev-only Vite plugin that serves `POST /__xbot/answer`
  by shelling out to the `claude` CLI. So the feature needs no API key, and `@xbot` goes quiet
  when the dev server isn't running. A failed call to `/__xbot/answer` means "@xbot is asleep":
  show a quiet message, never post a placeholder reply to the shared API.

## Workshop note

- The API is shared by everyone in the room. When testing in the browser (including via
  MCP browser tools), sign in with your own account — sign up if you haven't — rather than
  the shared fallback test account from `workshop.html`. Likes, retweets, and follows are
  per-account state shared live with whoever else is using that account.

## Commands (run from `src/frontend/`)

- `pnpm dev` — start the dev server
- `pnpm build` — typecheck + production build
- `pnpm lint` — ESLint
- `pnpm test` — Vitest
