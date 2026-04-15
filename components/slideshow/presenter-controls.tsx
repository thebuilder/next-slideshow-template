"use client"

import * as React from "react"
import { MonitorUp } from "lucide-react"

import { useSlideStepper } from "@/components/slideshow/slide-stepper"
import { Button } from "@/components/ui/button"
import {
  PRESENTER_CHANNEL_NAME,
  type PresenterChannelMessage,
  type PresenterSlideState,
} from "@/types/presenter"

type PresenterSyncProps = {
  enabled?: boolean
  current: number
  total: number
  slideTitles: string[]
  currentSlug: string
  currentTitle: string
  stepCount: number
  notes?: string
  nextSlide?: {
    slug: string
    title: string
  }
}

function buildPresenterState({
  current,
  total,
  slideTitles,
  currentSlug,
  currentTitle,
  stepCount,
  currentStep,
  notes,
  nextSlide,
}: PresenterSyncProps & {
  currentStep: number
}): PresenterSlideState {
  const preview =
    stepCount > 0 && currentStep < stepCount - 1
      ? {
          slug: currentSlug,
          title: currentTitle,
          step: currentStep + 1,
        }
      : nextSlide
        ? {
            slug: nextSlide.slug,
            title: nextSlide.title,
            step: 0,
          }
        : null

  return {
    slug: currentSlug,
    title: currentTitle,
    current,
    total,
    slideTitles,
    stepCount,
    currentStep,
    notes,
    preview,
    sentAt: Date.now(),
  }
}

export function PresenterSync(props: PresenterSyncProps) {
  const stepper = useSlideStepper()
  const channelRef = React.useRef<BroadcastChannel | null>(null)
  const currentStep = stepper?.currentStep ?? 0
  const state = React.useMemo(
    () =>
      buildPresenterState({
        ...props,
        currentStep,
      }),
    [currentStep, props],
  )
  const stateRef = React.useRef(state)

  React.useEffect(() => {
    stateRef.current = state
  }, [state])

  React.useEffect(() => {
    if (!props.enabled) {
      return
    }

    if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
      return
    }

    const channel = new BroadcastChannel(PRESENTER_CHANNEL_NAME)
    channelRef.current = channel

    function handleMessage(event: MessageEvent<PresenterChannelMessage>) {
      if (event.data?.type !== "request-state") {
        return
      }

      channel.postMessage({
        type: "slide-state",
        payload: stateRef.current,
      } satisfies PresenterChannelMessage)
    }

    channel.addEventListener("message", handleMessage)

    return () => {
      channel.removeEventListener("message", handleMessage)
      channel.close()
      channelRef.current = null
    }
  }, [props.enabled])

  React.useEffect(() => {
    if (!props.enabled || !channelRef.current) {
      return
    }

    channelRef.current.postMessage({
      type: "slide-state",
      payload: state,
    } satisfies PresenterChannelMessage)
  }, [props.enabled, state])

  return null
}

export function PresenterPopoutButton() {
  function handleOpen() {
    const presenterWindow = window.open(
      "/presenter",
      "slideshow-presenter",
      "popup=yes,width=1420,height=920,left=80,top=60",
    )

    presenterWindow?.focus()
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      onClick={handleOpen}
      className="border-border/70 bg-background/80 text-muted-foreground backdrop-blur-sm hover:bg-accent/70 hover:text-foreground"
      title="Open presenter view"
      aria-label="Open presenter view"
    >
      <MonitorUp />
    </Button>
  )
}
