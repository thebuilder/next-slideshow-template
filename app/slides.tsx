import { CodeBlock } from "@/components/slideshow/code-block"
import { SlideStep } from "@/components/slideshow/slide-stepper"
import { TextEffect } from "@/components/ui/text-effect"

export type SlideDefinition = {
  slug: string
  title: string
  body: React.ReactNode
  stepCount?: number
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold tracking-[0.3em] text-pretty text-primary uppercase">
      {children}
    </p>
  )
}

function SlideHeading({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="space-y-3">
      <h1 className="max-w-5xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[3.5rem] lg:leading-[1.02]">
        {title}
      </h1>
      {description ? (
        <p className="max-w-3xl text-base leading-7 text-pretty text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  )
}

function ContentCard({
  eyebrow,
  title,
  description,
  children,
  bodyVariant = "panel",
  animateHeader = false,
}: {
  eyebrow: string
  title: string
  description?: string
  children: React.ReactNode
  bodyVariant?: "panel" | "open"
  animateHeader?: boolean
}) {
  return (
    <div className="space-y-6">
      {animateHeader ? (
        <div className="space-y-3">
          <div>
            <TextEffect
              as="p"
              per="char"
              preset="blur"
              delay={0.06}
              speedReveal={0.95}
              speedSegment={1}
              className="text-sm font-semibold tracking-[0.3em] text-pretty text-primary uppercase"
            >
              {eyebrow}
            </TextEffect>
          </div>
          <div>
            <TextEffect
              as="h1"
              per="char"
              preset="blur"
              delay={0.82}
              speedReveal={0.9}
              speedSegment={0.95}
              className="max-w-5xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[3.5rem] lg:leading-[1.02]"
            >
              {title}
            </TextEffect>
          </div>
          {description ? (
            <div>
              <TextEffect
                as="p"
                per="word"
                preset="fade"
                delay={2.05}
                speedReveal={1.1}
                speedSegment={1.1}
                className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg"
                style={{ textWrap: "pretty" }}
              >
                {description}
              </TextEffect>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="space-y-3">
          <Eyebrow>{eyebrow}</Eyebrow>
          <SlideHeading title={title} description={description} />
        </div>
      )}
      {bodyVariant === "panel" ? (
        <div
          className={`grid gap-4 rounded-[calc(var(--radius)*2)] border border-border/70 bg-card/80 p-4 shadow-sm backdrop-blur-sm sm:p-5 ${
            animateHeader ? "reveal-card" : ""
          }`}
          style={animateHeader ? { animationDelay: "4.35s" } : undefined}
        >
          {children}
        </div>
      ) : (
        <div>{children}</div>
      )}
    </div>
  )
}

function HeroSlide({
  eyebrow,
  title,
  description,
}: {
  eyebrow: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
}) {
  return (
    <div className="flex min-h-[calc(100svh-16rem)] items-center justify-center py-8 text-center sm:py-12">
      <div className="space-y-8">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mx-auto max-w-[14ch] text-5xl leading-[1.06] font-semibold tracking-tight text-balance sm:text-6xl sm:leading-[1.04] lg:text-7xl lg:leading-[1.02]">
          {title}
        </h1>
        {description ? (
          <p className="mx-auto max-w-4xl text-lg leading-8 text-pretty text-muted-foreground sm:text-xl">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function BreakerSlide({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <section className="flex min-h-[calc(100svh-16rem)] items-center py-8 sm:py-12">
      <div className="max-w-4xl space-y-6">
        <div className="space-y-6">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-pretty sm:text-5xl lg:text-7xl lg:leading-[0.98]">
            {title}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-pretty text-muted-foreground sm:text-xl">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <div>
      {items.map((item, index) => (
        <div
          key={index}
          className="grid gap-4 border-b border-border/70 py-5 last:border-b-0 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-6 sm:py-6"
        >
          <div className="flex items-center gap-3 sm:block">
            <span className="text-[0.72rem] font-semibold tracking-[0.3em] text-muted-foreground uppercase">
              0{index + 1}
            </span>
          </div>
          <p className="max-w-4xl text-[1.35rem] leading-[1.55] text-pretty text-foreground sm:text-[1.6rem] sm:leading-[1.45]">
            {item}
          </p>
        </div>
      ))}
    </div>
  )
}

function FlowNode({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
      <p className="text-[11px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
        {eyebrow}
      </p>
      <h3 className="mt-2 text-lg font-semibold text-pretty">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-pretty text-muted-foreground">
        {description}
      </p>
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  )
}


function CodeInsightPanel({
  label,
  title,
  code,
  language = "typescript",
}: {
  label: string
  title: string
  code: string
  language?: string
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
      <p className="text-[11px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
        {label}
      </p>
      <h3 className="mt-2 text-base font-semibold">{title}</h3>
      <div className="mt-3 rounded-xl">
        <CodeBlock
          code={code}
          language={language}
        />
      </div>
    </div>
  )
}


export const slides: SlideDefinition[] = [
  {
    slug: "title",
    title: "Building AI Apps with Vercel AI SDK",
    body: (
      <HeroSlide
        eyebrow="Charlie Tango - Hackathon 2026"
        title="Building AI Apps with Vercel AI SDK"
        description="From demos to real product features"
      />
    ),
  },
  {
    slug: "why-this-approach",
    title: "Why this approach",
    body: (
      <ContentCard
        eyebrow="Why this approach"
        title="We already use AI while building. Now let’s build it into the product."
        bodyVariant="open"
      >
        <BulletList
          items={[
            <>
              AI works best when it is part of the product flow, not bolted on
              beside it. <br />
              <em>(like a generic chatbot in the corner)</em>
            </>,
            <>
              The hard part is usually product design, data flow, and UX, not
              the model call itself.
            </>,
            <>
              AI SDK gives us a practical way to integrate AI features without
              wiring everything from scratch.
            </>,
          ]}
        />
      </ContentCard>
    ),
  },
  {
    slug: "demo-breaker",
    title: "Core patterns",
    body: (
      <BreakerSlide
        eyebrow="Core patterns"
        title="First, look at the building blocks on their own."
        description="These demos stay intentionally small so each building block is easy to understand before you combine them in a real app."
      />
    ),
  },
  {
    slug: "failure-mode",
    title: "Failure mode: naive AI output",
    body: (
      <ContentCard
        eyebrow="Failure mode"
        title="Without constraints, the model will invent details you did not ask for"
        description="This is the fastest way to lose trust in an AI feature: a plausible answer that quietly changes the facts."
      >
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <CodeInsightPanel
            label="What goes wrong"
            title="Input vs naive rewrite"
            code={`Input: Rewrite this prompt to be more exciting: "The party enters a ruined temple. They see a skeleton and a goblin, but they do not know if they are friend or foe."`}
            language="text"
          />
          <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
              Why it failed
            </p>
            <div className="mt-3 grid gap-3">
              {[
                "Invented facts like mayor, mission, and council.",
                "Changed the location from ruin to temple.",
                "Lost the core outcome: nobody acts and the party waits.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-border/60 bg-card/60 px-3 py-3 text-sm leading-6 text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ContentCard>
    ),
  },
  {
    slug: "beyond-the-browser",
    title: "Beyond the browser",
    body: (
      <ContentCard
        eyebrow="Server code"
        title="These patterns also work in jobs, routes, and scripts"
        description="The same AI SDK patterns are just as useful in backend work that never renders a chat UI."
        bodyVariant="open"
      >
        <BulletList
          items={[
            <>
              Run a nightly enrichment job that labels, tags, or summarizes new
              records.
            </>,
            <>
              Process a batch of meeting transcripts into summaries and action
              items.
            </>,
            <>
              Add a moderation worker that classifies risky content before it is
              published.
            </>,
            <>
              Use the same calls from a CLI to label old content or backfill
              missing metadata.
            </>,
          ]}
        />
      </ContentCard>
    ),
  },
  {
    slug: "pokemon-breaker",
    title: "Teaser: one combined app",
    body: (
      <BreakerSlide
        eyebrow="Teaser"
        title="Now let’s overdo it"
        description="The next demo is a compact preview of an AI workflow that can research, structure, stream, and render in one run."
      />
    ),
  },
  {
    slug: "battle-research-flow",
    title: "Battle Lab research flow",
    body: (
      <ContentCard
        eyebrow="Architecture"
        title="Decide the battle once"
        description="The important part of the first phase is the sequence: load facts with tools, then generate one typed battle object."
      >
        <div className="grid gap-5">
          <div className="grid gap-4 lg:grid-cols-[0.8fr_1.05fr_1.15fr]">
            <FlowNode
              eyebrow="Input"
              title="Two Pokemon go in"
              description="The client sends one battle request with the selected matchup. Nothing is rendered yet."
            />

            <FlowNode
              eyebrow="Step 1"
              title="Tool-backed research loads the facts first"
              description="`generateText` uses tools to fetch stats, likely moves, matchup edges, and type interactions before it commits to a result."
            >
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  "getPokemon()",
                  "comparePokemon()",
                  "getMove()",
                  "getTypeMatchup()",
                ].map((tool) => (
                  <div
                    key={tool}
                    className="rounded-xl border border-border/70 bg-card px-3 py-2 text-sm font-medium"
                  >
                    {tool}
                  </div>
                ))}
              </div>
            </FlowNode>

            <div className="rounded-[1.75rem] border border-primary/20 bg-primary/[0.07] p-5 shadow-sm">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-primary/80 uppercase">
                Step 2
              </p>
              <h3 className="mt-2 text-lg font-semibold">
                One typed battle object becomes the source of truth
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Winner, turn timeline, recap, poster prompt, and announcer line
                are generated once so every later output stays in sync.
              </p>
            </div>
          </div>
        </div>
      </ContentCard>
    ),
  },
  {
    slug: "gateway-breaker",
    title: "Gateway and operations",
    body: (
      <BreakerSlide
        eyebrow="Platform layer"
        title="Once the feature works, reliability starts to matter."
        description="Now the questions are practical: which model to use, what happens on failure, and how to track behavior, latency, and cost."
      />
    ),
  },
  {
    slug: "ai-gateway-why",
    title: "AI Gateway",
    body: (
      <ContentCard
        eyebrow="Gateway"
        title="One interface to call any model"
        description="Instead of wiring every provider separately, Vercel AI Gateway gives the app one integration point for text, image, and video models."
      >
        <div className="grid gap-4">
          <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-2xl border border-border/70 bg-background/70 p-5">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
                What it is
              </p>
              <h3 className="mt-3 max-w-lg text-3xl font-semibold tracking-tight text-balance sm:text-[2.2rem] sm:leading-[1.02]">
                The AI Gateway for developers
              </h3>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                One API key, one API surface, and one place to observe model
                traffic across the app.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Text", "Image", "Video", "Fallbacks", "Observability"].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>

            <CodeInsightPanel
              label="AI SDK"
              title="Same shape, different model"
              code={`import { gateway, streamText } from "ai";

const result = streamText({
  model: gateway("openai/gpt-5.4"),
  prompt: "Why is the sky blue?",
});`}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {[
              {
                title: "One API key, hundreds of models",
                description:
                  "Unified billing and observability across your AI stack, with text, image, and video models.",
              },
              {
                title: "Built-in failovers, better uptime",
                description:
                  "Automatic fallbacks during provider outages so the app stays up even when a model goes down.",
              },
              {
                title: "No markup, just list price",
                description:
                  "Pay exactly what providers charge with no platform fees.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border/70 bg-background/70 p-5"
              >
                <h3 className="max-w-xs text-2xl font-semibold tracking-tight text-balance">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </ContentCard>
    ),
  },
  {
    slug: "observability",
    title: "Observability",
    body: (
      <ContentCard
        eyebrow="Observability"
        title="If it’s in production, you need to see what the model is doing"
        description="See what ran, what it cost, how long it took, and why it failed. Then keep routing, validation, and fallback behavior in one place."
      >
        <div className="grid gap-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {[
              {
                question: "Which model ran?",
                answer:
                  "Track model choice and compare behavior on the same use case instead of guessing from memory.",
              },
              {
                question: "What did it cost?",
                answer:
                  "See token usage and cost per generation so finance, product, and engineering can talk about the same numbers.",
              },
              {
                question: "How long did it take?",
                answer:
                  "Latency matters as much as quality once the feature is in a real UI or workflow.",
              },
              {
                question: "Why did it fail?",
                answer:
                  "Generation-level logs make it possible to debug prompt issues, provider problems, and bad outputs with evidence.",
              },
            ].map((item) => (
              <div
                key={item.question}
                className="rounded-2xl border border-border/70 bg-background/70 p-5"
              >
                <p className="text-[11px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
                  Signal
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-balance">
                  {item.question}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            {[
              {
                label: "Routing",
                description:
                  "Choose the right model path without scattering provider logic through the app.",
              },
              {
                label: "Validation",
                description:
                  "Check what comes back before the feature trusts it.",
              },
              {
                label: "Fallbacks",
                description:
                  "Have one bounded recovery path when a model fails.",
              },
              {
                label: "Observability",
                description:
                  "Keep cost, latency, and failures inspectable after launch.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-border/70 bg-background/70 p-4"
              >
                <p className="text-[11px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
                  {item.label}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </ContentCard>
    ),
  },
  {
    slug: "hackathon-breaker",
    title: "Hackathon tips",
    body: (
      <BreakerSlide
        eyebrow="Next step"
        title="Now turn the patterns into build speed"
        description="The next practical step is getting the right tools and guidance in place before you start building."
      />
    ),
  },
  {
    slug: "design-principle",
    title: "Design principle",
    body: (
      <ContentCard
        eyebrow="Design principle"
        title="Start simple. Add capabilities incrementally."
        description="For the hackathon, build one thing that works before you stack on more capabilities."
        bodyVariant="open"
      >
        <BulletList
          items={[
            <>Solve one visible user problem first.</>,
            <>Add streaming once the base interaction works.</>,
            <>Add tools when the model needs real actions or data.</>,
            <>
              Add structure when the output needs to drive software, not just
              humans.
            </>,
          ]}
        />
      </ContentCard>
    ),
  },
  {
    slug: "final-thought",
    title: "Final thought",
    body: (
      <HeroSlide
        eyebrow="Final thought"
        title={
          <>
            <TextEffect preset="blur" per="char" delay={0.25}>
              Don’t overthink it.
            </TextEffect>
            <TextEffect
              preset="fade-in-blur"
              per="char"
              delay={2}
              className="whitespace-nowrap"
            >
              Just build something.
            </TextEffect>
          </>
        }
      />
    ),
  },
]

export function getSlideBySlug(slug: string) {
  const normalizedSlug = slug === "tools" ? "search-and-filtering" : slug
  return slides.find((slide) => slide.slug === normalizedSlug)
}
