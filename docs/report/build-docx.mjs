// Builds a clean, Google-Docs-compatible .docx of the lab report using the
// `docx` library (programmatic — far more compatible than HTML conversion).
// Run: node docs/report/build-docx.mjs
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, ImageRun, Footer, PageNumber,
  BorderStyle, TabStopType,
} from 'docx'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const RED = '991B1B', MAROON = '7F1D1D', GRAY = '555555', INK = '1A1A1A'

// ---- helpers ---------------------------------------------------------------
function pngSize(buf) { return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) } }

function image(relPath, maxW = 600, maxH = 820) {
  const abs = resolve(__dirname, relPath)
  const buf = readFileSync(abs)
  const { w, h } = pngSize(buf)
  const scale = Math.min(maxW / w, maxH / h, 1)
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 160, after: 60 },
    children: [new ImageRun({ data: buf, transformation: { width: Math.round(w * scale), height: Math.round(h * scale) } })],
  })
}
function caption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 200 },
    children: [new TextRun({ text, italics: true, size: 19, color: GRAY })],
  })
}
function figure(relPath, cap, maxW, maxH) { return [image(relPath, maxW, maxH), caption(cap)] }

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1, pageBreakBefore: true, spacing: { after: 140 },
    border: { bottom: { color: 'C9A3A3', size: 8, style: BorderStyle.SINGLE, space: 4 } },
    children: [new TextRun({ text, bold: true, color: MAROON, size: 30 })],
  })
}
function h2(text) {
  return new Paragraph({ spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, bold: true, color: RED, size: 24 })] })
}
// paragraph from plain text or an array of TextRun
function p(content) {
  const children = typeof content === 'string' ? [new TextRun({ text: content, size: 23 })] : content
  return new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 120, line: 300 }, children })
}
function run(text, opts = {}) { return new TextRun({ text, size: 23, ...opts }) }

// bullet; if the text has " — " the lead-in becomes bold
function bullet(text) {
  let children
  const idx = text.indexOf(' — ')
  if (idx > -1) {
    children = [run(text.slice(0, idx), { bold: true }), run(text.slice(idx))]
  } else {
    children = [run(text)]
  }
  return new Paragraph({ bullet: { level: 0 }, spacing: { after: 60, line: 290 }, children })
}
function numbered(text, ref) {
  return new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 60, line: 290 },
    children: [run(text)] })
}

function cell(text, { bold = false, header = false, width } = {}) {
  return new TableCell({
    width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
    shading: header ? { fill: 'F3E7E7' } : undefined,
    margins: { top: 60, bottom: 60, left: 90, right: 90 },
    children: [new Paragraph({ children: [new TextRun({ text, bold: bold || header, size: 21, color: header ? '5B1414' : INK })] })],
  })
}
function table(headers, rows, widths) {
  const headerRow = new TableRow({ tableHeader: true,
    children: headers.map((hh, i) => cell(hh, { header: true, width: widths && widths[i] })) })
  const bodyRows = rows.map((r) => new TableRow({ children: r.map((c, i) => cell(c, { width: widths && widths[i] })) }))
  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headerRow, ...bodyRows] })
}
function spacer(after = 160) { return new Paragraph({ spacing: { after }, children: [] }) }

// ---- cover -----------------------------------------------------------------
const center = (children, spacing = {}) => new Paragraph({ alignment: AlignmentType.CENTER, spacing, children })
const cover = [
  center([run('Rangamati Science and Technology University (RMSTU)', { bold: true, size: 32 })], { after: 80 }),
  center([run('Department of Computer Science and Engineering', { size: 24, color: '333333' })], { after: 600 }),
  center([run('OBJECT ORIENTED PROGRAMMING LAB  ·  PROJECT REPORT', { size: 19, color: RED, bold: true })], { after: 160 }),
  center([run('Blood Finder', { bold: true, size: 64, color: MAROON })], { after: 120 }),
  center([run('A Trusted Blood-Donor Platform for Bangladesh — connecting verified donors and patients in seconds.', { size: 24, color: '444444', italics: true })], { after: 700 }),
]
const labelVal = (label, lines) => new Paragraph({
  spacing: { after: 90 },
  children: [
    new TextRun({ text: label + ':  ', bold: true, color: MAROON, size: 23 }),
    ...lines.flatMap((ln, i) => i === 0 ? [new TextRun({ text: ln, size: 23 })]
      : [new TextRun({ text: ln, size: 23, break: 1 })]),
  ],
})
const coverMeta = [
  new Paragraph({ border: { top: { color: 'C9A3A3', size: 8, style: BorderStyle.SINGLE, space: 6 } }, spacing: { after: 160 }, children: [] }),
  labelVal('Submitted by', ['Juli Nath (ID: 2401011004)', 'Asma Akter (ID: 2401011021)', 'Mom Chakraborty (ID: 2401011034)', 'CSE 11th Batch']),
  labelVal('Submitted to', ['Dhonita Tripura', 'Assistant Professor, Department of CSE, RMSTU']),
  labelVal('Live site', ['https://blood-finder-bangladesh.vercel.app']),
  labelVal('Source code', ['https://github.com/julinath/blood-finder']),
  labelVal('Date of submission', ['______________________']),
  new Paragraph({ pageBreakBefore: false, children: [] }),
]

// ---- body ------------------------------------------------------------------
const body = []
const push = (...x) => body.push(...x)

// Abstract
push(h1('Abstract'))
push(p('In Bangladesh, finding blood during an emergency still depends on saved phone numbers, scattered Facebook groups and word of mouth — a slow, unreliable process that also exposes donors to spam and opens the door to fraud and middlemen. Blood Finder is a web platform that solves this by letting anyone search a pool of admin-verified donors by blood group and district in seconds, post urgent needs on a public emergency board where nearby donors step forward, and register as a donor — all on a mobile-first, Bangla interface.'))
push(p('The project began as a JavaFX desktop application for our Object Oriented Programming course and was then rebuilt as a production web application using Next.js 16, TypeScript and Supabase (PostgreSQL + Auth), keeping the same object-oriented domain model (User, Donor, BloodRequest, DonationRecord). Trust and privacy are the core design principles: a donor’s phone number is never public, every donation is confirmed by the receiver (not the donor) to prevent fake counts, and the database itself blocks anonymous visitors from ever reading personal data. The result is a live, usable platform that turns the concepts learned in an OOP lab into a real product.'))

// TOC
push(h1('Table of Contents'))
const toc = ['Introduction','Problem Statement','Objectives','Existing System and Its Limitations','Proposed System (Blood Finder)','System Requirements','System Design','Object-Oriented Concepts Applied','Technology Stack','Implementation','Security and Privacy','Results (Screenshots)','Limitations and Future Work','Conclusion','References']
toc.forEach((t, i) => push(new Paragraph({ spacing: { after: 50 }, children: [run(`${i + 1}.  ${t}`, { size: 23 })] })))

// 1 Introduction
push(h1('1. Introduction'))
push(p('Blood cannot be manufactured — it can only come from a donor. Yet when a patient suddenly needs blood, families are left calling around, posting on social media and hoping a matching donor is nearby, free and eligible. Precious time is lost, and the process is easy to exploit.'))
push(p('Blood Finder is our answer: a single, trusted platform that connects patients with verified blood donors across all 64 districts of Bangladesh. Users can search donors by blood group and area, send a request, or post an urgent need on a public board where nearby donors respond with one tap. The interface is mobile-first and primarily in Bangla, because our target users are ordinary people using everyday phones.'))
push(p('This project also has an academic story. It started as a JavaFX + SQLite desktop application built for our Object Oriented Programming (OOP) Lab, using a clean object model and the Model–View–Controller pattern. We then rebuilt the same idea as a production web application so that it could actually be used by people on their phones — carrying the same OOP design into a modern stack. The original desktop version is preserved on the desktop-app branch of the repository.'))

// 2 Problem
push(h1('2. Problem Statement'))
push(p('Finding blood quickly in Bangladesh is harder than it should be:'))
push(bullet('No reliable place to search — a saved phone number may not answer when it matters; area-based Facebook groups respond slowly and posts sink out of sight; local blood clubs keep separate lists that no one else can see.'))
push(bullet('Some people make money from the crisis — donor phone numbers are sold, fake "donors" demand payment at the hospital, and middlemen treat an emergency as a business opportunity.'))
push(bullet('No privacy for donors — phone numbers get spread across public groups, so fear of spam and unwanted calls keeps many willing donors away.'))
push(bullet('Fear and wrong beliefs — myths such as "donating makes you weak" and a lack of clear information stop many healthy people from donating.'))
push(bullet('No way to know if a donor is eligible — a donor must wait about 90 days between donations, but there is usually no way to know this in advance.'))

// 3 Objectives
push(h1('3. Objectives'))
;[
  'Build a searchable pool of admin-verified donors filterable by blood group, district and area.',
  'Provide a public emergency board where patients post urgent needs and nearby donors can respond instantly.',
  'Protect donors with donor-first privacy — a donor’s number is never shown publicly; the donor chooses whether to respond.',
  'Enforce the 90-day eligibility rule consistently across search, profiles and the request form.',
  'Prevent fraud: record every donation and let only the receiver confirm it, so no one can inflate their own donation count.',
  'Give administrators tools to approve donors and moderate abuse reports.',
  'Deliver a fast, mobile-first, Bangla experience.',
  'Apply object-oriented design principles in a real, deployable product.',
].forEach((t) => push(bullet(t)))

// 4 Existing system
push(h1('4. Existing System and Its Limitations'))
push(p('Today people rely on a mix of informal channels, each with serious gaps:'))
push(table(['Current approach', 'Limitation'], [
  ['Saved phone numbers / personal contacts', 'The one person may be unavailable, out of town, or recently donated.'],
  ['Facebook / area groups', 'Must find and join the right group; posts get buried; responses are slow and unverified.'],
  ['Local blood-donation clubs', 'Each keeps its own list; the lists are not connected or searchable.'],
  ['Paid "donor" middlemen', 'Charge money, may be fake, and expose families to fraud.'],
  ['Stand-alone desktop apps', 'Single machine, single user, no shared data, must be installed — and our users are on mobile.'],
], [40, 60]))
push(spacer(80))
push(p('None of these provide a single, verified, searchable, privacy-respecting and mobile-friendly system — which is exactly the gap Blood Finder fills.'))

// 5 Proposed
push(h1('5. Proposed System (Blood Finder)'))
push(p('Blood Finder is one web platform with three main flows, supported by an administration panel and a statistics map.'))
push(h2('5.1 Key Features'))
;[
  'Find Donors — search verified donors by blood group, district and area; each card shows an eligibility badge and total donation count.',
  'Donor Profiles — public profile with eligibility countdown and donation history; the contact number is shown only to signed-in users.',
  'Blood Requests — a registered user sends a request to a donor; the donor accepts (revealing their number to the requester) and, after donating, the requester confirms it is complete.',
  'Emergency Board — post an urgent need; nearby donors respond with one tap; the board auto-filters to the viewer’s own blood group and district.',
  'Become a Donor — a single form (pre-filled from the profile) that, after admin approval, makes the donor visible in search.',
  'Admin Panel — approve or un-list donors, handle abuse reports, and oversee users and emergencies.',
  'Statistics & Map — an interactive 64-district heat-map and blood-group distribution.',
].forEach((t) => push(bullet(t)))

// 6 Requirements
push(h1('6. System Requirements'))
push(h2('6.1 Functional Requirements'))
;[
  'Users can register and log in with email/password, a mobile number, or Google.',
  'A user can apply to become a donor; admins approve before the donor appears in search.',
  'Visitors can search and filter donors and view public profiles.',
  'Registered users can send, accept/decline, cancel and complete blood requests.',
  'Users can post emergency requests and offer to donate on them.',
  'Users can report abuse, no-shows, fake requests or payment demands.',
  'Admins can approve/un-list donors and resolve reports.',
  'The system displays live availability and district/blood-group statistics.',
].forEach((t) => push(bullet(t)))
push(h2('6.2 Non-Functional Requirements'))
;[
  'Security & privacy — personal data (email, mobile, health) is unreadable by anonymous visitors; every write is re-checked on the server.',
  'Performance — fast first load on weak phones (server-side rendering); the heavy district map is computed on the server.',
  'Usability — mobile-first, Bangla-first, no horizontal scrolling.',
  'Reliability & integrity — donation counts and duplicate requests are guarded by the database.',
  'Maintainability — typed code, one shared domain model, idempotent SQL.',
].forEach((t) => push(bullet(t)))
push(h2('6.3 Hardware & Software'))
push(bullet('For users — any modern smartphone or computer with a web browser and internet.'))
push(bullet('For development — Node.js, a code editor, Git, and a Supabase project; deployed on Vercel.'))

// 7 Design
push(h1('7. System Design'))
push(h2('7.1 System Architecture'))
push(p('The application has three layers: a React client in the browser, the Next.js server (Server Components, Server Actions and route protection) running on Vercel, and Supabase (PostgreSQL + Auth) where Row Level Security and column-level grants protect the data. Public reads go straight to the database with a restricted anonymous key; everything that writes data goes through a server action that re-checks the user.'))
push(...figure('diagrams/architecture.png', 'Figure 1: Three-layer system architecture (Client → Next.js → Supabase).', 600, 420))
push(h2('7.2 Use-Case Diagram'))
push(p('Four actors interact with the system: a Visitor (not logged in), a Donor, a Requester (a registered user who needs blood), and an Admin.'))
push(...figure('diagrams/usecase.png', 'Figure 2: Use-case diagram of Blood Finder.', 360, 720))
push(h2('7.3 Class Diagram'))
push(p('The object model is the heart of the project and is shared between the desktop and web versions. The main classes are Profile (user), Donor, BloodRequest, DonationRecord, EmergencyRequest and EmergencyOffer.'))
push(...figure('diagrams/class.png', 'Figure 3: Domain class diagram.', 560, 760))
push(h2('7.4 Database Design'))
push(p('The database has eight tables, all protected by Row Level Security. The entity-relationship diagram below shows how they relate; the table after it summarises each one.'))
push(...figure('diagrams/er.png', 'Figure 4: Entity-Relationship (ER) diagram of the database.', 600, 520))
push(table(['Table', 'Purpose'], [
  ['profiles', 'Extends the auth user — name, email, mobile, district, admin flag.'],
  ['donors', 'Donor record — blood type, location, availability, last donation date, donation count, approval status.'],
  ['blood_requests', 'Direct requests from a requester to a donor (PENDING → ACCEPTED → COMPLETED / CANCELLED).'],
  ['donation_records', 'Immutable log of completed donations; inserting one bumps the donor’s count via a trigger.'],
  ['emergency_requests', 'Public emergency needs board (blood type, hospital, urgency, status).'],
  ['emergency_contacts', 'The requester’s phone number, kept in a separate table so it stays private.'],
  ['emergency_offers', '"I can donate" responses from donors to an emergency request.'],
  ['reports', 'Abuse / no-show / fake-request reports that feed the admin queue.'],
], [30, 70]))
push(h2('7.5 Request Lifecycle'))
push(p('The sequence diagram below shows the most important flow — from a request to a recorded donation — and where the anti-fraud rule applies: the donation is confirmed by the receiver, never by the donor.'))
push(...figure('diagrams/sequence.png', 'Figure 5: Sequence of a blood request through to a recorded donation.', 600, 520))

// 8 OOP
push(h1('8. Object-Oriented Concepts Applied'))
push(p('The most important lesson from the OOP course is not a language — it is a way of thinking: split a problem into objects, hide data and details, reuse code, and separate responsibilities. The same domain model we designed for the desktop app lives on in the web app as typed interfaces. The table below maps each concept to both versions.'))
push(table(['OOP concept', 'Desktop (Java / JavaFX)', 'Web (TypeScript / Next.js)'], [
  ['Encapsulation (keep data private)', 'Donor.java uses private fields with getters/setters — no other class changes its data directly.', 'One module (eligibility.ts) holds the 90-day rule; the whole site calls that single place.'],
  ['Abstraction (hide the details)', 'A Repository interface hides SQLite; the service layer never sees SQL.', 'Server Actions hide the database; a UI component just calls acceptRequest().'],
  ['Inheritance & Polymorphism (reuse code)', 'A common base entity and interface implementations — swap the database and the rest stays the same.', 'Typed unions (RequestStatus) and reusable components (Field, BloodTypeBadge).'],
  ['MVC / Separation of Concerns (split into parts)', 'Model (entities) · View (FXML) · Controller — classic JavaFX MVC.', 'Database = Model · React pages = View · Server actions = Controller.'],
], [26, 37, 37]))
push(spacer(80))
push(p([run('The same model — User, Donor, BloodRequest, DonationRecord — that we designed in the OOP lab survives, almost unchanged, as typed interfaces in the web app. That continuity is the project’s biggest OOP lesson.', { italics: true })]))

// 9 Tech stack
push(h1('9. Technology Stack'))
push(table(['Technology', 'Role', 'Why we chose it'], [
  ['Next.js 16 + React 19', 'Full-stack web framework', 'UI and server logic in one framework — no separate backend to build and maintain; fast server-side rendering.'],
  ['TypeScript', 'Typed language', 'Our whole domain model is typed, so mistakes are caught while writing code, not after deploy.'],
  ['Tailwind CSS 4', 'Styling', 'Consistent design, tiny CSS output, very fast to build a mobile-first UI.'],
  ['Supabase', 'PostgreSQL database + Auth', 'Real SQL with Row Level Security; email/mobile/Google login ready-made.'],
  ['Vercel', 'Hosting + CI/CD', 'Every git push auto-deploys; free, fast and global.'],
  ['d3-geo', 'District map projection', 'The 700 KB map is turned into an image on the server, so it never reaches the phone.'],
  ['Playwright', 'Browser testing', 'Every flow is checked in a real browser, on desktop and 390 px mobile.'],
  ['Hind Siliguri', 'Bangla font', 'Clean, correct Bangla rendering.'],
], [26, 26, 48]))

// 10 Implementation
push(h1('10. Implementation'))
push(p('The application is organised into clear modules:'))
;[
  'Authentication — email/password, mobile-number sign-up (via a synthetic email) and Google OAuth, handled by Supabase Auth.',
  'Route protection — proxy.ts guards the private pages (/profile, /become-donor, /request, /admin, /emergency/new).',
  'Server Actions — all database writes go through server actions that re-check the logged-in user and their ownership of the data.',
  'Business rules — the 90-day eligibility rule and fitness checks live in one module and are reused everywhere.',
  'Atomic operations — a single database function, complete_blood_request(), closes the request and writes the donation record together; a trigger then updates the donation count and the last-donation date.',
  'Privacy — anonymous visitors are given column-level read access only to safe donor-card fields; email, mobile and health data are never exposed.',
].forEach((t) => push(bullet(t)))
push(...figure('shots/home-desktop.png', 'Figure 6: Home page — quick blood-group search, live availability and the district map.', 600, 460))

// 11 Security
push(h1('11. Security and Privacy'))
push(p('Trust is the product. Security is applied in three layers, so that a bug in one layer is still caught by the others:'))
push(bullet('User interface — input validation and login checks.'))
push(bullet('Server actions — every write re-checks authentication and ownership.'))
push(bullet('Database — Row Level Security, column-level grants and CHECK constraints. Even a direct API call cannot read a donor’s phone number.'))
push(h2('11.1 Donor-First Privacy'))
push(p('A donor’s phone number is never shown on the public board. When a donor chooses to respond to an emergency, only then does the requester see the donor’s number and call them — so the decision always stays with the donor, and there is no spam or harassment.'))
push(h2('11.2 Fraud Prevention'))
push(p([run('The receiver confirms the donation — never the donor. ', { bold: true }), run('A donor can never mark their own donation as complete, so no one can inflate their donation count. The confirmation is enforced inside the database, and the emergency board follows the same rule.')]))
push(...figure('shots/emergency-board.png', 'Figure 7: Emergency board — urgent requests with one-tap "I can donate"; the requester’s number stays private.', 600, 460))

// 12 Results
push(h1('12. Results (Screenshots)'))
push(p('The platform is fully built and live at https://blood-finder-bangladesh.vercel.app. Selected screens are shown below.'))
push(...figure('shots/donor-search.png', 'Figure 8: Donor search with blood-group, district and eligibility badges.', 600, 460))
push(...figure('shots/admin-panel.png', 'Figure 9: Admin panel — donor approval queue, reports queue and oversight (personal contacts masked).', 600, 460))
push(...figure('shots/stats-map.png', 'Figure 10: District heat-map and blood-group distribution (rendered on the server).', 600, 460))
push(...figure('shots/home-mobile.png', 'Figure 11: Mobile-first layout — search is visible above the fold at 390 px.', 360, 760))

// 13 Limitations + future
push(h1('13. Limitations and Future Work'))
push(h2('13.1 Limitations'))
push(bullet('The platform currently includes demo donor data for demonstration; it grows with real users.'))
push(bullet('Notifications are not yet automatic — donors check the board themselves.'))
push(bullet('Identity verification is by admin review only (no national-ID check yet).'))
push(h2('13.2 Future Work'))
push(bullet('SMS / push notifications so matching donors are alerted instantly.'))
push(bullet('Donor recognition — milestone badges (5, 10, 25 donations).'))
push(bullet('Stronger verification — NID / student-ID checks and hospital partnerships.'))
push(bullet('Smart automation — auto-expiry of old requests and eligibility reminders.'))

// 14 Conclusion
push(h1('14. Conclusion'))
push(p('Blood Finder takes a real, painful problem — finding safe blood in an emergency — and solves it with a single trusted platform that is fast, private and free. By removing unreliable middle layers and connecting patients directly with verified donors, it makes the process faster and safer. Just as importantly, it shows how the object-oriented design we learned in the lab — a clean domain model, encapsulation, abstraction and separation of concerns — carries directly into a real, deployable product. The platform is live today and ready to grow into a trusted national blood-donor network.'))

// 15 References
push(h1('15. References'))
;[
  'Next.js Documentation — https://nextjs.org/docs',
  'React Documentation — https://react.dev',
  'Supabase Documentation (Auth & Row Level Security) — https://supabase.com/docs',
  'PostgreSQL Documentation — https://www.postgresql.org/docs',
  'Tailwind CSS Documentation — https://tailwindcss.com/docs',
  'TypeScript Handbook — https://www.typescriptlang.org/docs',
  'Vercel Documentation — https://vercel.com/docs',
  'Blood Finder source code — https://github.com/julinath/blood-finder',
].forEach((t) => push(numbered(t, 'refs')))

// ---- assemble --------------------------------------------------------------
const doc = new Document({
  creator: 'Blood Finder Team',
  title: 'Blood Finder — Project Lab Report',
  numbering: {
    config: [{ reference: 'refs', levels: [{ level: 0, format: 'decimal', text: '%1.', alignment: AlignmentType.START }] }],
  },
  styles: {
    default: { document: { run: { font: 'Georgia', size: 23, color: INK } } },
  },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1021 } } },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Blood Finder — Project Lab Report   |   Page ', size: 16, color: '888888' }),
          new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '888888' }),
          new TextRun({ text: ' of ', size: 16, color: '888888' }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: '888888' })],
      })] }),
    },
    children: [...cover, ...coverMeta, ...body],
  }],
})

const out = join(__dirname, 'Blood-Finder-Lab-Report.docx')
const buf = await Packer.toBuffer(doc)
writeFileSync(out, buf)
console.log('DOCX written:', out, '(' + (buf.length / 1024).toFixed(0) + ' KB)')
