"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

type StaticMediaBoundaryProps = {
  children: React.ReactNode
  enabled?: boolean
  className?: string
  activePath?: string
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
  activePath,
}: StaticMediaBoundaryProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const pathname = usePathname()

  React.useEffect(() => {
    if (!rootRef.current) {
      return
    }

    if (activePath && pathname !== activePath) {
      freezeMedia(rootRef.current)
      return
    }

    if (!enabled) {
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
  }, [activePath, enabled, pathname])

  React.useEffect(() => {
    function handleVisibilityChange() {
      if (!document.hidden || !rootRef.current) {
        return
      }

      freezeMedia(rootRef.current)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  )
}
