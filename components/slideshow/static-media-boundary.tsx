"use client"

import * as React from "react"
type StaticMediaBoundaryProps = {
  children: React.ReactNode
  enabled?: boolean
  className?: string
}

function freezeMedia(root: HTMLElement) {
  const mediaNodes = root.querySelectorAll<HTMLMediaElement>("video, audio")

  mediaNodes.forEach((media) => {
    media.muted = true
    media.autoplay = false
    media.pause()

    if (media instanceof HTMLVideoElement) {
      media.playsInline = true
      if (!media.hasAttribute("controls")) {
        media.controls = false
      }
    }
  })
}

export function StaticMediaBoundary({
  children,
  enabled = false,
  className,
}: StaticMediaBoundaryProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!enabled || !rootRef.current) {
      return
    }

    freezeMedia(rootRef.current)

    const observer = new MutationObserver(() => {
      if (!rootRef.current) {
        return
      }

      freezeMedia(rootRef.current)
    })

    observer.observe(rootRef.current, {
      childList: true,
      subtree: true,
    })

    return () => observer.disconnect()
  }, [enabled])

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  )
}
