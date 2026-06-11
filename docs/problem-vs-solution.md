# Blood Finder — সমস্যা বনাম সমাধান (Problem vs Solution)

> বাংলাদেশে জরুরি রক্ত খোঁজার বাস্তব অভিজ্ঞতা থেকে উঠে আসা সমস্যাগুলো, আর Blood
> Finder ঠিক কোন ডিজাইন-সিদ্ধান্ত দিয়ে কোনটার জবাব দেয়। Presentation, pitch বা
> supervisor-এর প্রশ্নের উত্তরে সরাসরি ব্যবহারযোগ্য।

---

## ১. ফোনবুকে দু-একটা নম্বর — emergency-তে সে available নাও থাকতে পারে

**বাস্তবতা:** কোনো ক্লাবের পরিচিত একজনের নম্বর সেভ রাখি। দরকারের দিন ফোন দিলে
দেখা যায় — সে ঢাকার বাইরে, অসুস্থ, কিংবা তিন সপ্তাহ আগেই রক্ত দিয়ে ফেলেছে।
একটা নম্বরের উপর পুরো ভরসা।

**Blood Finder-এর জবাব:**
- এক নম্বর নয় — জেলা + ব্লাড গ্রুপ দিয়ে **সব verified রক্তদাতার তালিকা** এক সার্চে।
- প্রতিটি রক্তদাতার **live availability toggle** (Available / Unavailable) — যিনি এখন
  দিতে পারবেন না, তিনি তালিকা থেকে সরে থাকেন।
- **৯০-দিনের eligibility countdown** স্বয়ংক্রিয়: শেষ রক্তদানের পর কতদিন বাকি, সার্চ
  badge-এই দেখা যায়। যাকে অনুরোধ করছেন, সে আসলেই দিতে পারবে কিনা — আগেই জানা।

## ২. ফেসবুক গ্রুপের ভরসায় থাকা

**বাস্তবতা:** নিজের এলাকার গ্রুপ খুঁজে join থাকতে হয়; বাসা বদলালে নতুন এলাকার
গ্রুপ খুঁজতে হয়; পোস্ট করলে সময়মতো রেসপন্স আসে না; কিছুক্ষণ পরেই পোস্ট feed-এর
নিচে হারিয়ে যায়।

**Blood Finder-এর জবাব:**
- কোনো গ্রুপ খোঁজা লাগে না — **৬৪ জেলার সবাই একই প্ল্যাটফর্মে**; এলাকা বদলালে
  প্রোফাইলে district বদলালেই সব ফিল্টার নিজে adjust হয়ে যায়।
- Emergency রিকোয়েস্ট feed-এ হারায় না — **যতক্ষণ OPEN, ততক্ষণ বোর্ডের উপরে**;
  সমাধান হলে requester নিজে বন্ধ করেন।
- রক্তদাতারা বোর্ড খুললেই **নিজের গ্রুপ + জেলার রিকোয়েস্ট auto-filtered** দেখেন —
  scroll করে খুঁজতে হয় না, relevant টা সামনে আসে।

## ৩. এলাকার রক্তদান সংগঠনগুলো একে অপরের সাথে যুক্ত নয়

**বাস্তবতা:** প্রতিটি সংগঠনের নিজস্ব খাতা/গ্রুপ/মেসেঞ্জার — এক সংগঠনে donor না
মিললে আরেকটায় নতুন করে খোঁজ শুরু। কেউ কারো ডেটা দেখে না।

**Blood Finder-এর জবাব:**
- **একটাই জাতীয় বোর্ড ও donor pool** — যেকোনো সংগঠনের সদস্য এখানে নিবন্ধন করলে
  সবার কাছে খুঁজে পাওয়া যায়।
- জেলা-ভিত্তিক **live donor map** — কোন জেলায় কত রক্তদাতা, কোন গ্রুপ কম, এক
  নজরে; সংগঠনগুলোও এটা দেখে কোথায় donor drive দরকার বুঝতে পারে।

## ৪. মানুষ রক্ত দিতে ভয় পায় — সঠিক জ্ঞান ও মোটিভেশনের অভাব

**বাস্তবতা:** "রক্ত দিলে শরীর দুর্বল হয়ে যায়", "ডায়াবেটিস থাকলে দেওয়া যায় না" —
এসব ভুল ধারণায় অনেক সুস্থ মানুষ কখনোই রক্তদাতা হন না।

**Blood Finder-এর জবাব:**
- হোমপেজেই **Myths vs Facts** সেকশন — প্রচলিত ভুল ধারণা ভাঙা, বাংলায়।
- **Donation Guide**: কারা দিতে পারবেন (বয়স/ওজন/গ্যাপ), রক্তদানের আগে-পরে করণীয়।
- **স্বীকৃতি = মোটিভেশন**: প্রতিটি রক্তদান প্ল্যাটফর্মে রেকর্ড হয়, প্রোফাইলে
  "🩸 X বার রক্ত দিয়েছেন" গর্বের সংখ্যা বাড়ে। (Roadmap: milestone badge — ৫/১০/২৫ বার।)

## ৫. রক্ত দিতে এসে টাকা চাওয়া (paid "donor")

**বাস্তবতা:** কথিত donor হাসপাতালে এসে রোগীর অসহায় পরিবারের কাছে টাকা দাবি করে।

**Blood Finder-এর জবাব:**
- প্রতিটি রক্তদাতা **admin-verified** — অনুমোদন ছাড়া সার্চেই আসে না।
- ঘটলে সাথে সাথে **report**: "টাকা চেয়েছে (Paid donor)" আলাদা category হিসেবেই
  আছে → admin queue → যাচাই করে donor-কে **unlist/remove**।
- রক্তদানের ইতিহাস প্ল্যাটফর্মে রেকর্ডেড — ভালো track record-ওয়ালা donor চেনা যায়।

## ৬. রিকোয়েস্টারের প্রতারণা — donor এনে রক্ত বিক্রি করে দেওয়া

**বাস্তবতা:** ভুয়া "রোগীর" নামে রক্ত নিয়ে পরে বিক্রি; donor জানতেও পারে না।

**Blood Finder-এর জবাব:**
- **Donor-first privacy**: রক্তদাতার নম্বর কখনো public হয় না; রক্তদাতা নিজে সাড়া
  দিলে তবেই requester তাঁর নম্বর পান — সিদ্ধান্ত রক্তদাতার হাতে।
- রিকোয়েস্টে **রোগীর সমস্যা + হাসপাতাল + কবে লাগবে** স্পষ্ট লিখতে হয়; নিরাপত্তা
  নির্দেশনা: সরাসরি হাসপাতালের কেবিন/ওয়ার্ডে গিয়ে রক্ত দিন।
- "ভুয়া রিকোয়েস্ট (Fake request)" report category + admin oversight; রিপোর্ট শুধু
  সংশ্লিষ্ট ব্যক্তিরাই করতে পারেন — ঢালাও মিথ্যা রিপোর্টের সুযোগ নেই।

## ৭. সবচেয়ে বড়টা — রক্ত খোঁজাকে ঘিরে "ব্যবসা"

**বাস্তবতা:** সংগঠনের নামে টাকার বিনিময়ে donor খুঁজে দেওয়া, টাকা দিলে তবে
donor-এর নম্বর — মানুষের বিপদকে পুঁজি করা মধ্যস্বত্বভোগী।

**Blood Finder-এর জবাব:**
- **সম্পূর্ণ ফ্রি, সরাসরি সংযোগ** — রোগীর পরিবার ↔ রক্তদাতা, মাঝখানে কেউ নেই।
  নম্বর পেতে টাকা নয়, লাগে শুধু লগইন।
- নম্বরের ব্যবসা **প্রযুক্তিগতভাবেই অসম্ভব** করা হয়েছে: anonymous ভিজিটর database
  থেকেও ফোন/ইমেইল পড়তে পারে না (column-level security); bulk scraping ঠেকাতে
  rate-limit; emergency contact আলাদা access-controlled টেবিলে।
- Open-source, স্বচ্ছ প্ল্যাটফর্ম — কার কাছে কী ডেটা যায়, কোডেই দেখা যায়।

---

## এক লাইনে

> **মাঝখানের সব ভরসাহীন স্তর সরিয়ে দিয়ে রোগী আর রক্তদাতাকে সরাসরি, নিরাপদে,
> বিনামূল্যে যুক্ত করা — এটাই Blood Finder।**

---

## English summary (presentation-ready)

| # | Today's reality | Blood Finder's answer |
|---|---|---|
| 1 | One saved phone number; that donor may be unavailable when it matters | Searchable pool of verified donors with live availability + automatic 90-day eligibility |
| 2 | Area-based Facebook groups: must find/join the right one, posts sink, slow responses | One national platform; requests stay on the board until closed; feed auto-filters to the viewer's blood group & district |
| 3 | Local blood organizations are disconnected islands | A single shared donor pool + a live 64-district donor map |
| 4 | Fear & misconceptions stop healthy people from donating | Myths-vs-facts and donation guides in Bengali; recorded donation counts turn donors into recognized heroes |
| 5 | Fake "donors" demand money at the hospital | Admin verification gate + a "demanded payment" report category that gets donors unlisted |
| 6 | Fraudulent requesters resell donated blood | Donor-first privacy (donor decides who gets their number), hospital-direct guidance, fake-request reports |
| 7 | Middlemen sell donor phone numbers — misery as a business | Free and direct by design; numbers are technically unscrapeable (column-level security + rate limits) — there is nothing left to sell |
