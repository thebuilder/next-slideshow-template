import type { KeyboardEvent } from "react"

export function handleSubmitOnEnter(
  event: KeyboardEvent<HTMLTextAreaElement>,
  submit: () => void,
) {
  if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) {
    return
  }

  event.preventDefault()
  submit()
}
