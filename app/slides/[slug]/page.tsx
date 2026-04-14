import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { SlideShell } from "@/components/slideshow/slide-shell"
import { slideshowConfig } from "@/app/slideshow-config"
import { getSlideBySlug, slides } from "../../slides"

type SlidePageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return slides.map((slide) => ({ slug: slide.slug }))
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
  const { slug } = await params
  const slide = getSlideBySlug(slug)

  if (!slide) {
    notFound()
  }

  const index = slides.findIndex((item) => item.slug === slide.slug)
  const previousSlide = slides[index - 1]
  const nextSlide = slides[index + 1]
  const slideOptions = slides.map((item, itemIndex) => ({
    index: itemIndex + 1,
    title: item.navTitle ?? item.title,
    href: `/slides/${item.slug}`,
  }))

  return (
    <SlideShell
      current={index + 1}
      total={slides.length}
      stepCount={slide.stepCount}
      previousHref={previousSlide ? `/slides/${previousSlide.slug}` : undefined}
      nextHref={nextSlide ? `/slides/${nextSlide.slug}` : undefined}
      slideOptions={slideOptions}
      title={slideshowConfig.header.brand}
      titleHref={slideshowConfig.header.href}
      headerMode={slide.header ?? slideshowConfig.header.mode}
      footerMode={slide.footer ?? slideshowConfig.footer.mode}
      layout={slide.layout}
      background={slide.background}
    >
      {slide.body}
    </SlideShell>
  )
}
