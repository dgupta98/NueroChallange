# Future Roadmap — Submission Text
**Author: Dipesh | Date: Oct 31, 2026**
**Deliverable:** Written Response 3 of 3 — paste directly into Airtable submission form

> All claims verified. No fact-check-flagged items used.

---

## SUBMISSION TEXT — COPY THIS INTO THE FORM

---

**Future Roadmap**

Step Cards is complete enough to demonstrate its core value — a teacher speaks, three students get personalized step cards, and the system fades support as they master routines. The path from here is not about adding complexity. It is about measuring what works, expanding to the settings that need it most, and removing the remaining friction points that only become visible once real users touch it.

---

**Immediate next step: a structured pilot at AZACS (December 2026 – February 2027)**

The single most important thing we can do after submission is put Step Cards in front of one AZACS teacher and her class for six to eight weeks. Not a polished product study — an honest trial. We would ask the teacher to use it for two or three multi-step activities per week: cooking, robotics assembly, or drone component work. We would measure one thing: how many steps does each student complete independently versus with staff prompting, compared to the same activities before Step Cards? AZACS's existing 1:3 staffing ratio and daily parent journal give us a natural baseline and a communication channel that is already in use.

What we expect to learn: which card formats actually reduce confusion (pictogram-only vs. pictogram-plus-text vs. text-only), whether the fading threshold we set (two successful completions before a card is removed) is too fast or too slow for this population, and whether the teacher approval step is useful or a friction point that teachers skip. We cannot answer these questions with made-up data. We need the real sessions.

Target metric for the pilot: percentage of steps completed independently by each student, tracked per session over six weeks. If that number improves, we have evidence. If it does not, we need to understand why before scaling.

---

**Phase 2: Home continuity and parent engagement (Q1 2027)**

The AZACS visit confirmed that the daily parent journal is a cornerstone of the school-home relationship. Parents check it every day. The current MVP exports the day's cards as a printable summary — Phase 2 makes this a live shareable link sent at end of day. Parents open it on their phone, see the steps Leo used in cooking class, and can practice the same routine at home that evening using the same card format. This addresses the generalization gap that research consistently identifies: skills taught in one setting do not transfer automatically to another. The app becomes the bridge.

This phase also adds a parent-facing "practiced at home" checkbox — one tap per routine, no setup. That feeds back to the teacher as context ("Leo practiced measuring at home twice this week") without requiring any data entry from the family.

---

**Phase 3: Adult mode and first-employment support (Q2 2027)**

The MVP already includes a working adult mode for Jordan's scenario — a spoken or typed workplace instruction becomes numbered steps, ambiguous terms are flagged with plain definitions, and a suggested clarifying question is offered. Phase 3 deepens this with three additions:

1. **Shift log becomes review preparation.** Every completed instruction is timestamped and stored privately. Before a 30-day or 90-day employment review, the worker opens a summary view: "You independently completed 47 work instructions across 18 shifts." That summary does not require writing or remembering — it assembled itself. This directly addresses the gap Josh Munoz identified: residents currently have no resident-owned record of their own progress.

2. **Accommodation navigator.** A worker who struggles with verbal-only instructions and wants to request a written alternative has a legal right to do so under the ADA. Most workers do not know this, and even those who do often cannot frame the request professionally under pressure. The navigator turns a description of the difficulty ("my manager gives all instructions verbally and I lose track of them") into a plain-language accommodation request the worker can send or say.

3. **First Place AZ partnership.** We would work with Josh Munoz to integrate Step Cards adult mode into the Transition Academy's "Be Open Be Ready" employment curriculum — using it in mock work scenarios before residents start jobs, so the tool is familiar before the stakes are real.

---

**Phase 4: Employer-side tools (Q3 2027)**

Every workplace instruction that gets broken down in Step Cards reveals something about how managers communicate. Over time, with appropriate privacy protections and aggregate data only, patterns emerge: which types of instructions consistently generate "Help me" requests, which ambiguous terms appear most often in a given industry, what instruction styles produce the fewest clarifying questions. This becomes a training resource for managers — not as surveillance, but as a mirror. "Instructions with more than four steps and implicit context words like 'before the rush' or 'when it's ready' generate the most confusion." That insight costs employers nothing and prevents a disproportionate share of the failures that end neurodivergent workers' first jobs.

Josh Munoz framed this directly during our October 29 Zoom: "We've developed an entire work ecosystem that is relying on the neurotypical brain. How many people are we losing in our work environments because we haven't created even the simplest accommodations?" Step Cards gives employers one of those simplest accommodations — and eventually, evidence of its impact.

---

**Limitations we discovered during prototyping and how we plan to address them**

**Web Speech API browser support.** The browser-native speech recognition API works well in Chrome and Edge but is not supported in Firefox and has inconsistent behavior on some older Android devices. For the pilot, we will specify Chrome on school tablets and document this limitation clearly. A longer-term fix is offering a typed input fallback (already built) and evaluating whether a server-side speech-to-text alternative (Whisper API) is worth the cost for wider device coverage.

**ARASAAC pictogram matching.** The current implementation searches ARASAAC's public API by keyword from the step text. This works well for concrete nouns ("tray," "flour," "kettle") but returns poor results for abstract or procedural words ("wait," "check," "prepare"). The fix is a curated fallback library of the 50 most common classroom action words, each manually matched to the best ARASAAC symbol, stored locally. This is a one-day task we deferred from the MVP.

**Fading calibration.** The current fading rule — remove one card after two successful completions of a routine — is a starting assumption, not a validated threshold. The AZACS pilot will test this directly. We expect the right threshold to vary by student and by routine complexity, which suggests the eventual product needs a teacher-adjustable fading rate, not a fixed one.

**No real student data.** The MVP uses made-up student profiles. Before any real deployment, the app needs a privacy review for COPPA compliance, a clear data minimization policy (no names, no diagnoses, no data leaves the device except to the speech API and LLM API), and explicit opt-in consent from schools and families. We have documented these requirements in our responsible AI specification and will treat them as prerequisites for any live pilot, not afterthoughts.

---

**Scaling path**

The addressable population is large. There are approximately 7,700 special education teachers in Arizona alone, and the multi-step verbal instruction challenge is not specific to autism — it is shared by students with ADHD, dyslexia, language processing differences, and English language learners. Step Cards as built already works for any student who benefits from broken-down visual steps. The same engine, extended to Spanish and other languages via the LLM's multilingual capability, serves classrooms where English is not the primary language at home — which is common in Phoenix-area schools.

The path to scale is not an app store launch. It is one AZACS pilot, one published outcome, one conversation with the Arizona Department of Education's Special Education office, and a replication guide that lets another school run the same pilot without our team present. If the pilot metric holds — students complete more steps independently over six weeks — the evidence base for wider adoption already exists in the NCAEP 2020 report. We are not inventing a new approach. We are making a verified approach accessible in a form that did not exist before.

---

*Roadmap authored by Dipesh Gupta. Evidence base in files 27–28 and 31 of team repository.*
