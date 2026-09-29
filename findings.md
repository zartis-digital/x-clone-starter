# Workshop findings: X Clone Starter

Checked on 2026-09-15, the evening before the seminar.

## What this is

It is a frontend for an X (Twitter)-style app, but the real topic of the seminar is **Claude Code**. The app is just the practice project. The guide is `workshop.html` in the repo root; open it in a browser. It walks you through 17 steps.

## Where you work

- **Repo:** `~/repos/x-clone-starter`. The app code is in `src/frontend/`.
- **API:** already running at `https://workshops.zartis.com/x-clone-api`, so you only write frontend code. It answered a test request (`GET /api/auth/get-session` returned 200).
- **Start Claude Code from the repo root** (`x-clone-starter/`, where `CLAUDE.md` is), not from `src/frontend`.
- **Physical location:** nothing in the repo says where the seminar takes place. Check the invitation.

## The 10 things to know

1. **The setup doesn't work yet.** The default Node is 20. pnpm 11.25 needs Node 22.13 or newer, so every pnpm command crashes with `No such built-in module: node:sqlite`. Also, `node_modules` isn't installed yet. Node 24 is already installed through fnm, and pnpm runs on it. Fix:
   ```sh
   fnm default v24.20.0
   cd ~/repos/x-clone-starter/src/frontend && pnpm install && pnpm dev
   ```
   Then open http://localhost:5173 and check that the sign-in page loads.
2. **What's already built:** login, sign-up, sign-out, the protected-route guards, a light/dark switch and a welcome page. There are no tweets, no feed and no profiles yet.
3. **Stack:** React 19, Vite, TypeScript, TanStack Router (routes are files), TanStack Query, Tailwind v4, shadcn/ui and better-auth (login via cookies). It helps to know TanStack Query's `useInfiniteQuery` and `useMutation`.
4. **Part 1, about 60 min:** setting up Claude Code.
   - Run `/model` and `/init`, and edit `CLAUDE.md`.
   - Add scoped rules in `.claude/rules/` and try `/memory`.
   - Add two MCP servers in `.mcp.json`: Chrome DevTools (Claude controls a browser) and Context7 (library docs).
   - Use plan mode (`Shift+Tab`).
   - Add hooks that block reading `.env` and editing generated files.
5. **Part 2, about 20 min:** you write your own skills (`/interview-requirements`, `/create-issue`, `/close-issue`, saved in `docs/issues/`) and agents (a QA tester and a read-only code explorer).
6. **Part 3, about 75–90 min:** the actual features, in order:
   - a tweet composer (280 characters, up to 4 images)
   - a timeline with infinite scroll
   - like and retweet, updating the count before the server replies
   - inline replies
   - a profile page, as an optional extra

   Part 4 is free choice, for example bookmarks, search or animations.
7. **The routine for each feature:** `/create-issue` → Claude implements it → `/close-issue` → test it in the browser with the DevTools MCP.
8. **There's no API documentation (no Swagger).** Before writing code for an endpoint, have Claude send a test request and look at the real response. The endpoints you'll use are `/api/tweets`, `/api/timeline`, `/api/tweets/:id/replies`, `/api/users/:handle` and `/api/users/:handle/tweets`.
9. **Rules the project sets:**
   - API calls go in `src/frontend/src/queries/<domain>.ts`, using `queryOptions` (see `lib/session.ts`).
   - Always pass `credentials: "include"`.
   - Never hardcode the API URL; it comes from `VITE_API_URL`.
   - Never edit `routeTree.gen.ts`; it's generated.
   - Reuse the components in `components/ui/`.
10. **Useful commands:**
    - Test account: `cluster-test@x-clone.dev` / `ClusterTest123!`
    - Claude Code: `/clear` between features, `/compact` when a conversation gets long, `Esc` to stop Claude
    - Checks, run in `src/frontend`: `pnpm lint`, `pnpm test`, `pnpm build`
    - The Chrome DevTools and Context7 MCP servers start through `npx`, so you need internet access and Chrome installed.

Point 1 is the only real risk. Everything else is taught during the session.

## Before sharing this with the team

Added on 2026-09-16, during the seminar.

**License: none, so not automatically free to share**

- There's no LICENSE file and no license field in `package.json`. Without a license, the code and `workshop.html` legally stay with their authors (Zartis, zartis-digital/x-clone-starter). Having access doesn't give you the right to reuse or redistribute them.
- `origin` points at a personal copy, github.com/marcelpetrick/x-clone-starter. If that copy is public, it already redistributes Zartis's material; consider making it private until you've asked.
- To be sure, ask the Zartis organisers whether the material may be reused internally, and check the event invitation or terms. This is not legal advice.

**Backend: everyone uses the same API, and that causes complications**

- `src/frontend/.env` points everyone at one shared API, `https://workshops.zartis.com/x-clone-api`. The backend isn't in the repo, so teammates can't run their own.
- In practice, as seen during the seminar:
  - Everyone on `cluster-test` shares likes, retweets and posts. The guide asks for separate accounts for this reason.
  - Posts can't be deleted, and the API doesn't check image keys. Broken test posts stay up for everyone.
  - Uploaded images go into Zartis's shared storage.
- Availability is unknown. It's Zartis's server, deployed for this workshop, and nothing says how long it stays online. Teammates using it after the event may find it gone, and would be using a company's infrastructure without permission.
