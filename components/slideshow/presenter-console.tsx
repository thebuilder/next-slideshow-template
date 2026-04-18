"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react"

import {
  PRESENTER_CHANNEL_NAME,
  type PresenterChannelMessage,
  type PresenterSlideState,
} from "@/types/presenter"
import { Button } from "@/components/ui/button"

function formatClock(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date)
}

function formatElapsed(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [hours, minutes, seconds]
    .map((value) => value.toString().padStart(2, "0"))
    .join(":")
}

function getFlowWindow(state: PresenterSlideState | null) {
  if (!state) {
    return []
  }

  const currentIndex = state.current - 1
  const start = Math.max(0, currentIndex - 2)
  const end = Math.min(state.slides.length - 1, currentIndex + 5)

  return state.slides.slice(start, end + 1).map((slide, offset) => {
    const index = start + offset
    return {
      index,
      title: slide.title,
      href: slide.href,
      isCurrent: index === currentIndex,
    }
  })
}

const previewCanvasWidth = 1920
const previewCanvasHeight = 1080
const previewAspectRatio = previewCanvasWidth / previewCanvasHeight

function PreviewFrame({
  previewUrl,
  emptyLabel = "End of deck",
  titlePrefix = "Preview",
}: {
  previewUrl: string | null
  emptyLabel?: string
  titlePrefix?: string
}) {
  const [activeLayer, setActiveLayer] = React.useState<0 | 1>(0)
  const [layerUrls, setLayerUrls] = React.useState<[string | null, string | null]>([
    previewUrl,
    null,
  ])

  React.useEffect(() => {
    if (!previewUrl) {
      setLayerUrls((previous) => {
        if (previous[0] === null && previous[1] === null) {
          return previous
        }

        return [null, null]
      })
      return
    }

    setLayerUrls((previous) => {
      const currentActiveUrl = previous[activeLayer]

      if (currentActiveUrl === previewUrl) {
        return previous
      }

      const hiddenLayer = activeLayer === 0 ? 1 : 0

      if (previous[hiddenLayer] === previewUrl) {
        return previous
      }

      const nextUrls: [string | null, string | null] = [...previous]
      nextUrls[hiddenLayer] = previewUrl
      return nextUrls
    })
  }, [activeLayer, previewUrl])

  function handleLoad(layer: 0 | 1) {
    if (layerUrls[layer] !== previewUrl || !previewUrl) {
      return
    }

    setActiveLayer(layer)
  }

  if (!previewUrl) {
    return (
      <div className="grid h-full place-items-center text-sm text-muted-foreground">
        {emptyLabel}
      </div>
    )
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-card/40"
      style={{ containerType: "size" }}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: previewCanvasWidth,
          height: previewCanvasHeight,
          transform:
            "translate(-50%, -50%) scale(min(calc(100cqw / 1920px), calc(100cqh / 1080px)))",
          transformOrigin: "center center",
        }}
      >
        {[0, 1].map((layer) => {
          const src = layerUrls[layer as 0 | 1]

          if (!src) {
            return null
          }

          const isActive = activeLayer === layer

          return (
            <iframe
              key={`${layer}-${src}`}
              title={`${titlePrefix} ${layer + 1}`}
              src={src}
              onLoad={() => handleLoad(layer as 0 | 1)}
              className={`absolute inset-0 border-0 transition-opacity duration-150 ${
                isActive ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              style={{
                width: previewCanvasWidth,
                height: previewCanvasHeight,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export function PresenterConsole() {
  const [state, setState] = React.useState<PresenterSlideState | null>(null)
  const [connected, setConnected] = React.useState(false)
  const [clock, setClock] = React.useState(() => new Date())
  const [startedAt, setStartedAt] = React.useState<number | null>(null)
  const [notesFontSize, setNotesFontSize] = React.useState(1.5)
  const channelRef = React.useRef<BroadcastChannel | null>(null)

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(new Date())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  React.useEffect(() => {
    if (typeof BroadcastChannel === "undefined") {
      return
    }

    const channel = new BroadcastChannel(PRESENTER_CHANNEL_NAME)
    channelRef.current = channel

    function handleMessage(event: MessageEvent<PresenterChannelMessage>) {
      if (event.data?.type !== "slide-state") {
        return
      }

      setConnected(true)
      setState(event.data.payload)
      setStartedAt((value) => value ?? Date.now())
    }

    channel.addEventListener("message", handleMessage)
    channel.postMessage({ type: "request-state" } satisfies PresenterChannelMessage)

    return () => {
      channel.removeEventListener("message", handleMessage)
      channel.close()
      channelRef.current = null
    }
  }, [])

  const elapsed = startedAt ? formatElapsed(Date.now() - startedAt) : "00:00:00"
  const currentSlideUrl = state
    ? `/slides/${state.slug}?presenterPreview=1&step=${state.currentStep}`
    : null
  const nextStepPreviewUrl = state?.preview
    ? `/slides/${state.preview.slug}?presenterPreview=1&step=${state.preview.step}`
    : null
  const notesLineHeight = Number((notesFontSize * 1.45).toFixed(2))
  const flowItems = getFlowWindow(state)
  const canNavigatePrevious = Boolean(
    state && (state.current > 1 || state.currentStep > 0),
  )
  const canNavigateNext = Boolean(state?.preview)

  function sendNavigationMessage(
    message: Extract<
      PresenterChannelMessage,
      | { type: "navigate-previous" }
      | { type: "navigate-next" }
      | { type: "navigate-to-slide" }
    >,
  ) {
    channelRef.current?.postMessage(message)
  }

  return (
    <div className="grid h-svh grid-cols-1 overflow-hidden bg-background text-foreground lg:grid-cols-[22rem_1fr]">
      <aside className="flex min-h-0 flex-col overflow-hidden border-b border-border/70 p-6 lg:border-r lg:border-b-0">
        <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
          Presenter View
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border/70 bg-card/60 p-3">
            <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Timer
            </p>
            <p className="mt-2 text-xl font-semibold tabular-nums">{elapsed}</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-card/60 p-3">
            <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Current Time
            </p>
            <p className="mt-2 text-xl font-semibold tabular-nums">{formatClock(clock)}</p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-border/70 bg-card/60 p-4">
          <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Next Step Preview
          </p>
          <div
            className="relative mt-3 w-full overflow-hidden rounded-xl border border-border/70 bg-card/40"
            style={{ aspectRatio: previewAspectRatio }}
          >
            <PreviewFrame
              previewUrl={nextStepPreviewUrl}
              titlePrefix="Next step preview"
            />
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-border/70 bg-card/60 p-3">
          <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Flow
          </p>
          <div className="mt-2 space-y-1">
            {flowItems.length ? (
              flowItems.map((item) => (
                <button
                  key={`${item.index}-${item.title}`}
                  type="button"
                  onClick={() =>
                    sendNavigationMessage({
                      type: "navigate-to-slide",
                      href: item.href,
                    })
                  }
                  className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-left ${
                    item.isCurrent
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
                >
                  <span className="min-w-7 text-xs font-medium tabular-nums">
                    {item.index + 1}
                  </span>
                  <span className="truncate text-sm">{item.title}</span>
                </button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Waiting for slideshow flow...
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => sendNavigationMessage({ type: "navigate-previous" })}
            disabled={!canNavigatePrevious}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <Button
            type="button"
            className="gap-2"
            onClick={() => sendNavigationMessage({ type: "navigate-next" })}
            disabled={!canNavigateNext}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>

        <p className="mt-auto pt-4 text-xs text-muted-foreground">
          {connected
            ? "Connected via BroadcastChannel."
            : "Waiting for connection from the slideshow tab."}
        </p>
      </aside>

      <section className="flex min-h-0 flex-col overflow-hidden p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Current Slide
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight">
              {state?.title ?? "Waiting for slideshow"}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border/70 bg-card/60 px-3 py-1 font-medium">
              {state
                ? `Slide ${state.current} of ${state.total}`
                : "Open a slide tab and start presenting"}
            </span>
            {state ? (
              <span className="rounded-full border border-border/70 bg-card/60 px-3 py-1 font-medium">
                Step {state.currentStep + 1} of {Math.max(state.stepCount, 1)}
              </span>
            ) : null}
          </div>
        </div>

        <div
          className="relative w-full overflow-hidden rounded-2xl border border-border/70 bg-card/40"
          style={{ aspectRatio: previewAspectRatio }}
        >
          <PreviewFrame
            previewUrl={currentSlideUrl}
            emptyLabel="Waiting for current slide preview"
            titlePrefix="Current slide preview"
          />
        </div>

        <div className="mt-5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/80">
          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            <p
              className="text-foreground whitespace-pre-wrap"
              style={{
                fontSize: `${notesFontSize}rem`,
                lineHeight: `${notesLineHeight}rem`,
              }}
            >
              {state?.notes?.trim().length ? state.notes : ""}
            </p>
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-border/70 px-4 py-3">
            <p className="mr-1 text-sm font-medium tabular-nums text-muted-foreground">
              {notesFontSize.toFixed(2)}rem
            </p>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Decrease presenter notes font size"
              onClick={() =>
                setNotesFontSize((value) =>
                  Number(Math.max(1, value - 0.125).toFixed(3)),
                )
              }
            >
              <Minus />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Increase presenter notes font size"
              onClick={() =>
                setNotesFontSize((value) =>
                  Number(Math.min(4, value + 0.125).toFixed(3)),
                )
              }
            >
              <Plus />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
