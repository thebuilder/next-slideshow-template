"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"

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
  const end = Math.min(state.slideTitles.length - 1, currentIndex + 5)

  return state.slideTitles.slice(start, end + 1).map((title, offset) => {
    const index = start + offset
    return {
      index,
      title,
      isCurrent: index === currentIndex,
    }
  })
}

function PreviewFrame({ previewUrl }: { previewUrl: string | null }) {
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
        End of deck
      </div>
    )
  }

  return (
    <div className="relative h-full w-full bg-card/40">
      {[0, 1].map((layer) => {
        const src = layerUrls[layer as 0 | 1]

        if (!src) {
          return null
        }

        const isActive = activeLayer === layer

        return (
          <iframe
            key={`${layer}-${src}`}
            title={`Next step preview ${layer + 1}`}
            src={src}
            onLoad={() => handleLoad(layer as 0 | 1)}
            className={`absolute inset-0 h-full w-full transition-opacity duration-150 ${
              isActive ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          />
        )
      })}
    </div>
  )
}

export function PresenterConsole() {
  const [state, setState] = React.useState<PresenterSlideState | null>(null)
  const [connected, setConnected] = React.useState(false)
  const [clock, setClock] = React.useState(() => new Date())
  const [startedAt, setStartedAt] = React.useState<number | null>(null)
  const [notesFontSize, setNotesFontSize] = React.useState(1.5)

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
    }
  }, [])

  const elapsed = startedAt ? formatElapsed(Date.now() - startedAt) : "00:00:00"
  const previewUrl = state?.preview
    ? `/slides/${state.preview.slug}?presenterPreview=1&step=${state.preview.step}`
    : null
  const notesLineHeight = Number((notesFontSize * 1.45).toFixed(2))
  const flowItems = getFlowWindow(state)

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
            Current Slide
          </p>
          <p className="mt-2 text-lg font-semibold">{state?.title ?? "Waiting for slideshow"}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {state ? `Slide ${state.current} of ${state.total}` : "Open a slide tab and start presenting"}
          </p>
          {state ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Step {state.currentStep + 1} of {Math.max(state.stepCount, 1)}
            </p>
          ) : null}
        </div>

        <div className="mt-4 rounded-xl border border-border/70 bg-card/60 p-3">
          <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Flow
          </p>
          <div className="mt-2 space-y-1">
            {flowItems.length ? (
              flowItems.map((item) => (
                <div
                  key={`${item.index}-${item.title}`}
                  className={`flex items-center gap-2 rounded-md px-2 py-1 ${
                    item.isCurrent
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <span className="min-w-7 text-xs font-medium tabular-nums">
                    {item.index + 1}
                  </span>
                  <span className="truncate text-sm">{item.title}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Waiting for slideshow flow...
              </p>
            )}
          </div>
        </div>

        <p className="mt-auto pt-4 text-xs text-muted-foreground">
          {connected
            ? "Connected via BroadcastChannel."
            : "Waiting for connection from the slideshow tab."}
        </p>
      </aside>

      <section className="flex min-h-0 flex-col overflow-hidden p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold tracking-tight">Next Step Preview</h2>
          <p className="text-xs text-muted-foreground">
            {state?.preview
              ? `${state.preview.title} · Step ${state.preview.step + 1}`
              : "No upcoming preview"}
          </p>
        </div>

        <div className="h-[min(62vh,48rem)] overflow-hidden rounded-2xl border border-border/70 bg-card/40">
          <PreviewFrame previewUrl={previewUrl} />
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
