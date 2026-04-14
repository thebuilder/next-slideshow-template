"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { useSlideStepper } from "@/components/slideshow/slide-stepper"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type SlideNavigationProps = {
  current: number
  total: number
  previousHref?: string
  nextHref?: string
}

export function SlideNavigation({
  current,
  total,
  previousHref,
  nextHref,
}: SlideNavigationProps) {
  const router = useRouter()
  const stepper = useSlideStepper()

  function handlePrevious() {
    if (stepper?.canRetreat) {
      stepper.retreat()
      return
    }

    if (previousHref) {
      router.push(previousHref)
    }
  }

  function handleNext() {
    if (stepper?.canAdvance) {
      stepper.advance()
      return
    }

    if (nextHref) {
      router.push(nextHref)
    }
  }

  const hasPrevious = Boolean(previousHref || stepper?.canRetreat)
  const hasNext = Boolean(nextHref || stepper?.canAdvance)

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/75 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={!hasPrevious}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            !hasPrevious && "pointer-events-none opacity-50",
          )}
        >
          <ArrowLeft />
          Previous
        </Button>

        <div className="min-w-0 text-center">
          <p className="text-xs font-medium tabular-nums uppercase tracking-[0.2em] text-muted-foreground">
            Slide {current} of {total}
          </p>
        </div>

        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={handleNext}
          disabled={!hasNext}
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            !hasNext && "pointer-events-none opacity-50",
          )}
        >
          Next
          <ArrowRight />
        </Button>
      </div>
    </div>
  )
}
