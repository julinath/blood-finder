// Converts report.html to an editable Word .docx (html-to-docx, pure JS).
// Images are inlined as base64 so Word embeds them. Run:
//   node docs/report/build-docx.mjs
import HTMLtoDOCX from 'html-to-docx'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
let html = readFileSync(join(__dirname, 'report.html'), 'utf8')

// Inline every <img src="..."> as a base64 data URI (html-to-docx embeds those).
html = html.replace(/<img([^>]*?)src="([^"]+)"([^>]*)>/g, (m, pre, src, post) => {
  if (src.startsWith('data:')) return m
  const abs = resolve(__dirname, src)
  try {
    const buf = readFileSync(abs)
    const b64 = buf.toString('base64')
    return `<img${pre}src="data:image/png;base64,${b64}"${post}>`
  } catch (e) {
    console.warn('  ! image not found, skipping:', src)
    return m
  }
})

const docx = await HTMLtoDOCX(html, null, {
  orientation: 'portrait',
  pageSize: { width: 11906, height: 16838 }, // A4 in twips
  margins: { top: 1134, right: 1021, bottom: 1134, left: 1134 }, // ~20/18mm
  footer: true,
  pageNumber: true,
  font: 'Georgia',
  fontSize: 23, // half-points → ~11.5pt
  title: 'Blood Finder — Project Lab Report',
})

const out = join(__dirname, 'Blood-Finder-Lab-Report.docx')
writeFileSync(out, docx)
console.log('DOCX written:', out)
