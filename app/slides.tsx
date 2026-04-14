import type { SlideDefinition } from "@/types/slides"

import { CodeBlock } from "@/components/slideshow/code-block"
import {
  BulletList,
  FeatureGrid,
} from "@/app/slides/blocks/collections"
import {
  BreakerSlide,
  ContentSlideCard,
  HeroSlide,
  OpenContentSlide,
} from "@/app/slides/blocks/templates"
import { ImageShowcaseSlide } from "@/app/slides/blocks/media"
import { Eyebrow } from "@/app/slides/blocks/typography"
import { SlideStep } from "@/components/slideshow/slide-stepper"
import templateCapabilitiesImage from "@/public/images/template-capabilities.svg"

export const slides: SlideDefinition[] = [
  {
    slug: "intro",
    title: "Slideshow Base",
    body: (
      <HeroSlide
        eyebrow="Reusable Next.js template"
        title="Build polished slides fast"
        description="Keyboard controls, step reveals, command center, themed UI, and flexible layout options out of the box."
      />
    ),
  },
  {
    slug: "capabilities",
    title: "Capabilities",
    body: (
      <ContentSlideCard
        eyebrow="Capabilities"
        title="A production-ready slideshow baseline"
        description="The template focuses on practical presentation features you can reuse in demos, talks, and product walkthroughs."
      >
        <FeatureGrid
          items={[
            {
              title: "Step-based reveals",
              description:
                "Progressively reveal dense content with `stepCount` and `SlideStep`, while preserving keyboard and click progression.",
            },
            {
              title: "Fast navigation",
              description:
                "Arrow keys + command center (`Cmd/Ctrl + K`) make it easy to jump and control flow live.",
            },
            {
              title: "Theme support",
              description:
                "Built-in light/dark switching works with shadcn tokens so slides match your app styling.",
            },
            {
              title: "Config-driven metadata",
              description:
                "One shared config powers document metadata and header branding, reducing duplicated strings.",
            },
            {
              title: "Layout control",
              description:
                "Use default or fullscreen layout per slide without custom wrappers or route-level hacks.",
            },
            {
              title: "Background variants",
              description:
                "Switch between default, spotlight, grid, or no background for different storytelling moments.",
            },
          ]}
        />
      </ContentSlideCard>
    ),
  },
  {
    slug: "navigation",
    title: "Navigation",
    body: (
      <OpenContentSlide
        eyebrow="Navigation"
        title="Control the presentation without touching the URL"
      >
        <BulletList
          items={[
            <>
              Use <code>Arrow Left</code> / <code>Arrow Right</code> for
              previous/next.
            </>,
            <>
              Use <code>Page Up</code> / <code>Page Down</code> for the same
              flow when presenting.
            </>,
            <>
              Hit <code>Cmd/Ctrl + K</code> to open the command center and jump
              to any slide.
            </>,
            <>
              Click anywhere outside interactive controls to advance within a
              stepped slide.
            </>,
          ]}
        />
      </OpenContentSlide>
    ),
  },
  {
    slug: "step-reveals",
    title: "Step Reveals",
    body: (
      <ContentSlideCard
        eyebrow="Stepped content"
        title="Reveal information in phases"
        description="This slide uses `stepCount={4}` with `SlideStep` blocks."
      >
        <div className="grid gap-3">
          <SlideStep step={0}>
            <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
              <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                Step 1
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Start with the core problem or context.
              </p>
            </div>
          </SlideStep>

          <SlideStep step={1}>
            <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
              <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                Step 2
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Add supporting evidence once the audience is aligned.
              </p>
            </div>
          </SlideStep>

          <SlideStep step={2}>
            <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
              <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                Step 3
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Show options and tradeoffs before deciding.
              </p>
            </div>
          </SlideStep>

          <SlideStep step={3}>
            <div className="rounded-2xl border border-primary/40 bg-primary/8 p-4">
              <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                Step 4
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Land on one recommendation and the next action.
              </p>
            </div>
          </SlideStep>
        </div>
      </ContentSlideCard>
    ),
    stepCount: 4,
  },
  {
    slug: "layout-and-background",
    title: "Layout and Background",
    body: (
      <BreakerSlide
        eyebrow="Layout + background"
        title="Each slide can pick its own frame"
        description="Use per-slide `layout`, `header`, and `background` settings to switch from standard narrative mode to fullscreen visual mode."
      />
    ),
    background: "spotlight",
  },
  {
    slug: "image-slide",
    title: "Image Slide",
    body: (
      <ImageShowcaseSlide
        image={{
          src: templateCapabilitiesImage,
          alt: "Capability map for the slideshow template",
          fit: "contain",
          caption: "Use this for diagrams, mockups, or campaign visuals.",
          credit: "Generated template asset",
        }}
      >
        <Eyebrow>Image slide</Eyebrow>
        <h2 className="text-3xl font-semibold tracking-tight">
          Media-first storytelling
        </h2>
        <p className="text-sm leading-7 text-muted-foreground">
          Keep image slides as regular `body` composition with reusable
          components.
        </p>
      </ImageShowcaseSlide>
    ),
    layout: "fullscreen",
    background: "grid",
  },
  {
    slug: "fullscreen",
    title: "Fullscreen",
    body: (
      <section className="flex min-h-[calc(100svh-5.5rem)] items-center justify-center">
        <div className="mx-auto max-w-5xl text-center">
          <Eyebrow>Fullscreen mode</Eyebrow>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Use the entire canvas for impact slides
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Fullscreen slides can hide header chrome and pair with custom
            backgrounds for transitions or key announcements.
          </p>
        </div>
      </section>
    ),
    layout: "fullscreen",
    header: "hidden",
    background: "none",
  },
  {
    slug: "authoring",
    title: "Authoring Example",
    body: (
      <ContentSlideCard
        eyebrow="Authoring"
        title="Slide definitions stay small"
        description="Author slide metadata in one place and pull visuals from reusable components."
      >
        <CodeBlock
          code={`{
  slug: "image",
  title: "Image-first slide",
  body: (
    <ImageShowcaseSlide
      image={{ src: myImage, alt: "Capability map", placeholder: "blur" }}
    />
  ),
  layout: "fullscreen",
  background: "none",
  header: "hidden"
}`}
          language="typescript"
        />
      </ContentSlideCard>
    ),
  },
  {
    slug: "outro",
    title: "Use It",
    body: (
      <HeroSlide
        eyebrow="Ready"
        title="Start from this template"
        description="Replace the demo slides, keep the structure, and ship presentation-grade decks faster."
      />
    ),
  },
]

export function getSlideBySlug(slug: string) {
  return slides.find((slide) => slide.slug === slug)
}
