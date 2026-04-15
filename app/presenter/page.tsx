import type { Metadata } from "next"

import { PresenterConsole } from "@/components/slideshow/presenter-console"

export const metadata: Metadata = {
  title: "Presenter View",
}

export default function PresenterPage() {
  return <PresenterConsole />
}
