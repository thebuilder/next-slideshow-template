"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CommandIcon, List } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"

type SlideCommandCenterProps = {
  current: number
  title: string
  slideOptions: Array<{
    index: number
    title: string
    slug: string
    href: string
  }>
}

export function SlideCommandCenter({
  current,
  title,
  slideOptions,
}: SlideCommandCenterProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isCommandShortcut =
        event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)

      if (!isCommandShortcut) {
        return
      }

      event.preventDefault()
      setIsOpen((open) => !open)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  function goToSlide(href: string) {
    setIsOpen(false)
    router.push(href)
  }

  return (
    <>
      <span className="pointer-events-none hidden items-center gap-1 text-[11px] tracking-wide text-muted-foreground sm:inline-flex">
        <CommandIcon className="size-3" />
        K
      </span>

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="border-border/70 bg-background/80 text-muted-foreground backdrop-blur-sm hover:bg-accent/70 hover:text-foreground"
        onClick={() => setIsOpen(true)}
        aria-label="Open slide command center"
        title="Open slide command center"
      >
        <List />
      </Button>

      <CommandDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title={title}
        description="Jump to any slide by number or title."
        className="sm:max-w-lg"
      >
        <Command>
          <CommandInput placeholder="Go to slide by number, title, or slug..." />
          <CommandList>
            <CommandEmpty>No slides found.</CommandEmpty>
            <CommandGroup heading="Slides">
              {slideOptions.map((slide) => (
                <CommandItem
                  key={slide.href}
                  value={`${slide.index} ${slide.title} ${slide.slug}`}
                  onSelect={() => goToSlide(slide.href)}
                >
                  <span className="inline-flex min-w-10 tabular-nums text-muted-foreground">
                    {String(slide.index).padStart(2, "0")}
                  </span>
                  <span className="truncate">{slide.title}</span>
                  <span className="hidden truncate text-xs text-muted-foreground md:inline">
                    {slide.slug}
                  </span>
                  {slide.index === current ? (
                    <CommandShortcut>Current</CommandShortcut>
                  ) : null}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
