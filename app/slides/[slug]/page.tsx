import { notFound } from "next/navigation"

import { SlideShell } from "@/components/slideshow/slide-shell"
import { getSlideBySlug, slides } from "../../slides"
import {Metadata} from "next"

type SlidePageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return slides.map((slide) => ({ slug: slide.slug }))
}

export async function generateMetadata({ params }: SlidePageProps):Promise<Metadata> {
  const { slug } = await params
  const slide = getSlideBySlug(slug)

  if (!slide) {
    return {}
  }

  return {
    title: `${slide.title}`,
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
    title: item.title,
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
    >
      {slide.body}
    </SlideShell>
  )
}
