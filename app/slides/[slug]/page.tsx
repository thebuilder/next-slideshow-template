import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { SlideShell } from "@/components/slideshow/slide-shell"
import { slideshowConfig } from "@/app/slideshow-config"
import { getAllSlideSlugs, getSlideBySlug, slides } from "../../slides"

type SlidePageProps = {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    presenterPreview?: string
    step?: string
  }>
}

export function generateStaticParams() {
  return getAllSlideSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: SlidePageProps): Promise<Metadata> {
  const { slug } = await params
  const slide = getSlideBySlug(slug)

  if (!slide) {
    return {}
  }

  if (slide.title === slideshowConfig.title) {
    return {
      title: {
        absolute: slide.title,
      },
    }
  }

  return {
    title: slide.title,
  }
}

function parseStep(value: string | undefined) {
  if (!value) {
    return 0
  }

  const parsed = Number.parseInt(value, 10)

  if (Number.isNaN(parsed) || parsed < 0) {
    return 0
  }

  return parsed
}

export default async function SlidePage({ params, searchParams }: SlidePageProps) {
  const isPdfExport = process.env.NEXT_PUBLIC_PDF_EXPORT === "1"
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const slide = getSlideBySlug(slug)

  if (!slide) {
    notFound()
  }

  const isPresenterPreview = resolvedSearchParams.presenterPreview === "1"
  const previewStep = parseStep(resolvedSearchParams.step)

  const index = slides.findIndex((item) => item.slug === slide.slug)
  const previousSlide = slides[index - 1]
  const nextSlide = slides[index + 1]
  const nextNextSlide = slides[index + 2]
  const slideOptions = slides.map((item, itemIndex) => ({
    index: itemIndex + 1,
    title: item.title,
    slug: item.slug,
    href: `/slides/${item.slug}`,
  }))
  const prefetchHrefs = [
    previousSlide ? `/slides/${previousSlide.slug}` : undefined,
    nextSlide ? `/slides/${nextSlide.slug}` : undefined,
    nextNextSlide ? `/slides/${nextNextSlide.slug}` : undefined,
  ].filter((href): href is string => Boolean(href))
  const maxStepIndex = Math.max((slide.stepCount ?? 0) - 1, 0)
  const previewStepClamped = Math.min(previewStep, maxStepIndex)

  return (
    <SlideShell
      current={index + 1}
      total={slides.length}
      stepCount={slide.stepCount}
      previousHref={previousSlide ? `/slides/${previousSlide.slug}` : undefined}
      nextHref={nextSlide ? `/slides/${nextSlide.slug}` : undefined}
      prefetchHrefs={prefetchHrefs}
      slideOptions={slideOptions}
      deckTitle={slideshowConfig.header.brand}
      deckTitleHref={slideshowConfig.header.href}
      slideTitle={slide.title}
      headerMode={
        isPdfExport || isPresenterPreview
          ? "hidden"
          : (slide.header ?? slideshowConfig.header.mode)
      }
      footerMode={
        isPdfExport || isPresenterPreview
          ? "hidden"
          : (slide.footer ?? slideshowConfig.footer.mode)
      }
      layout={slide.layout}
      background={slide.background}
      notes={slide.notes}
      currentSlug={slide.slug}
      nextSlide={
        nextSlide
          ? {
              slug: nextSlide.slug,
              title: nextSlide.title,
            }
          : undefined
      }
      readOnly={isPresenterPreview}
      initialStep={previewStepClamped}
      presenterEnabled={!isPresenterPreview}
      freezeMedia={isPresenterPreview}
    >
      {slide.body}
    </SlideShell>
  )
}
