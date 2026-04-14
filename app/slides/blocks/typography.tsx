export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold tracking-[0.3em] text-primary uppercase">
      {children}
    </p>
  )
}

export function SlideHeading({
  title,
  description,
}: {
  title: React.ReactNode
  description?: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <h1 className="max-w-5xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[3.5rem] lg:leading-[1.02]">
        {title}
      </h1>
      {description ? (
        <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  )
}
