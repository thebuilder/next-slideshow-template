"use client"

import * as React from "react"

type SlideContextValue = {
  title?: React.ReactNode
  isPresenterPreview: boolean
}

type SlideContextProviderProps = SlideContextValue & {
  children: React.ReactNode
}

const SlideContext = React.createContext<SlideContextValue>({
  title: undefined,
  isPresenterPreview: false,
})

export function SlideContextProvider({
  title,
  isPresenterPreview = false,
  children,
}: SlideContextProviderProps) {
  return (
    <SlideContext.Provider value={{ title, isPresenterPreview }}>
      {children}
    </SlideContext.Provider>
  )
}

export function useSlideContext() {
  return React.useContext(SlideContext)
}

export function useSlideTitle() {
  return useSlideContext().title
}

export function useIsPresenterPreview() {
  return useSlideContext().isPresenterPreview
}
