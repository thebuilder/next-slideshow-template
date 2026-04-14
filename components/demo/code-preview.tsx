"use client"

import { useEffect, useState } from "react"

type CodePreviewProps = {
  code: string
  label?: string
  language?: "typescript" | "json" | "text"
}

let shikiModulePromise: Promise<typeof import("shiki")> | undefined
const highlightedHtmlCache = new Map<string, string>()

function getShikiModule() {
  if (!shikiModulePromise) {
    shikiModulePromise = import("shiki")
  }

  return shikiModulePromise
}

export function CodePreview({
  code,
  label = "SDK call",
  language = "typescript",
}: CodePreviewProps) {
  const [html, setHtml] = useState<string | null>(null)
  const [debouncedCode, setDebouncedCode] = useState(code)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedCode(code)
    }, 120)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [code])

  useEffect(() => {
    let isCancelled = false

    async function highlightCode() {
      try {
        const cacheKey = `${language}:${debouncedCode}`
        const cachedHtml = highlightedHtmlCache.get(cacheKey)

        if (cachedHtml) {
          setHtml(cachedHtml)
          return
        }

        const { codeToHtml } = await getShikiModule()
        const nextHtml = await codeToHtml(debouncedCode, {
          lang: language,
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
          defaultColor: "light-dark()",
          rootStyle: false,
        })

        if (!isCancelled) {
          highlightedHtmlCache.set(cacheKey, nextHtml)
          setHtml(nextHtml)
        }
      } catch {
        if (!isCancelled) {
          setHtml(null)
        }
      }
    }

    void highlightCode()

    return () => {
      isCancelled = true
    }
  }, [debouncedCode, language])

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-border/70 bg-background/80">
      <div className="flex items-center gap-3 border-b border-border/70 px-4 py-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {label}
        </p>
      </div>

      {html ? (
        <div
          className="overflow-hidden [&_.line]:inline-block [&_.line]:min-h-[1.5rem] [&_code]:grid [&_code]:gap-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:px-4 [&_pre]:py-4 [&_pre]:text-[13px] [&_pre]:leading-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto whitespace-pre-wrap break-words px-4 py-4 text-[13px] leading-6 text-foreground">
          <code>{debouncedCode}</code>
        </pre>
      )}
    </div>
  )
}
