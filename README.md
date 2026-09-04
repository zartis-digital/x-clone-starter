# X Clone Starter

A React frontend for an X (formerly Twitter) clone. It talks to a **hosted API** — you only work on the frontend during the workshop.

**Stack:** React 19 · Vite · TanStack Router · TanStack Query · Tailwind CSS v4 · shadcn/ui · better-auth

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+
- Git
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI

## Setup

### Clone and install

```sh
git clone https://github.com/zartis-digital/x-clone-starter
cd x-clone-starter/src/frontend
pnpm install
```

### Point it at the workshop API

`src/frontend/.env` is already committed with `VITE_API_URL` pointing at the shared workshop API — nothing to set up. Only edit it if you're told to point at a different API.

### Run it

```sh
pnpm dev
```

The app runs at `http://localhost:5173`. Launch Claude Code with `claude` from the **repository root** (`x-clone-starter/`, where `CLAUDE.md` lives), not from `src/frontend`.

> **The backend API is already deployed and fully functional.** You only work on the frontend during this workshop.

## Project Structure

```
x-clone-starter/
  CLAUDE.md
  README.md
  workshop.html      ← the workshop guide
  src/
    frontend/         ← the app you'll work on
      src/
        routes/       ← file-based routing (TanStack Router)
        components/
          ui/         ← shadcn/ui primitives
        hooks/        ← reusable React hooks
        lib/          ← auth client, formatting, session query
        stores/       ← client-side state (TanStack Store)
```

## Scripts

Run from `src/frontend/`:

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the Vite dev server on `:5173` |
| `pnpm build` | Type-check and production build into `dist/` |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run the Vitest suite |

## Status

Scope is locked in — the companion **workshop guide** (`workshop.html`) has the full walkthrough. Clone and run the app now if you'd like to get familiar with the codebase before the session.
