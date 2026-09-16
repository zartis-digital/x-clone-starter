#!/usr/bin/env node
// PreToolUse hook (matcher: Edit|Write|MultiEdit|NotebookEdit) — block edits
// to lockfiles and generated files such as src/frontend/pnpm-lock.yaml and
// src/frontend/src/routeTree.gen.ts. Cross-platform: plain Node, no shell.

const LOCKFILES = new Set([
  "pnpm-lock.yaml",
  "package-lock.json",
  "yarn.lock",
  "bun.lock",
  "bun.lockb",
])

let raw = ""
process.stdin.setEncoding("utf8")
process.stdin.on("data", (chunk) => (raw += chunk))
process.stdin.on("end", () => {
  let payload
  try {
    payload = JSON.parse(raw)
  } catch {
    // Fail open: a malformed payload must not block every edit.
    process.exit(0)
  }

  const input = payload.tool_input ?? {}
  const filePath = input.file_path ?? input.path ?? input.notebook_path
  if (typeof filePath !== "string") process.exit(0)

  // Handle both / and \ so Windows paths work too.
  const name = filePath.split(/[\\/]/).pop() ?? ""

  let reason = null
  if (LOCKFILES.has(name)) {
    reason = `Blocked editing ${name}: it is a lockfile. Change dependencies with the package manager (e.g. \`pnpm add\` / \`pnpm install\` in src/frontend) and let it regenerate the lockfile.`
  } else if (name.endsWith(".gen.ts")) {
    reason = `Blocked editing ${name}: it is a generated file. ${
      name === "routeTree.gen.ts"
        ? "The TanStack Router Vite plugin regenerates it from src/routes/ on `pnpm dev` / `pnpm build` — change the route files instead."
        : "Change its source and regenerate it instead."
    }`
  }
  if (!reason) process.exit(0)

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
    })
  )
  process.exit(0)
})
