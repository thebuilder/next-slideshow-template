#!/usr/bin/env node
import { spawn, spawnSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

import { PDFDocument } from "pdf-lib"
import { chromium } from "playwright"
import type { Browser } from "playwright"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, "..")

const port = Number(process.env.PDF_EXPORT_PORT ?? 3410)
const width = Number(process.env.PDF_EXPORT_WIDTH ?? 1920)
const height = Number(process.env.PDF_EXPORT_HEIGHT ?? 1080)
const outputPath = path.resolve(
  projectRoot,
  process.env.PDF_EXPORT_OUTPUT ?? "out/slides.pdf",
)
const skipBuild = process.argv.includes("--skip-build")
const darkMode = process.argv.includes("--dark")
const pdfTheme = darkMode ? "dark" : "light"

function runBuild(): void {
  if (skipBuild) {
    return
  }

  const result = spawnSync("pnpm", ["build"], {
    cwd: projectRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_PUBLIC_PDF_EXPORT: "1",
      NEXT_PUBLIC_PDF_THEME: pdfTheme,
    },
  })

  if (result.status !== 0) {
    throw new Error("Build failed")
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitForServer(baseUrl: string): Promise<void> {
  const timeoutMs = 60_000
  const start = Date.now()

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(baseUrl)
      if (response.ok) {
        return
      }
    } catch {
      // server not ready yet
    }

    await sleep(500)
  }

  throw new Error(`Timed out waiting for server at ${baseUrl}`)
}

async function readSlideSlugsFromSitemap(baseUrl: string): Promise<string[]> {
  const sitemapUrl = `${baseUrl}/sitemap.xml`
  const response = await fetch(sitemapUrl)

  if (!response.ok) {
    throw new Error(`Failed to load sitemap at ${sitemapUrl}`)
  }

  const xml = await response.text()
  const locMatches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]

  const slugs = locMatches
    .map((match) => match[1]?.trim() ?? "")
    .map((loc) => {
      try {
        return new URL(loc).pathname
      } catch {
        return ""
      }
    })
    .filter((pathname) => pathname.startsWith("/slides/"))
    .map((pathname) => decodeURIComponent(pathname.replace("/slides/", "")))
    .filter((slug) => slug.length > 0)

  if (slugs.length === 0) {
    throw new Error(
      `No slide routes found in sitemap. Ensure app/sitemap.ts includes /slides/* entries.`,
    )
  }

  return [...new Set(slugs)]
}

function pxToPt(px: number): number {
  return (px * 72) / 96
}

async function exportPdf({
  slugs,
  baseUrl,
}: {
  slugs: string[]
  baseUrl: string
}): Promise<void> {
  let browser: Browser
  try {
    browser = await chromium.launch({ headless: true })
  } catch (error) {
    throw new Error(
      `Failed to launch Chromium for PDF export. Run: pnpm exec playwright install chromium\n${error instanceof Error ? error.message : String(error)}`,
    )
  }

  try {
    const context = await browser.newContext({
      viewport: { width, height },
      colorScheme: pdfTheme === "dark" ? "dark" : "light",
    })

    const page = await context.newPage()
    const pdf = await PDFDocument.create()

    for (const slug of slugs) {
      const url = `${baseUrl}/slides/${slug}`
      await page.goto(url, { waitUntil: "networkidle" })
      await page.waitForTimeout(80)

      const imageBuffer = await page.screenshot({
        type: "png",
        animations: "disabled",
      })

      const image = await pdf.embedPng(imageBuffer)
      const pdfWidth = pxToPt(width)
      const pdfHeight = pxToPt(height)
      const pdfPage = pdf.addPage([pdfWidth, pdfHeight])

      pdfPage.drawImage(image, {
        x: 0,
        y: 0,
        width: pdfWidth,
        height: pdfHeight,
      })

      process.stdout.write(`Exported slide: ${slug}\n`)
    }

    const pdfBytes = await pdf.save()
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, pdfBytes)
    process.stdout.write(`PDF written to ${outputPath}\n`)

    await context.close()
  } finally {
    await browser.close()
  }
}

async function main(): Promise<void> {
  runBuild()

  const baseUrl = `http://127.0.0.1:${port}`
  const server = spawn("pnpm", ["start", "-p", String(port)], {
    cwd: projectRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "production",
      NEXT_PUBLIC_PDF_EXPORT: "1",
      NEXT_PUBLIC_PDF_THEME: pdfTheme,
    },
  })

  const shutdown = () => {
    if (!server.killed) {
      server.kill("SIGTERM")
    }
  }

  process.on("SIGINT", shutdown)
  process.on("SIGTERM", shutdown)

  try {
    await waitForServer(baseUrl)
    const slugs = await readSlideSlugsFromSitemap(baseUrl)
    await exportPdf({ slugs, baseUrl })
  } finally {
    shutdown()
  }
}

main().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  )
  process.exit(1)
})
