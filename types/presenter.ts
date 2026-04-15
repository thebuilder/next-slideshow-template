export const PRESENTER_CHANNEL_NAME = "slideshow-presenter-sync"

export type PresenterPreviewState = {
  slug: string
  title: string
  step: number
}

export type PresenterSlideState = {
  slug: string
  title: string
  current: number
  total: number
  slideTitles: string[]
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
