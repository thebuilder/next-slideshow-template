import Image from "next/image"
import type { ImageProps } from "next/image"

export type ImageShowcaseConfig = {
  src: ImageProps["src"]
  alt: string
  fit?: "cover" | "contain"
  placeholder?: ImageProps["placeholder"]
  blurDataURL?: string
  sizes?: string
  priority?: boolean
  caption?: React.ReactNode
  credit?: React.ReactNode
}

export function ImageShowcaseSlide({
  image,
  children,
}: {
  image: ImageShowcaseConfig
  children?: React.ReactNode
}) {
  const {
    src,
    alt,
    fit = "cover",
    placeholder,
    blurDataURL,
    sizes,
    priority,
    caption,
    credit,
  } = image

  return (
    <section className="grid min-h-[calc(100svh-10rem)] gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="relative min-h-[20rem] overflow-hidden rounded-3xl border border-border/70 bg-card/60">
        <Image
          src={src}
          alt={alt}
          fill
          className={fit === "contain" ? "object-contain" : "object-cover"}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          sizes={sizes}
          priority={priority}
        />
      </div>

      <div className="flex flex-col justify-end gap-4 rounded-3xl border border-border/70 bg-card/70 p-6 backdrop-blur-sm">
        {children}
        {caption ? (
          <p className="text-sm leading-7 text-muted-foreground">{caption}</p>
        ) : null}
        {credit ? (
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            {credit}
          </p>
        ) : null}
      </div>
    </section>
  )
}
