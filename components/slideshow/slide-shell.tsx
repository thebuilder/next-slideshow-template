import Link from "next/link"

import { SlideBackground } from "@/components/slideshow/slide-background"
import { SlideCommandCenter } from "@/components/slideshow/slide-command-center"
import { SlideNavigation } from "@/components/slideshow/slide-navigation"
import {
  PresenterKeyboardShortcut,
  PresenterPopoutButton,
  PresenterSync,
} from "@/components/slideshow/presenter-controls"
import { SlideContextProvider } from "@/components/slideshow/slide-context"
import {
  SlideStepAdvanceArea,
  SlideStepper,
} from "@/components/slideshow/slide-stepper"
import { StaticMediaBoundary } from "@/components/slideshow/static-media-boundary"
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
  deckTitle: string
  deckTitleHref?: string
  slideTitle?: string
  headerMode?: SlideHeaderMode
  footerMode?: SlideFooterMode
  layout?: SlideLayoutMode
  background?: SlideBackgroundMode
  slideOptions: Array<{
    index: number
    title: string
    slug: string
    href: string
  }>
  notes?: string
  currentSlug: string
  nextSlide?: {
    slug: string
    title: string
  }
  readOnly?: boolean
  initialStep?: number
  presenterEnabled?: boolean
  freezeMedia?: boolean
}

export function SlideShell({
  children,
  current,
  total,
  stepCount = 0,
  previousHref,
  nextHref,
  prefetchHrefs = [],
  deckTitle,
  deckTitleHref = "/",
  slideTitle,
  headerMode = "auto",
  footerMode = "visible",
  layout = "default",
  background = "default",
  slideOptions,
  notes,
  currentSlug,
  nextSlide,
  readOnly = false,
  initialStep = 0,
  presenterEnabled = true,
  freezeMedia = false,
}: SlideShellProps) {
  const isFullscreen = layout === "fullscreen"
  const showHeader =
    headerMode === "visible" || (headerMode === "auto" && !isFullscreen)
  const showFooter = footerMode !== "hidden"

  return (
    <SlideStepper
      stepCount={stepCount}
      initialStep={initialStep}
      readOnly={readOnly}
      previousHref={previousHref}
      nextHref={nextHref}
    >
      <SlideContextProvider
        title={slideTitle}
        isPresenterPreview={readOnly}
      >
        <div className="relative min-h-svh overflow-hidden bg-background text-foreground">
          <PresenterSync
            enabled={presenterEnabled && !readOnly}
            current={current}
            total={total}
            slides={slideOptions.map((slide) => ({
              title: slide.title,
              href: slide.href,
            }))}
            currentSlug={currentSlug}
            currentTitle={slideOptions[current - 1]?.title ?? slideTitle ?? deckTitle}
            stepCount={stepCount}
            notes={notes}
            nextSlide={nextSlide}
          />
          <PresenterKeyboardShortcut enabled={presenterEnabled && !readOnly} />
          <SlideBackground variant={background} />

          {showHeader ? (
            <header className="fixed inset-x-0 top-0 z-40 border-b border-transparent bg-background/50 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
                <Link href={deckTitleHref} className="text-sm font-semibold tracking-tight">
                  {deckTitle}
                </Link>
                <div className="flex items-center gap-2">
                  <SlideCommandCenter
                    current={current}
                    title={deckTitle}
                    slideOptions={slideOptions}
                  />
                  <PresenterPopoutButton />
                  <SlideshowThemeToggle />
                </div>
              </div>
            </header>
          ) : null}

          <main
            className={cn(
              "relative z-10 flex w-full",
              isFullscreen
                ? "h-svh box-border items-stretch p-0"
                : "mx-auto min-h-svh max-w-6xl items-start px-4 sm:px-6",
              isFullscreen && showHeader && "pt-20 sm:pt-24",
              isFullscreen && showFooter && "pb-16 sm:pb-20",
              !isFullscreen &&
                (showHeader ? "pt-28 sm:pt-32" : "pt-8 sm:pt-10"),
              !isFullscreen && (showFooter ? "pb-24 sm:pb-28" : "pb-4 sm:pb-6"),
            )}
          >
            <SlideStepAdvanceArea className={cn("w-full", isFullscreen && "h-full")}>
              <StaticMediaBoundary
                enabled={freezeMedia}
                activePath={`/slides/${currentSlug}`}
                className={cn(isFullscreen && "h-full")}
              >
                <div className={cn("w-full", isFullscreen && "h-full")}>{children}</div>
              </StaticMediaBoundary>
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
      </SlideContextProvider>
    </SlideStepper>
  )
}
