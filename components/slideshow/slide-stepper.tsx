"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import {
  PRESENTER_CHANNEL_NAME,
  type PresenterChannelMessage,
} from "@/types/presenter"
import { cn } from "@/lib/utils"

type SlideStepContextValue = {
  currentStep: number
  stepCount: number
  canAdvance: boolean
  canRetreat: boolean
  isReadOnly: boolean
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
  initialStep = 0,
  readOnly = false,
  previousHref,
  nextHref,
}: {
  children: React.ReactNode
  stepCount?: number
  initialStep?: number
  readOnly?: boolean
  previousHref?: string
  nextHref?: string
}) {
  const router = useRouter()
  const clampedInitialStep = Math.max(0, Math.min(initialStep, stepCount - 1))
  const [currentStep, setCurrentStep] = React.useState(clampedInitialStep)

  React.useEffect(() => {
    if (readOnly) {
      setCurrentStep(clampedInitialStep)
      return
    }

    setCurrentStep(0)
  }, [clampedInitialStep, readOnly, stepCount, nextHref, previousHref])

  const maxStepIndex = Math.max(stepCount - 1, 0)
  const canAdvance = !readOnly && stepCount > 0 && currentStep < maxStepIndex
  const canRetreat = !readOnly && stepCount > 0 && currentStep > 0

  const advance = React.useCallback(() => {
    if (readOnly) {
      return
    }

    setCurrentStep((value) => Math.min(value + 1, maxStepIndex))
  }, [maxStepIndex, readOnly])

  const retreat = React.useCallback(() => {
    if (readOnly) {
      return
    }

    setCurrentStep((value) => Math.max(value - 1, 0))
  }, [readOnly])

  const value = React.useMemo(
    () => ({
      currentStep,
      stepCount,
      canAdvance,
      canRetreat,
      isReadOnly: readOnly,
      advance,
      retreat,
    }),
    [advance, canAdvance, canRetreat, currentStep, readOnly, retreat, stepCount],
  )

  React.useEffect(() => {
    if (readOnly) {
      return
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (
        ["+", "=", "-", "_"].includes(event.key) ||
        ["Equal", "Minus", "NumpadAdd", "NumpadSubtract"].includes(event.code)
      ) {
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
  }, [
    advance,
    canAdvance,
    canRetreat,
    nextHref,
    previousHref,
    readOnly,
    retreat,
    router,
  ])

  React.useEffect(() => {
    if (readOnly || typeof BroadcastChannel === "undefined") {
      return
    }

    const channel = new BroadcastChannel(PRESENTER_CHANNEL_NAME)

    function handleMessage(event: MessageEvent<PresenterChannelMessage>) {
      if (event.data?.type === "navigate-previous") {
        if (canRetreat) {
          retreat()
          return
        }

        if (previousHref) {
          router.push(previousHref)
        }

        return
      }

      if (event.data?.type === "navigate-next") {
        if (canAdvance) {
          advance()
          return
        }

        if (nextHref) {
          router.push(nextHref)
        }

        return
      }

      if (event.data?.type === "navigate-to-slide") {
        router.push(event.data.href)
      }
    }

    channel.addEventListener("message", handleMessage)

    return () => {
      channel.removeEventListener("message", handleMessage)
      channel.close()
    }
  }, [
    advance,
    canAdvance,
    canRetreat,
    nextHref,
    previousHref,
    readOnly,
    retreat,
    router,
  ])

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
