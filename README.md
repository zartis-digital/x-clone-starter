# X Clone Starter

A React frontend for an X (formerly Twitter) clone. It talks to a **hosted API** — you only work on the frontend during the workshop.

**Stack:** React 19 · Vite · TanStack Router · TanStack Query · Tailwind CSS v4 · shadcn/ui · better-auth · WebSocket

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+
- Git

## Setup

### Clone and install

```sh
git clone https://github.com/zartis-digital/x-clone-starter
cd x-clone-starter
pnpm install
```

### Point it at the workshop API

Create a `.env` file in the project root:

```sh
# Real values are shared closer to the workshop date,
# once the backend is deployed.
VITE_API_URL=<workshop-api-url>
VITE_WS_URL=<workshop-ws-url>
```

> No separate storage URL to configure — the API already returns full, ready-to-use image URLs, so the frontend never builds one itself.

### Run it

```sh
pnpm dev
```

The app runs at `http://localhost:5173`. Launch Claude Code with `claude` in the project root.

> **The backend API is already deployed and fully functional.** You only work on the frontend during this workshop.

## Project Structure

```
src/
  routes/       ← file-based routing (TanStack Router)
  components/
    tweet/      ← tweet card, composer, reply box, actions
    ui/         ← shadcn/ui primitives
  hooks/        ← WebSocket client, compose-tweet logic, etc.
  lib/          ← API client helpers, timeline cache utilities
  queries/      ← TanStack Query option factories
  stores/       ← client-side state (TanStack Store)
```

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the Vite dev server on `:5173` |
| `pnpm build` | Type-check and production build into `dist/` |
| `pnpm preview` | Serve the production build locally |
| `pnpm lint` | Run ESLint |

## Status

This repo is a work in progress ahead of the workshop. The exact features you'll build during the session are still being finalized — the companion **workshop guide** (`workshop.html`) has the full walkthrough and will be updated as that's locked in. Clone and run the app now if you'd like to get familiar with the codebase early; the setup steps above already work end-to-end once the `.env` values are shared.
