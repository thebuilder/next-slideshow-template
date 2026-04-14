export function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <div>
      {items.map((item, index) => (
        <div
          key={index}
          className="grid gap-4 border-b border-border/70 py-5 last:border-b-0 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-6 sm:py-6"
        >
          <div className="flex items-center gap-3 sm:block">
            <span className="text-[0.72rem] font-semibold tracking-[0.3em] text-muted-foreground uppercase">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <p className="max-w-4xl text-[1.35rem] leading-[1.55] text-foreground sm:text-[1.6rem] sm:leading-[1.45]">
            {item}
          </p>
        </div>
      ))}
    </div>
  )
}

export function FeatureGrid({
  items,
}: {
  items: Array<{ title: string; description: string }>
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-2xl border border-border/70 bg-card/70 p-5"
        >
          <h3 className="text-xl font-semibold tracking-tight text-balance">
            {item.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  )
}
