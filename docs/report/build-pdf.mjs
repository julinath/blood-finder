// Renders report.html to a print-ready A4 PDF using the system Chrome.
// Run: node docs/report/build-pdf.mjs
import puppeteer from 'puppeteer-core'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const htmlUrl = pathToFileURL(join(__dirname, 'report.html')).href
const out = join(__dirname, 'Blood-Finder-Lab-Report.pdf')

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
const page = await browser.newPage()
await page.goto(htmlUrl, { waitUntil: 'networkidle0' })
// give the Bangla web font a moment to load
await new Promise((r) => setTimeout(r, 1200))

await page.pdf({
  path: out,
  format: 'A4',
  printBackground: true,
  displayHeaderFooter: true,
  margin: { top: '20mm', bottom: '18mm', left: '20mm', right: '18mm' },
  headerTemplate: '<span></span>',
  footerTemplate:
    '<div style="width:100%;font-size:8pt;color:#888;font-family:Georgia,serif;' +
    'padding:0 18mm;display:flex;justify-content:space-between;">' +
    '<span>Blood Finder — Project Lab Report</span>' +
    '<span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>' +
    '</div>',
})

await browser.close()
console.log('PDF written:', out)
