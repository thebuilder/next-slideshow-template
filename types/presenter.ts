export const PRESENTER_CHANNEL_NAME = "slideshow-presenter-sync"

export type PresenterPreviewState = {
  slug: string
  title: string
  step: number
}

export type PresenterSlideListItem = {
  title: string
  href: string
}

export type PresenterSlideState = {
  slug: string
  title: string
  current: number
  total: number
  slides: PresenterSlideListItem[]
  stepCount: number
  currentStep: number
  notes?: string
  preview: PresenterPreviewState | null
  sentAt: number
}

export type PresenterChannelMessage =
  | {
      type: "request-state"
    }
  | {
      type: "slide-state"
      payload: PresenterSlideState
    }
  | {
      type: "navigate-previous"
    }
  | {
      type: "navigate-next"
    }
  | {
      type: "navigate-to-slide"
      href: string
    }
