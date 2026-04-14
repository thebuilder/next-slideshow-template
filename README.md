# Slideshow Base (Next.js)

Reusable slideshow template built with Next.js, React, Tailwind, and shadcn/ui.

## What this template includes

- Route-per-slide presentation flow (`/slides/[slug]`)
- Keyboard navigation (`Arrow`, `PageUp/PageDown`, `Space`)
- Step reveals with `stepCount` + `SlideStep`
- Command center (`Cmd/Ctrl + K`) for quick jump
- Light/dark theme toggle
- Slide-level layout/background/header controls
- Typed image slide support

## Quick start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

- `app/slides.tsx`: slide definitions only
- `types/slides.ts`: slide model/types
- `app/slideshow-config.ts`: global slideshow config (title, description, header defaults)
- `app/slides/blocks/*`: deck-authoring building blocks (layout, typography, collections, media)
- `components/slideshow/slide-shell.tsx`: slideshow chrome (header, navigation, frame)
- `components/slideshow/slide-background.tsx`: shared background variants

## Slide model

`SlideDefinition` supports:

- Core: `slug`, `title`, `body`
- Optional flow: `stepCount`, `navTitle`
- Optional chrome/layout: `header`, `footer`, `layout`, `background`

### Header behavior

`header` can be:

- `"visible"`: always render header
- `"hidden"`: never render header
- `"auto"`: render in default layout, hide in fullscreen layout

Global default is configured in `app/slideshow-config.ts`.

### Footer behavior

`footer` can be:

- `"visible"`: full previous/next controls + counter
- `"counter"`: counter only (`Slide x of y`)
- `"hidden"`: no footer

## Adding slides

Add entries to `app/slides.tsx`.

Example content slide:

```tsx
{
  slug: "my-slide",
  title: "My Slide",
  body: <MySlideComponent />,
  background: "spotlight",
}
```

Example image slide:

```tsx
{
  slug: "diagram",
  title: "Architecture Diagram",
  body: (
    <ImageShowcaseSlide
      image={{ src: diagramImage, alt: "System architecture", placeholder: "blur" }}
    />
  ),
  layout: "fullscreen",
  header: "hidden",
}
```

## Background variants

`background` supports:

- `"default"`
- `"spotlight"`
- `"grid"`
- `"none"`

Add custom variants in `components/slideshow/slide-background.tsx`.
