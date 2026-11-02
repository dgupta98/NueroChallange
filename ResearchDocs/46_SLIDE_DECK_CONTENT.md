# Slide Deck Content — Step Cards
**Team Kaleidoscope | Author: Dipesh (content) + Anand (layout) | Date: Nov 2, 2026**
**Template: `_For Presenters/Presentation/REQUIRED - NA AI Challenge 5 Slide Template (Final).pptx`**

**Anand: paste the text under each slide heading into the matching slide in the required template. Keep the template's fonts, colors, and placeholder structure. Do not add extra slides — the challenge rules allow exactly 5.**

**Live app URL (put on every slide footer):** https://nuero-challange.vercel.app/
**Repo:** https://github.com/dgupta98/NueroChallange

**Team names on slide 1 (alphabetical by last name — challenge rule):**
Manan Batra · Naman Dewan · Dipesh Gupta · Anand Kumar

---

## SLIDE 1 — TITLE + PROBLEM

**Headline (large):**
Step Cards

**Subhead (one line):**
Spoken instruction in. Picture steps out. Independence, built in.

**Problem statement (3 bullets, keep short):**
- Autistic and ADHD students lose multi-step verbal instructions at the first unknown word — working memory under task-load, not inattention.
- Teachers at AZACS build picture schedules by hand the night before every lesson. No existing tool handles instructions that were never planned.
- Same failure point follows these students into first employment: a worker who asks a manager to repeat an instruction twice gets fired.

**Screenshot slot:** Teacher dashboard home — the class list + "Add new instruction" composer.

**Footer:** Team Kaleidoscope · Manan Batra · Naman Dewan · Dipesh Gupta · Anand Kumar · nuero-challange.vercel.app

---

## SLIDE 2 — PARTNER RESEARCH & INSIGHT

**Headline:**
We did not invent this problem. Our partners handed it to us.

**AZACS visit — Oct 29, 2026:**
- Toured hands-on cooking, robotics, and drone classes with Maran, Director of Operations.
- 1:3 staffing ratio: three students per teacher, each at a different reading level, in a 45-minute class.
- Teacher quote: *"I need to be able to give an instruction and have the visual support appear before the student has already moved on."*

**First Place AZ visit — Oct 27 + 29, 2026:**
- Toured residences and Transition Academy with Josh Munoz, employment program director.
- About half of residents are employed; the ones who struggle freeze at verbal instructions from a manager.
- Josh's exact ask: *"a way for residents to track their own skill progress."*

**Insight (one line, bold):**
One neurological failure point — working memory under task-load — spans age 8 to age 28. One engine. Two modes.

**Screenshot slot:** Side-by-side — classroom composer (teacher view) and adult-mode step rewrite (worker view).

---

## SLIDE 3 — SOLUTION + LIVE PRODUCT

**Headline:**
A deployed product, not a mock-up.

**What it does (3 numbered bullets):**
1. Teacher speaks an instruction. Groq Qwen3-32B breaks it into numbered steps and auto-splits long instructions into multi-part lessons (Part 1 of 2, Part 2 of 2…).
2. The AI rewrites every step at each student's reading level — pictogram-only, two-word, four-word, or full sentence — and matches each step to an ARASAAC pictogram.
3. Student taps through, earns a sticker per routine, and the number of visible cards shrinks as they master the task. The teacher sees every student's progress on one screen.

**What's live right now:**
- Deployed at **https://nuero-challange.vercel.app/** on Vercel + Supabase + Groq.
- Full teacher flow: speak → review → approve → push to student device in real time.
- Per-student sticker book and progress drill-down (new, Nov 2) — teacher taps a student and sees every routine they finished, every help tap, every sticker earned.
- Adult mode: paste a manager's instruction, get numbered steps + ambiguous-term flags + a clarifying question.

**Screenshot slot (grid of 4):**
- Teacher composer with speech-to-text in progress
- Multi-part lesson preview (teacher sees "Part 1 of 2")
- Student card view with pictogram + timer
- Teacher drill-down: one student's sticker book + finished routines list

---

## SLIDE 4 — EVIDENCE + IMPACT

**Headline:**
Twenty years of special-ed research. Four practices. One app.

**NCAEP 2020 verified EBPs that Step Cards implements:**
1. **Task Analysis** — breaking a routine into sequential teachable steps (what the AI pipeline does).
2. **Visual Supports** — pictogram per step from ARASAAC (35,000+ CC-licensed images).
3. **Prompting with Systematic Fading** — card count shrinks as mastery grows.
4. **Technology-Aided Instruction** — the whole product category.

**Why this matters:**
This is not a prototype built in a week. It is a product built on the only review that pooled 20 years of autism intervention research (NCAEP, UNC Chapel Hill, 2020). Teachers already use these four practices on paper. We put them in software, in real time.

**Pilot plan (6 weeks at AZACS, Dec 2026 – Feb 2027):**
- Measure: steps completed independently (pre vs. post), help-tap frequency, teacher setup time.
- Publish outcome report + replication guide so any school can run it.
- Then: Arizona Dept of Education, CEC teacher networks, First Place AZ Transition Academy.

**Economic case:**
Every neurodivergent worker who loses a job to a preventable communication failure costs government VR programs, families, and the worker. Reducing that cost is the long-term value — not subscriptions.

**Screenshot slot:** Student finishing a routine + sticker-earned celebration screen.

---

## SLIDE 5 — BUSINESS MODEL + ASK

**Headline:**
Cheap to run. Clear path to revenue. Partner ready to pilot.

**Cost structure (one line each):**
- Groq Qwen3-32B: ~$0.001 per instruction.
- Supabase: free tier covers pilot. Vercel: free tier hosts production.
- ARASAAC pictograms: free (CC BY-NC-SA, Sergio Palao).
- Marginal cost per additional school ≈ $1/day.

**Revenue path (3 stages):**
1. **Stage 1 — Grants:** IDEA (assistive tech in special ed), NSF SBIR (edtech), Autism Speaks.
2. **Stage 2 — Per-teacher SaaS:** $200–500/teacher/year (benchmarked against Goally $300+/device, Tiimo subscription).
3. **Stage 3 — Institutional licensing:** First Place AZ + similar programs for adult mode; AZ DES Vocational Rehab contract; employer accessibility leads.

**The ask:**
> We have the partner. We have the evidence base. We have a deployed working product. What we need is runway to run the AZACS pilot, publish the outcome, and take that outcome to the next school.

**Hard close (center of slide, bold):**
Step Cards. Spoken instruction in. Independence out.

**Screenshot slot:** QR code to https://nuero-challange.vercel.app/ so judges can open it on their phone.

---

## DESIGN NOTES FOR ANAND

- **Template rules (from challenge):** Use the exact 5-slide PPTX. Do not add slides. Do not remove the Spark Center/ASU branding. Keep the fonts.
- **Fonts (if swappable):** Headings in a geometric sans (Poppins or template default). Body in Inter or template default. 24pt minimum for body text — judges read from the back of the room.
- **Color palette:** Match the template. Accent on orange/teal only if the template allows.
- **Screenshots:** Dipesh will capture these from the live Vercel app and drop them in `_For Presenters/Presentation/screenshots/`. See file `47_SCREENSHOT_SHOTLIST.md` for the exact list and resolutions.
- **Alphabetical team name rule:** Per challenge submission rules, slide 1 must list team members alphabetically by last name — **Manan Batra, Naman Dewan, Dipesh Gupta, Anand Kumar**. Do not reorder.
- **Export:** Save as both `.pptx` (editable) and `.pdf` (for the submission form). Keep both in `_For Presenters/Presentation/`. The submission form link must be a Google Slides "Anyone with link can view" share URL.
- **Lock after submission:** Challenge rule — once the Airtable form is submitted on Nov 5, do not edit the deck. Make a frozen copy named `Step_Cards_Submitted_Nov5.pptx` and keep edits in a separate working copy if needed.
