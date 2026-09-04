import { Store, useStore } from "@tanstack/react-store"

export type Theme = "light" | "dim" | "dark"

interface ThemeState {
  theme: Theme
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light"
  const stored = localStorage.getItem("theme") as Theme | null
  return stored ?? "light"
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme)
}

export const themeStore = new Store<ThemeState>({
  theme: getInitialTheme(),
})

// Apply initial theme synchronously (before first paint) to avoid FOUC.
if (typeof window !== "undefined") {
  applyTheme(themeStore.state.theme)
}

export function useTheme(): Theme {
  return useStore(themeStore, (state) => state.theme)
}

export function useIsDarkTheme(): boolean {
  return useStore(themeStore, (state) => state.theme !== "light")
}

export function setTheme(theme: Theme) {
  localStorage.setItem("theme", theme)
  themeStore.setState((state) => ({ ...state, theme }))
  applyTheme(theme)
}
