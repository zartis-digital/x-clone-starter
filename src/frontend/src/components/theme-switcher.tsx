import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { setTheme, useTheme, type Theme } from "@/stores/theme"

const THEMES: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dim", label: "Dim" },
  { value: "dark", label: "Dark" },
]

export function ThemeSwitcher() {
  const activeTheme = useTheme()

  return (
    <ToggleGroup
      type="single"
      aria-label="Theme switcher"
      value={activeTheme}
      onValueChange={(value) => {
        if (value) setTheme(value as Theme)
      }}
    >
      {THEMES.map(({ value, label }) => (
        <ToggleGroupItem key={value} value={value} aria-label={label}>
          <span className="hidden xl:inline">{label}</span>
          <span className="xl:hidden">{label.charAt(0)}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
