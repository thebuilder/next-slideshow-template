import { codeToHtml } from "shiki"

type CodeBlockProps = {
  code: string
  language?: string
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

export async function CodeBlock({
  code,
  language = "typescript",
}: CodeBlockProps) {
  let html = `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`

  try {
    html = await codeToHtml(code, {
      lang: language,
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: "light-dark()",
      rootStyle: false,
    })
  } catch (error) {
    console.error("Shiki highlighting error:", error)
  }

  return (
    <div
      className="overflow-hidden rounded-2xl border bg-card/80 shadow-sm backdrop-blur-sm [&_.line]:inline-block [&_.line]:min-h-[1.5rem] [&_code]:grid [&_code]:gap-0.5 [&_code]:font-mono [&_code]:text-sm [&_pre]:overflow-x-auto [&_pre]:px-5 [&_pre]:py-4 [&_pre]:text-sm [&_pre]:leading-6"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
