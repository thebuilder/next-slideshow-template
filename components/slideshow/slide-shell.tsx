import Link from "next/link"

import { SlideBackground } from "@/components/slideshow/slide-background"
import { SlideCommandCenter } from "@/components/slideshow/slide-command-center"
import { SlideNavigation } from "@/components/slideshow/slide-navigation"
import {
  SlideStepAdvanceArea,
  SlideStepper,
} from "@/components/slideshow/slide-stepper"
import { SlideshowThemeToggle } from "@/components/slideshow/theme-toggle"
import type {
  SlideBackgroundMode,
  SlideFooterMode,
  SlideHeaderMode,
  SlideLayoutMode,
} from "@/types/slides"
import { cn } from "@/lib/utils"

type SlideShellProps = {
  children: React.ReactNode
  current: number
  total: number
  stepCount?: number
  previousHref?: string
  nextHref?: string
  prefetchHrefs?: string[]
  title: string
  titleHref?: string
  headerMode?: SlideHeaderMode
  footerMode?: SlideFooterMode
  layout?: SlideLayoutMode
  background?: SlideBackgroundMode
  slideOptions: Array<{
    index: number
    title: string
    href: string
  }>
}

export function SlideShell({
  children,
  current,
  total,
  stepCount = 0,
  previousHref,
  nextHref,
  prefetchHrefs = [],
  title,
  titleHref = "/",
  headerMode = "auto",
  footerMode = "visible",
  layout = "default",
  background = "default",
  slideOptions,
}: SlideShellProps) {
  const isFullscreen = layout === "fullscreen"
  const showHeader =
    headerMode === "visible" || (headerMode === "auto" && !isFullscreen)
  const showFooter = footerMode !== "hidden"

  return (
    <SlideStepper
      stepCount={stepCount}
      previousHref={previousHref}
      nextHref={nextHref}
    >
      <div className="relative min-h-svh overflow-hidden bg-background text-foreground">
        <SlideBackground variant={background} />

        {showHeader ? (
          <header className="fixed inset-x-0 top-0 z-40 border-b border-transparent bg-background/50 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <Link href={titleHref} className="text-sm font-semibold tracking-tight">
                {title}
              </Link>
              <div className="flex items-center gap-2">
                <SlideCommandCenter
                  current={current}
                  slideOptions={slideOptions}
                />
                <SlideshowThemeToggle />
              </div>
            </div>
          </header>
        ) : null}

        <main
          className={cn(
            "relative z-10 flex min-h-svh w-full items-start",
            isFullscreen
              ? "px-4 pt-8 sm:px-6 sm:pt-10"
              : "mx-auto max-w-6xl px-4 pt-28 sm:px-6 sm:pt-32",
            showHeader ? "" : "pt-8 sm:pt-10",
            showFooter ? "pb-24 sm:pb-28" : "pb-8 sm:pb-10",
          )}
        >
          <SlideStepAdvanceArea className="w-full">
            <div className="w-full">{children}</div>
          </SlideStepAdvanceArea>
        </main>

        {showFooter ? (
          <SlideNavigation
            current={current}
            total={total}
            previousHref={previousHref}
            nextHref={nextHref}
            mode={footerMode === "counter" ? "counter" : "visible"}
            prefetchHrefs={prefetchHrefs}
          />
        ) : null}
      </div>
    </SlideStepper>
  )
}
