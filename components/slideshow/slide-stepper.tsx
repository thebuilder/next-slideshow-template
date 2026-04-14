"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"

type SlideStepContextValue = {
  currentStep: number
  stepCount: number
  canAdvance: boolean
  canRetreat: boolean
  advance: () => void
  retreat: () => void
}

const SlideStepContext = React.createContext<SlideStepContextValue | null>(null)

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return Boolean(
    target.closest(
      "a, button, input, textarea, select, summary, details, [role='button'], [contenteditable='true'], [data-step-ignore-click='true']",
    ),
  )
}

export function useSlideStepper() {
  return React.useContext(SlideStepContext)
}

export function SlideStepper({
  children,
  stepCount = 0,
  previousHref,
  nextHref,
}: {
  children: React.ReactNode
  stepCount?: number
  previousHref?: string
  nextHref?: string
}) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(0)

  React.useEffect(() => {
    setCurrentStep(0)
  }, [stepCount, nextHref, previousHref])

  const maxStepIndex = Math.max(stepCount - 1, 0)
  const canAdvance = stepCount > 0 && currentStep < maxStepIndex
  const canRetreat = stepCount > 0 && currentStep > 0

  const advance = React.useCallback(() => {
    setCurrentStep((value) => Math.min(value + 1, maxStepIndex))
  }, [maxStepIndex])

  const retreat = React.useCallback(() => {
    setCurrentStep((value) => Math.max(value - 1, 0))
  }, [])

  const value = React.useMemo(
    () => ({
      currentStep,
      stepCount,
      canAdvance,
      canRetreat,
      advance,
      retreat,
    }),
    [advance, canAdvance, canRetreat, currentStep, retreat, stepCount],
  )

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (isInteractiveTarget(event.target)) {
        return
      }

      if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
        if (canRetreat) {
          event.preventDefault()
          retreat()
          return
        }

        if (previousHref) {
          event.preventDefault()
          router.push(previousHref)
        }

        return
      }

      if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key)) {
        if (canAdvance) {
          event.preventDefault()
          advance()
          return
        }

        if (nextHref) {
          event.preventDefault()
          router.push(nextHref)
        }
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [advance, canAdvance, canRetreat, nextHref, previousHref, retreat, router])

  return <SlideStepContext.Provider value={value}>{children}</SlideStepContext.Provider>
}

export function SlideStep({
  step,
  children,
  className,
  mountOnReveal = false,
}: {
  step: number
  children: React.ReactNode
  className?: string
  mountOnReveal?: boolean
}) {
  const context = useSlideStepper()
  const isVisible = context ? step <= context.currentStep : true
  const stepRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!context || !isVisible || context.currentStep !== step) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      stepRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [context, isVisible, step])

  if (mountOnReveal && !isVisible) {
    return (
      <div
        ref={stepRef}
        aria-hidden
        className={cn("scroll-mt-32 scroll-mb-28 sm:scroll-mb-32", className)}
      />
    )
  }

  return (
    <div
      ref={stepRef}
      aria-hidden={!isVisible}
      className={cn(
        "scroll-mt-32 scroll-mb-28 transition-opacity duration-300 ease-out sm:scroll-mb-32",
        !isVisible && "pointer-events-none opacity-0",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function SlideStepAdvanceArea({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const context = useSlideStepper()

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!context?.canAdvance || isInteractiveTarget(event.target)) {
      return
    }

    context.advance()
  }

  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  )
}
