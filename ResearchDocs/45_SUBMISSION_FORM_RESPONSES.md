# Airtable Submission Form Responses — Step Cards
**Team Kaleidoscope | Author: Dipesh | Date: Nov 2, 2026**
**Deliverable:** Final text for every field on the Nov 5 submission form.
**Instructions:** Copy each block below verbatim into the matching form field. No further edits should be needed.

---

## FIELD-BY-FIELD VALUES

### Submitter name
Dipesh Gupta

### Credited Team Mates (alphabetical by LAST name)
Manan Batra, Naman Dewan, Dipesh Gupta, Anand Kumar

### Venture name
Step Cards

### Launchpad
ASU Scottsdale Launchpad (Spark Center) — Nov 6, 2026

### Project URLs
- **Google Slides URL:** _(Anand pastes final link — set to "Anyone with the link can view")_
- **GitHub URL:** https://github.com/dgupta98/NueroChallange
- **Business Model Canvas PDF:** `_For Presenters/Business Model Canvas/NA AI CHALLENGE_BMC_Fillable.pdf` _(Anand uploads final version)_
- **AI Prompts PDF:** Compiled from `47_AI_PROMPTS_FOR_PDF.md` — exported to PDF before upload.

### Presenter availability
Yes — Manan Batra and Dipesh Gupta present in person; Naman Dewan and Anand Kumar in support.

---

## STEP 2 — WRITTEN RESPONSES

---

### 1. Who is your target user?

Step Cards serves two neurodivergent populations at two life stages, united by the same neurological challenge — working memory under multi-step verbal demand.

**Primary users (school stage):** Autistic and ADHD students aged 8–18 at Arizona Autism Charter Schools (AZACS) and similar programs. These students sit in hands-on multi-step classes — cooking, robotics, drone building, coding, dance — where a teacher delivers one verbal instruction and three students at different reading levels must each act on it immediately. Many are AuDHD. Some are non-speaking and rely on pictures. The 1:3 staff ratio AZACS described means a teacher cannot stop to build three personalized visual supports mid-class.

**Secondary users (teachers):** Special education teachers who currently build picture schedules by hand on laminated cards the night before class. They need a tool that produces personalized visual supports *during* a live lesson, not before it.

**Adult-stage users:** Neurodivergent adults aged 18–30 in supported-living and first-employment programs like First Place AZ. Program director Josh Munoz described the pattern directly: residents who freeze or ask a manager to repeat an instruction twice are the ones who do not survive the probation period. Same working-memory failure mode, higher stakes.

**Influencers:** Parents (who read the daily AZACS parent journal and want continuity between school and home), school principals, and employment program coordinators who need visibility into resident progress without compromising resident ownership of their own data.

---

### 2. Summarize your problem.

Autistic and ADHD students lose track of multi-step verbal instructions in classrooms — not because they are not listening, but because working memory under task-load is the specific neurological failure point. A teacher at AZACS says "get your tray, wash your hands, measure two cups of flour, then wait for me" and three students follow step one correctly and then freeze.

Existing tools do not close this gap. Visual schedule apps (Goally, Choiceworks, Tiimo) require an adult to build every routine ahead of time — they cannot handle an instruction a teacher gives live. AI task-breakers (ChatGPT, Google Tasks) are text tools designed for one adult working alone. No existing product generates per-student picture step cards from a live spoken instruction in real time. That is the gap Step Cards fills.

The same failure pattern reappears at age 22. A neurodivergent adult at First Place AZ working their first retail shift receives a verbal closing instruction from a manager during the end-of-shift rush — "restock the concessions before the rush and tell Jake if cups are low" — and either freezes on both halves or asks the manager to repeat, which asking twice in a probation period is the exact behavior that ends the job. First Place director Josh Munoz confirmed directly that residents currently have no resident-owned way to track their own skill development. The problem spans a lifetime; the AI solution that addresses it must span the same arc.

---

### 3. Describe your solution.

Step Cards is a deployed TanStack Start web application at **https://nuero-challange.vercel.app/** that converts a live verbal instruction into per-student picture step cards in under three seconds. A teacher speaks the instruction into the Web Speech API; a server function sends the text to Groq's hosted Qwen 3 language model, which returns a JSON structure of ordered, 2-to-6-step routines (or multiple sibling routines if the instruction spans separate phases). A second parallel LLM pass rewrites each step for every student's reading level — grade 2, grade 4, grade 6, or pictogram-only. Each step keyword is matched to a free ARASAAC pictogram and rendered beside the words. The teacher approves in one tap. Cards appear on student devices (phones, tablets, Chromebooks) in real time via Supabase Realtime.

Students tap through steps one card at a time. A private "Help me" tap on any step signals the teacher without any public visibility to peers — the design decision we traced back to both AZACS and First Place AZ visits, where asking for help in front of others carries real social or professional risk. When a student finishes a routine, they pick a sticker from one of ten ARASAAC-powered sticker books (trains, dinosaurs, sea creatures, space, wild animals, pets, music, food, sports, vehicles). Across sessions a student's sticker book grows — a visible, non-competitive, never-taken-away record of progress.

Three evidence-based practices from the NCAEP 2020 review are implemented explicitly: Task Analysis, Visual Supports, and Prompting with Systematic Fading. Fading is live — after a student completes the same routine two or three times without tapping Help, the number of visible cards reduces toward a single summary card, teaching independence rather than building tool-dependence. Teachers see per-student progress and the actual stickers each student has earned in a new drill-down view.

The same engine serves the adult stage. A worker pastes or dictates a manager's instruction and receives numbered plain-language steps, ambiguous terms flagged with plain definitions, and one suggested clarifying question — so they can act confidently without asking the manager to repeat.

---

### 4. Which partners informed your design?

- **Arizona Autism Charter Schools (AZACS)** — primary school-stage partner. Site visit Oct 29. Faculty tour, classroom observation, direct conversation with teacher Maran about the 1:3 staffing ratio and daily multi-step instruction challenge.
- **First Place AZ** — adult-stage partner. Site visit Oct 27 and follow-up Zoom with program director Josh Munoz Oct 29. Confirmed the gap: no resident-owned skill tracking exists.
- **ARASAAC (Aragonese Centre of Augmentative and Alternative Communication)** — pictogram library provider. 35,000+ free symbols (Sergio Palao, CC BY-NC-SA). Enables the visual layer of every card.
- **ASU Spark Center / North America AI Challenge organizers** — challenge framework, mentors, launchpad infrastructure.

---

### 5. How did insights from our Challenge Partners inform your design?

**AZACS (October 29 site visit) directly shaped five design decisions:**

1. **Input is spoken, not typed.** In a live multi-step class a teacher cannot pause to type into an app. Web Speech API handles live capture.
2. **Cards go home.** AZACS sends a daily parent journal that every family reads. Step Cards exports the day's cards as a printable or shareable link that feeds that journal — extending school practice into the home. We built this because of what we saw, not what we assumed.
3. **Pictograms are mandatory, not optional.** The pictogram-only reading level exists because AZACS has non-speaking students whose primary language is images.
4. **Help is private.** Students at AZACS already manage anxiety; raising a hand to ask for help in front of peers carries real social cost. Help is one tap, visible only to the teacher.
5. **Fading, not persistence.** Teachers explicitly value independence over compliance. Cards fade as a student masters a routine, from four cards to two to one summary card.

**First Place AZ (October 27 visit, October 29 Zoom) shaped three decisions:**

1. **Resident-owned skill tracking.** Josh Munoz's exact phrasing — "if they had a way for them to track how much they're improving in certain skills, I would want that" — became the sticker book and shift log. Adults see their own growth in a form they own.
2. **No wearables, app-only.** First Place piloted an Amazon AWS wearable; residents rejected it universally for sensory discomfort. Step Cards is phone/tablet/laptop only — no hardware.
3. **Honest employment stat.** Our earlier materials claimed "50% of residents lose their jobs." Josh corrected this to "about half of our Be Open Be Ready graduates are employed." We updated every artifact.

The common insight that connected both partners was the parallel failure point: working memory under multi-step verbal demand, from age 8 to age 28. Step Cards is one engine, two modes, continuous from classroom to first job.

---

### 6. What role does AI play in your work?

AI is the mechanism without which the product cannot exist. Our pipeline uses three distinct LLM calls, all through Groq's hosted Qwen 3 model via the Vercel AI SDK.

1. **Instruction → structured routines (`CLASSROOM_PROMPT`).** The teacher's spoken instruction is converted into a JSON structure of 1–4 "parts," each with 2–6 ordered steps. The 2–6 cap is enforced in the prompt because it matches the NCAEP fading evidence base — more than 6 cards overloads working memory and defeats the fading practice. Long real-world routines (handwashing + flour measuring + mixing dough) are automatically split into sibling routines each within the limit.
2. **Base steps → per-student reading-level versions (`REWRITE_PROMPT`).** For each student in the class, one LLM call rewrites the step text to their calibrated reading level (grade 2, grade 4, grade 6, or pictogram-only — 1–2 words only). The icon keyword stays constant across levels so pictograms are consistent.
3. **Step keywords → ARASAAC pictograms.** Each step's `icon_keyword` is sent to the ARASAAC public API, which returns the best-matching free pictogram. The URL is cached on the card so students see the same image every session.

Every LLM output is schema-validated with Zod before it reaches the UI. The `/no_think` prefix disables Qwen3 chain-of-thought mode for speed; a dedicated extractor strips any `<think>` tags or markdown fences the model emits anyway. A `generateObject` compatibility shim forces the Groq-compatible `/v1/chat/completions` endpoint.

**Why AI is necessary here:** every existing visual schedule tool requires an adult to build the routine ahead of time. The gap Step Cards fills is unplanned, live instructions. Rule-based parsing cannot handle the variety of language a teacher actually uses, and templated step libraries cannot cover the open-ended routines of a hands-on cooking or robotics class. Only a language model generalizes to a brand-new instruction in real time, in a form that is simultaneously constrained enough for a 1st-grade reading level and flexible enough to handle "measure the flour and level the top with a knife."

---

### 7. What limits did you discover during this challenge, and how will you address them for future ideation?

**Web Speech API coverage.** The browser-native speech recognition works well in Chrome and Edge but fails in Firefox and misbehaves on some older Android devices. For the AZACS pilot we specify Chrome on the school's tablets and the UI displays a browser-support banner outside that constraint. Longer term: evaluate a server-side Whisper fallback and measure whether the cost per instruction justifies the device-coverage gain.

**ARASAAC keyword matching accuracy.** The current implementation matches ARASAAC pictograms by keyword from the step text. Concrete nouns ("tray", "flour", "kettle") hit the right symbol consistently; abstract or procedural words ("wait", "check", "prepare") often return a weak match or none. The fix is a curated fallback dictionary mapping the 50 most common classroom action words to hand-picked ARASAAC symbols — a one-day task we deferred from the MVP.

**Fading calibration.** The current fading threshold — reduce a card after 2 or 3 successful completions, pace adjustable per student — is a design-informed starting point, not a validated threshold. The AZACS pilot will test this directly. We expect the right threshold to vary by student and routine complexity, which has already shaped the UI: the fading pace is teacher-adjustable per student (gentle / standard / quick / off).

**AI output variance.** Smaller hosted models (Qwen 3) occasionally emit malformed JSON or combine two actions into a single step. We mitigate with strict Zod schema validation, response-only JSON instructions, and a post-processor that strips `<think>` tags and markdown fences before parsing. Even so, roughly 1 in 50 outputs needs the teacher's one-tap edit before approving. We treat this as acceptable because the teacher-review step is required anyway.

**Privacy requirements for real deployment.** The MVP uses made-up demo students. Any live deployment requires a COPPA review, a documented data-minimization policy (no student names, no diagnoses, no data except raw instruction text leaves the device to the LLM API), and explicit opt-in consent from families. Our responsible AI specification already lists these as prerequisites, not afterthoughts.

**Model availability and rate limiting.** Groq's free tier works well for a demo and small pilot but is not production-grade for a district rollout. The architecture is model-agnostic — the same prompts run against OpenAI, Anthropic, or any OpenAI-compatible endpoint — so the pilot can migrate between providers based on reliability, cost, and the eventual data-processing agreements a school district will require.

---

### 8. How did your team work collaboratively to complete the project?

Four people with clear ownership and daily sync:

- **Naman Dewan** owned the AI pipeline — all three LLM prompts, the Zod schemas, JSON extraction, Groq integration, and the prompt PDF.
- **Manan Batra** owned the user interfaces — the teacher view, the student card view, the student dashboard, the sticker book, and the demo recording.
- **Dipesh Gupta** owned research synthesis, the adult-mode specification, all three major written responses (executive summary, partner insights, future roadmap), the README, and the progress-report updates.
- **Anand Kumar** owned the 5-slide pitch deck, the Strategyzer BMC fillable PDF, and the live pitch script.

**How we worked:**

- **Daily progress reports.** Every work-day since Oct 26 we published a dated progress report in `19_PROGRESS_REPORTS.md` — ten reports in total. This gave everyone async visibility and surfaced blockers before they compounded.
- **Partner visits in pairs.** Dipesh visited First Place AZ. Naman visited AZACS. Each wrote a visit debrief within 24 hours (files 22 and 29). Both debriefs informed shared design decisions.
- **One repo, clear ownership boundaries.** `CLAUDE.md` at repo root specifies who owns which files, which commit identity each person uses, and the privacy rules that apply to all commits (no real student data, no API keys, no AI co-author lines).
- **Author attribution via GitHub noreply emails.** Each person's commits use their GitHub noreply address so contributions link to their profile for the Nov 7–9 code review.
- **Fact-check pass.** Every claim in the written responses was cross-checked against primary visit notes before submission. Three previously used claims (a "50% job loss" stat, an unverified retention figure, and an oversimplified "90-day coach cutoff") were corrected after Josh Munoz's exact wording was confirmed on the Oct 29 Zoom.
- **A revised build plan.** The original 5-day build was compressed to 3 content days plus two days of finalization and submission (file 38), so Tuesday Nov 4 is dedicated to testing against the exact device, browser, and network at the Launchpad.

---

### 9. What's next for this venture or team?

**December 2026 — February 2027: AZACS structured pilot.** One classroom, one teacher, six to eight weeks. We measure the number of steps each student completes independently per session compared to the pre-Step-Cards baseline. We also learn which card formats actually reduce confusion (pictogram-only vs. pictogram-plus-text vs. text-only), whether the fading threshold is right, and whether teacher-approval friction is tolerable or needs streamlining. The outcome is a published report usable by any school.

**Q1 2027: Home continuity.** The AZACS daily parent journal is already a cornerstone of school-home communication. Phase 2 upgrades the current printable export to a live shareable link parents open on their phone, plus a one-tap "practiced at home" checkbox that feeds back to the teacher as context.

**Q2 2027: Adult mode + First Place AZ Transition Academy integration.** The MVP already includes a working adult mode. Phase 3 deepens it with (a) a shift log that auto-assembles 30- and 90-day employment review summaries, (b) an accommodation navigator that converts a worker's description of their difficulty into a plain-language ADA accommodation request, and (c) direct Transition Academy curriculum integration so Step Cards is familiar before residents start real jobs.

**Q3 2027: Employer-facing training resources.** Over time, with aggregated anonymous data only, patterns emerge about which manager communication styles produce the most "Help me" taps and clarifying questions. That becomes a training resource for managers — a mirror, not surveillance.

**Scaling.** The path is not an app-store launch. It is one pilot, one published outcome, one conversation with the Arizona Department of Education Special Education division, and a replication guide any school can run without our team present. The addressable population — ~7,700 special-education teachers in Arizona alone, orders of magnitude more nationally — is large, and the same engine (translated via the LLM's multilingual capability) extends naturally to Spanish-speaking classrooms, which is common in Phoenix.

---

### 10. Why should your team win?

**Real partner research, not inferred need.** We visited two Phoenix-based challenge partners in person. Josh Munoz at First Place AZ gave us the exact product ask — "a way for residents to track how they're improving" — in his own words on Oct 29. Maran at AZACS confirmed the 1:3 staffing ratio and multi-step instruction challenge. Every design decision in Step Cards traces to a specific partner conversation documented in files 22 and 29 of our repository.

**A product grounded in verified evidence.** Step Cards implements four of the 28 NCAEP 2020 verified evidence-based practices for autistic children and youth: Task Analysis, Visual Supports, Prompting with Systematic Fading, and Technology-Aided Instruction. These are drawn from studies spanning 1990–2017 reviewed by UNC's Frank Porter Graham Child Development Institute. We did not invent an approach — we made a verified approach accessible in a form that did not exist before.

**A deployed, working product — not a prototype.** Step Cards is live at **https://nuero-challange.vercel.app/**. Any judge can log in with the one-tap demo access, see a real teacher dashboard, send live cards to simulated students, and open a student view on another tab or device. The AI pipeline runs on Groq, the backend on Supabase, pictograms stream from ARASAAC, and real-time updates propagate via Supabase Realtime. Every feature in the pitch is a feature a judge can touch.

**One engine, two life stages.** Most hackathon products target one user. Step Cards is a single AI engine spanning age 8 to age 28 — classroom at AZACS to first job at First Place AZ. The same prompts, the same card format, the same fading algorithm. This is not two products stitched together. It is one tool for a lifelong challenge.

**Honest about limits.** Our written responses document four specific technical limits (Web Speech coverage, pictogram keyword matching, fading calibration, AI output variance) and the exact fix path for each. The pilot is designed to test, not to confirm.

**Collaborative, documented, auditable.** Ten dated progress reports since Oct 26. Clear ownership boundaries. Commit attribution via each team member's GitHub noreply email. No AI co-author lines in commits. A `CLAUDE.md` policy file at the repo root that any reviewer can read in sixty seconds. The code review Nov 7–9 will find authentic team authorship, not model-generated boilerplate.

**A tool with a measurable mission.** If the AZACS pilot shows students complete more steps independently over six weeks, the evidence base for wider adoption already exists. If it does not, we learn why. Either way, the next step is defined.

---

### Final thoughts (optional)

Thank you to the AZACS faculty who gave us classroom time on Oct 29, to Josh Munoz for the follow-up Zoom and his candor about what residents actually need, to Sergio Palao and ARASAAC for the pictogram library that gives every student the picture half of the visual-support pairing, and to Arizona State University's Spark Center and the North America AI Challenge organizers for structuring a competition where the research mattered as much as the code. Our product exists because the partners told us what to build. We hope the next team gets the same gift.

---

*Compiled by Dipesh Gupta on behalf of Team Kaleidoscope. All claims verified against primary visit notes (files 22, 29) and the NCAEP 2020 report. All features described are present in the deployed Vercel build as of commit 5acedf2.*
