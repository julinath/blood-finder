# Project Lab Report

Submission-ready project report for **Blood Finder** (OOP Lab, RMSTU).

## Files

| File | কী |
|------|-----|
| **Blood-Finder-Lab-Report.pdf** | A4 print-ready report — সরাসরি প্রিন্ট করে জমা দেওয়া যায় |
| **Blood-Finder-Lab-Report.docx** | একই রিপোর্ট, Word/Google Docs-এ **এডিট করা যায়** |
| `report.html` | উৎস (দুটো ফাইলই এখান থেকে তৈরি হয়) |
| `diagrams.html` | Mermaid diagram-গুলোর উৎস |
| `diagrams/*.png` | ৫টি diagram (architecture, use-case, class, ER, sequence) |
| `build-pdf.mjs` / `build-docx.mjs` | বিল্ড স্ক্রিপ্ট |

> ব্যবহৃত screenshot গুলো `../presentation/screenshots/` থেকে নেওয়া।

## রিপোর্ট আবার বানাতে (regenerate)

`report.html` এডিট করার পর:

```bash
npm i -D puppeteer-core html-to-docx     # একবার লাগবে
node docs/report/build-pdf.mjs           # → Blood-Finder-Lab-Report.pdf
node docs/report/build-docx.mjs          # → Blood-Finder-Lab-Report.docx
```

PDF বিল্ড সিস্টেমের Chrome ব্যবহার করে
(`C:\Program Files\Google\Chrome\Application\chrome.exe` — অন্য পথ হলে
`build-pdf.mjs`-এ বদলে নিন)।

Diagram বদলালে: `diagrams.html` এডিট করে `npx serve docs/report` চালিয়ে
ব্রাউজার থেকে SVG screenshot নিয়ে `diagrams/`-এ সেভ করুন।

## প্রিন্ট টিপ

PDF-টা সরাসরি A4-তে প্রিন্ট দিন (margin/scale "Default" বা "100%")। এডিট দরকার
হলে `.docx` খুলে cover/logo/পেজ নম্বর ঠিক করে তারপর প্রিন্ট/PDF করুন।
