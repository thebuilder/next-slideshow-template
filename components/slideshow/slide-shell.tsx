import Link from "next/link"

import { SlideshowThemeToggle } from "@/components/slideshow/theme-toggle"
import { SlideNavigation } from "@/components/slideshow/slide-navigation"
import { SlideCommandCenter } from "@/components/slideshow/slide-command-center"
import {
  SlideStepAdvanceArea,
  SlideStepper,
} from "@/components/slideshow/slide-stepper"

type SlideShellProps = {
  children: React.ReactNode
  current: number
  total: number
  stepCount?: number
  previousHref?: string
  nextHref?: string
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
  slideOptions,
}: SlideShellProps) {
  return (
    <SlideStepper
      stepCount={stepCount}
      previousHref={previousHref}
      nextHref={nextHref}
    >
      <div className="relative min-h-svh overflow-hidden bg-background text-foreground">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-[-8rem] top-[-8rem] h-full bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.2),transparent_68%)] dark:bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.3),transparent_68%)]" />
          <div className="absolute inset-x-0 top-0 h-[72svh] bg-gradient-to-b from-[rgba(22,26,54,0.12)] via-[rgba(22,26,54,0.06)] to-transparent dark:from-[rgba(33,39,88,0.16)] dark:via-[rgba(33,39,88,0.08)] dark:to-transparent" />
          <div className="absolute right-0 bottom-0 h-[28rem] w-[28rem] rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />
        </div>

        <header className="fixed inset-x-0 top-0 z-40 border-b border-transparent bg-background/50 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <Link href="/" className="text-sm font-semibold tracking-tight">
              Hackathon 2026
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

        <main className="relative z-10 mx-auto flex min-h-svh w-full max-w-6xl items-start px-4 pt-28 pb-24 sm:px-6 sm:pt-32 sm:pb-28">
          <SlideStepAdvanceArea className="w-full">
            <div className="w-full">{children}</div>
          </SlideStepAdvanceArea>
        </main>

        <SlideNavigation
          current={current}
          total={total}
          previousHref={previousHref}
          nextHref={nextHref}
        />
      </div>
    </SlideStepper>
  )
}
