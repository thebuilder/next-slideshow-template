import { redirect } from "next/navigation"

import { slides } from "./slides"

export default function Page() {
  redirect(`/slides/${slides[0].slug}`)
}
