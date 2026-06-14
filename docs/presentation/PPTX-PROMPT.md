# PPTX বানানোর Prompt (Claude Code-কে দিন)

> **কীভাবে ব্যবহার করবেন:**
> 1. এই রিপোর প্রজেক্ট ফোল্ডারে Claude Code খুলুন।
> 2. নিচের ধূসর বক্সের পুরো prompt টা **হুবহু copy করে paste** করুন।
> 3. Claude `python-pptx` দিয়ে একটা editable `.pptx` বানিয়ে
>    `docs/presentation/blood-finder.pptx`-এ রাখবে — পরে PowerPoint/Google
>    Slides-এ খুলে নিজে এডিট করতে পারবেন।
>
> বানানো হলে PowerPoint-এ খুলে **Bangla লেখাগুলো ঠিক দেখাচ্ছে কিনা** দেখে নেবেন
> (নিচের “Bangla font” নোট দ্রষ্টব্য)।

---

## 📋 Copy this prompt

```
You are a senior presentation designer + Python engineer. Build a polished,
editable PowerPoint (.pptx) for my university project "Blood Finder".

SOURCE OF TRUTH — read these first, do not invent facts:
- docs/presentation/BRIEF.md   (all content, the 14-slide structure, numbers,
  the language policy, team/supervisor/course, live URL, GitHub repo)
- docs/presentation/screenshots/*.png   (product screenshots to embed)
- docs/presentation/index.html   (the existing interactive deck — use ONLY as a
  visual/content reference for tone; the .pptx is a fresh, better-designed build)

GOAL: a clean, confident, modern deck a supervisor can follow easily. Better
design and typography than the HTML deck — not text-heavy, lots of breathing
room, one clear idea per slide.

TECH / OUTPUT:
- Use the python-pptx library. If it's not installed, install it first
  (pip install python-pptx). Write a script at
  docs/presentation/build_pptx.py and run it to produce
  docs/presentation/blood-finder.pptx.
- 16:9 widescreen (13.333in x 7.5in).
- Keep the script clean and re-runnable (rebuilds the file each run).
- Add concise SPEAKER NOTES to every slide (2-4 sentences the presenter can say).

DESIGN SYSTEM (commit to it consistently across every slide):
- Palette: blood red #B91C1C (primary) + bright red #DC2626 (accent) + deep
  maroon #7F1D1D, warm paper #FAF7F2 background, near-black ink #1C1917 text,
  soft gray #57534E for secondary text. Use red sparingly as accent, not walls
  of red.
- Type: a serif display font for headings (e.g. Georgia, or Playfair Display if
  available) and a clean sans for body (e.g. Calibri / Segoe UI). Pick fonts
  that exist on Windows so they render without embedding. Big, confident slide
  titles; generous line spacing in body.
- A consistent slide master: small kicker label (uppercase, letter-spaced, red)
  + large title on every content slide; a subtle slide number; a thin red rule
  or accent shape as a recurring motif. Title and closing slides use a dark
  maroon background with light text; content slides use the warm paper bg.
- Embed screenshots inside a simple "browser card" look (rounded rectangle with
  a soft shadow if feasible) rather than bare images. Never stretch/distort an
  image — preserve aspect ratio.

LANGUAGE POLICY (important):
- All explanations and headings in SIMPLE English (easy for a supervisor).
  Avoid jargon; short bullet points.
- Use Bengali ONLY for exact UI quotes where it adds authenticity, e.g. the
  button text "আমি রক্ত দিতে পারবো" and the confirm "রক্ত পেয়েছি". Screenshots
  naturally contain Bangla — that's fine.

CONTENT — follow the 14-slide structure in BRIEF.md section 4 exactly (Title →
Problem → Solution → Product → Find Donors → Emergency/donor-first privacy →
Request lifecycle → Admin → Tech stack → Architecture → Lab→product evolution →
OOP two stacks → Roadmap → Closing). Two points that MUST land clearly:
- "Donor-first privacy" (the donor's number is never public; the donor chooses
  to respond) — this is our signature design.
- "The receiver confirms the donation, never the donor" — so nobody can inflate
  their own donation count (anti-fraud).

TITLE SLIDE: Blood Finder + one-line tagline + team with student IDs (Juli Nath
2401011004, Asma Akter 2401011021, Mom Chakraborti 2401011034) + Supervisor
Dhonita Tripura (Assistant Professor, CSE, RMSTU) + course (OOP Lab, CSE 11th
Batch) + live URL.
CLOSING SLIDE: "One bag of blood can be someone's whole world." + live URL +
team + supervisor + github.com/julinath/blood-finder.

QUALITY BAR:
- Consistent margins, alignment and font sizes across slides (define them once
  as constants in the script and reuse).
- No overflowing text boxes; no overlapping elements; check each slide visually
  in your head before finalizing.
- After building, re-open the .pptx with python-pptx and print the slide count
  and each slide's title to confirm it built correctly, and tell me the final
  file path.

NOTE ON BANGLA FONT: set Bengali runs to a font that renders Bangla on Windows
(e.g. "Nirmala UI" or "Hind Siliguri" if installed). Tell me in your summary if
I need to install a Bangla font for the quotes to show correctly.
```

---

## 💡 টিপস

- **আরও ছবি চাইলে:** prompt-এ `03-donor-profile.png`, `05-profile-hub.png`,
  `07-stats-map.png`-ও যোগ করতে বলুন (extra স্লাইড হিসেবে)।
- **নতুন/আপডেটেড screenshot দরকার হলে:** আগে বলুন “take fresh screenshots of the
  live site at desktop + 390px mobile and replace the ones in
  docs/presentation/screenshots/” — তারপর pptx বানাতে বলুন।
- **ছোট/বড় deck:** “make it 10 slides” বা “add a live-demo slide” বললেই কাঠামো
  মানিয়ে নেবে।
- **থিম বদলাতে চাইলে:** DESIGN SYSTEM অংশের রং/ফন্ট পাল্টে দিন — বাকিটা ঠিক থাকবে।
- **Bangla quote ভেঙে দেখালে:** Windows-এ “Nirmala UI” ডিফল্ট থাকে; না হলে Hind
  Siliguri ইনস্টল করে নিন, তারপর script আবার run করতে বলুন।
