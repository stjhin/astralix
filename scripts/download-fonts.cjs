const fs = require('node:fs')
const path = require('node:path')

const FONTS_DIR = path.join(__dirname, '..', 'public', 'fonts')

// Google Fonts CSS API returns current CDN URLs
const GOOGLE_FONTS_CSS = 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700'

async function download(url, dest) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(dest, buf)
  console.log(`Downloaded: ${path.basename(dest)} (${buf.length} bytes)`)
}

async function getFontUrl(cssUrl, weight) {
  const css = await fetch(cssUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  }).then((r) => r.text())

  // Find @font-face block for the given weight
  const regex = new RegExp(`@font-face\\s*\\{[^}]*font-weight:\\s*${weight}[^}]*url\\(([^)]+)\\)`, 's')
  const match = css.match(regex)
  if (!match) throw new Error(`Could not find font-weight ${weight} in CSS`)
  return match[1]
}

;(async () => {
  fs.mkdirSync(FONTS_DIR, { recursive: true })

  // Noto Sans SC Regular
  const regularUrl = await getFontUrl(GOOGLE_FONTS_CSS, 400)
  await download(regularUrl, path.join(FONTS_DIR, 'NotoSansSC-Regular.otf'))

  // Noto Sans SC Bold
  const boldUrl = await getFontUrl(GOOGLE_FONTS_CSS, 700)
  await download(boldUrl, path.join(FONTS_DIR, 'NotoSansSC-Bold.otf'))

  console.log('Fonts ready')
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
