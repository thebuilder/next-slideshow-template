"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

const emptySubscribe = () => () => {}

function useHasHydrated() {
  return React.useSyncExternalStore(emptySubscribe, () => true, () => false)
}

export function SlideshowThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const hasHydrated = useHasHydrated()
  const isDark = resolvedTheme === "dark"

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="border-border/70 bg-background/80 backdrop-blur-sm"
      aria-label={
        hasHydrated
          ? isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
          : "Toggle theme"
      }
    >
      <Sun className="hidden dark:block" />
      <Moon className="dark:hidden" />
    </Button>
  )
}
