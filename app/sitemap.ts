import type { MetadataRoute } from "next"

import { getAllSlideSlugs } from "@/app/slides"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export default function sitemap(): MetadataRoute.Sitemap {
  const slideEntries = getAllSlideSlugs().map((slug) => ({
    url: new URL(`/slides/${slug}`, siteUrl).toString(),
  }))

  return [
    {
      url: new URL("/", siteUrl).toString(),
    },
    ...slideEntries,
  ]
}
