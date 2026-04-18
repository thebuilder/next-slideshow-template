import Link from "next/link"

import { slideshowConfig } from "@/app/slideshow-config"
import { SlideShell } from "@/components/slideshow/slide-shell"

export default function SlidesNotFoundPage() {
  return (
    <SlideShell
      current={1}
      total={1}
      stepCount={0}
      slideOptions={[]}
      currentSlug="not-found"
      deckTitle={slideshowConfig.header.brand}
      deckTitleHref={slideshowConfig.header.href}
      slideTitle="Page not found"
      headerMode={slideshowConfig.header.mode}
      footerMode="hidden"
      layout="default"
    >
      <section className="flex min-h-[calc(100svh-16rem)] items-center py-8 sm:py-12">
        <div className="space-y-6">
          <p className="text-sm font-semibold tracking-[0.3em] text-primary uppercase">
            Page not found
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-pretty sm:text-5xl lg:text-6xl">
            We couldn&apos;t find that slide.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            The link may be old, or the URL may be incorrect. Start from the
            first slide and navigate from there.
          </p>
          <div>
            <Link
              href="/"
              className="inline-flex rounded-md border border-border/70 bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Go to first slide
            </Link>
          </div>
        </div>
      </section>
    </SlideShell>
  )
}
