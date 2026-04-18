import Image from "next/image"
import type { ImageProps } from "next/image"

import { SlideMediaVideo } from "@/components/slideshow/slide-media-video"

export type ImageShowcaseConfig = {
  src: ImageProps["src"]
  alt?: string
  fit?: "cover" | "contain"
  placeholder?: ImageProps["placeholder"]
  blurDataURL?: string
  sizes?: string
  priority?: boolean
  caption?: React.ReactNode
  credit?: React.ReactNode
}

type FullscreenImageMedia = {
  kind: "image"
  src: ImageProps["src"]
  alt?: string
  fit?: "cover" | "contain"
  placeholder?: ImageProps["placeholder"]
  blurDataURL?: string
  sizes?: string
  priority?: boolean
}

type FullscreenVideoMedia = {
  kind: "video"
  src: string
  poster?: ImageProps["src"]
  fit?: "cover" | "contain"
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
}

export type FullscreenMediaConfig = FullscreenImageMedia | FullscreenVideoMedia
export type FullscreenMediaVariant = "framed" | "background"
export type FullscreenMediaOverlay = "none" | "subtle" | "medium" | "strong"

function resolveSourceBlurDataURL(src: ImageProps["src"]): string | undefined {
  if (typeof src === "string") {
    return undefined
  }

  if ("blurDataURL" in src && typeof src.blurDataURL === "string") {
    return src.blurDataURL
  }

  if (
    "default" in src &&
    src.default &&
    typeof src.default === "object" &&
    "blurDataURL" in src.default &&
    typeof src.default.blurDataURL === "string"
  ) {
    return src.default.blurDataURL
  }

  return undefined
}

function resolvePosterSrc(
  poster: FullscreenVideoMedia["poster"],
): string | undefined {
  if (!poster) {
    return undefined
  }

  if (typeof poster === "string") {
    return poster
  }

  if ("src" in poster) {
    return poster.src
  }

  return poster.default.src
}

export function FullscreenMediaSlide({
  media,
  variant = "framed",
  overlay = "medium",
  children,
}: {
  media: FullscreenMediaConfig
  variant?: FullscreenMediaVariant
  overlay?: FullscreenMediaOverlay
  children?: React.ReactNode
}) {
  const resolvedBlurDataURL =
    media.kind === "image"
      ? media.blurDataURL ?? resolveSourceBlurDataURL(media.src)
      : undefined
  const resolvedPlaceholder =
    media.kind === "image" &&
    media.placeholder === "blur" &&
    !resolvedBlurDataURL
      ? undefined
      : media.kind === "image"
        ? media.placeholder
        : undefined

  const containerClassName =
    variant === "background"
      ? "relative h-full min-h-[16rem] w-full overflow-hidden"
      : "relative min-h-[calc(100svh-9rem)] overflow-hidden rounded-3xl border border-border/70 bg-card/60"
  const overlayClassName =
    overlay === "none"
      ? ""
      : overlay === "subtle"
        ? "bg-gradient-to-t from-black/35 via-black/10 to-transparent"
        : overlay === "strong"
          ? "bg-gradient-to-t from-black/75 via-black/35 to-transparent"
          : "bg-gradient-to-t from-black/55 via-black/20 to-transparent"

  return (
    <section className={containerClassName}>
      {media.kind === "image" ? (
        <Image
          src={media.src}
          alt={media.alt ?? ""}
          fill
          className={media.fit === "contain" ? "object-contain" : "object-cover"}
          placeholder={resolvedPlaceholder}
          blurDataURL={resolvedBlurDataURL}
          sizes={media.sizes}
          priority={media.priority}
        />
      ) : (
        <SlideMediaVideo
          src={media.src}
          poster={resolvePosterSrc(media.poster)}
          className={
            media.fit === "contain"
              ? "h-full w-full object-contain"
              : "h-full w-full object-cover"
          }
          autoplay={media.autoplay}
          muted={media.muted}
          playsInline
          loop={media.loop}
          controls={media.controls}
        />
      )}

      {children ? (
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8 ${overlayClassName}`}
        >
          <div className="pointer-events-auto">{children}</div>
        </div>
      ) : null}
    </section>
  )
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
  const resolvedBlurDataURL = blurDataURL ?? resolveSourceBlurDataURL(src)
  const resolvedPlaceholder =
    placeholder === "blur" && !resolvedBlurDataURL ? undefined : placeholder

  return (
    <section className="grid min-h-[calc(100svh-10rem)] gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="relative min-h-[20rem] overflow-hidden rounded-3xl border border-border/70 bg-card/60">
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          className={fit === "contain" ? "object-contain" : "object-cover"}
          placeholder={resolvedPlaceholder}
          blurDataURL={resolvedBlurDataURL}
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
