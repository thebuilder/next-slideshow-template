import type { ReactNode } from "react"

export type SlideHeaderMode = "hidden" | "visible" | "auto"
export type SlideFooterMode = "hidden" | "visible" | "counter"

export type SlideLayoutMode = "default" | "fullscreen"

export type SlideBackgroundMode = "default" | "none" | "spotlight" | "grid"

type BaseSlideDefinition = {
  slug: string
  title: string
  notes?: string
  stepCount?: number
  header?: SlideHeaderMode
  footer?: SlideFooterMode
  layout?: SlideLayoutMode
  background?: SlideBackgroundMode
  body: ReactNode
}
export type SlideDefinition = BaseSlideDefinition

export type SlideshowConfig = {
  title: string
  description: string
  header: {
    mode: SlideHeaderMode
    brand: string
    href: string
  }
  footer: {
    mode: SlideFooterMode
  }
}
