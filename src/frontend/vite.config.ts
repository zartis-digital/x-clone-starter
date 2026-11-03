import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import { defineConfig } from "vitest/config"
import { loadEnv } from "vite"

import { xbotPlugin } from "./vite-plugin-xbot"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Lets the proxy below target a deployed backend (e.g. the workshop's
  // shared cluster) via a single VITE_API_URL env var. loadEnv() (not plain
  // process.env) is required here specifically because Vite only loads
  // .env files into process.env for the dev-server *runtime*, not for
  // evaluating this config file itself.
  const env = loadEnv(mode, process.cwd(), "")
  // `||`, not `??` — an env var explicitly set to an empty string (a real
  // misconfiguration, not "unset") must still fall back.
  const apiTarget = env.VITE_API_URL || "https://workshops.zartis.com/x-clone-api"
  const proxyBase = { target: apiTarget, changeOrigin: true }

  return {
    plugins: [
      TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
      react(),
      tailwindcss(),
      // Serves POST /__xbot/answer in dev only, by shelling out to the
      // `claude` CLI you're already signed in to. That's what lets the
      // @xbot assistant work with no API key — see the workshop's "Ask
      // @xbot" step. The shared API stores @xbot's replies but never calls
      // a model itself.
      xbotPlugin(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": proxyBase,
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      globals: true,
    },
  }
})
