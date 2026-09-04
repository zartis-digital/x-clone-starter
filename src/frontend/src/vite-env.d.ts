/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Not actually read via import.meta.env anywhere — VITE_API_URL is read
  // inside vite.config.ts itself via loadEnv(), a Node-context API
  // unrelated to this client-side typing. Declared here anyway so a grep
  // for "VITE_API" finds the one real name.
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
