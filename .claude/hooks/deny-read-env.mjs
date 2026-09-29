#!/usr/bin/env node
// PreToolUse hook (matcher: Read) — block reading secret env files such as
// .env, .env.local and .env.production, but allow the .env.example template.
// Cross-platform: plain Node, no shell, no jq.

const SAFE_TEMPLATES = new Set([".env.example"])

let raw = ""
process.stdin.setEncoding("utf8")
process.stdin.on("data", (chunk) => (raw += chunk))
process.stdin.on("end", () => {
  let payload
  try {
    payload = JSON.parse(raw)
  } catch {
    // Fail open: a malformed payload must not block every Read.
    process.exit(0)
  }

  const input = payload.tool_input ?? {}
  const filePath = input.file_path ?? input.path ?? input.notebook_path
  if (typeof filePath !== "string") process.exit(0)

  // Handle both / and \ so Windows paths work too.
  const name = filePath.split(/[\\/]/).pop() ?? ""
  const isEnvFile = name === ".env" || name.startsWith(".env.")
  if (!isEnvFile || SAFE_TEMPLATES.has(name)) process.exit(0)

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: `Blocked reading ${name}: env files can hold secrets (API keys, tokens). Read .env.example for the variable names instead, or ask the user for the value you need.`,
      },
    })
  )
  process.exit(0)
})
