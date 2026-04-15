import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { SlideShell } from "@/components/slideshow/slide-shell"
import { slideshowConfig } from "@/app/slideshow-config"
import { getAllSlideSlugs, getSlideBySlug, slides } from "../../slides"

type SlidePageProps = {
  params: Promise<{
    slug: string
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

export default async function SlidePage({ params }: SlidePageProps) {
  const isPdfExport = process.env.NEXT_PUBLIC_PDF_EXPORT === "1"
  const { slug } = await params
  const slide = getSlideBySlug(slug)

  if (!slide) {
    notFound()
  }

  const index = slides.findIndex((item) => item.slug === slide.slug)
  const previousSlide = slides[index - 1]
  const nextSlide = slides[index + 1]
  const nextNextSlide = slides[index + 2]
  const slideOptions = slides.map((item, itemIndex) => ({
    index: itemIndex + 1,
    title: item.navTitle ?? item.title,
    href: `/slides/${item.slug}`,
  }))
  const prefetchHrefs = [
    previousSlide ? `/slides/${previousSlide.slug}` : undefined,
    nextSlide ? `/slides/${nextSlide.slug}` : undefined,
    nextNextSlide ? `/slides/${nextNextSlide.slug}` : undefined,
  ].filter((href): href is string => Boolean(href))

  return (
    <SlideShell
      current={index + 1}
      total={slides.length}
      stepCount={slide.stepCount}
      previousHref={previousSlide ? `/slides/${previousSlide.slug}` : undefined}
      nextHref={nextSlide ? `/slides/${nextSlide.slug}` : undefined}
      prefetchHrefs={prefetchHrefs}
      slideOptions={slideOptions}
      title={slideshowConfig.header.brand}
      titleHref={slideshowConfig.header.href}
      headerMode={isPdfExport ? "hidden" : (slide.header ?? slideshowConfig.header.mode)}
      footerMode={isPdfExport ? "hidden" : (slide.footer ?? slideshowConfig.footer.mode)}
      layout={slide.layout}
      background={slide.background}
    >
      {slide.body}
    </SlideShell>
  )
}
