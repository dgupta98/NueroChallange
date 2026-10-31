# All Ideas Compared — What to Build, Who It Serves, What's Doable by Nov 5
**Author: Dipesh | Date: Oct 29**

> Three ideas emerged across the research. This file compares them honestly against both partners and the submission deadline, then lays out what Dipesh owns for the remaining 6 days.

---

## The Three Ideas

| | Idea A: Skill Milestone Tracker | Idea B: Post-Hire Retention Coach | Idea C: Step Cards |
|---|---|---|---|
| **Origin** | Dipesh, Oct 27 (Josh's direct ask) | Dipesh, Oct 27–28 (post-hire gap research) | Naman, Oct 29 (AZACS visit) |
| **Core mechanic** | Resident logs milestones, AI suggests next step | Situation Decoder + Accommodation Navigator + Review Prep + Post-Shift log | Spoken instruction → picture step cards per student, fades as mastered |
| **Primary partner served** | First Place AZ | First Place AZ | AZACS (school) + First Place AZ (adult mode) |
| **Covers both partners?** | No | No | **Yes** |
| **AI role** | Milestone pattern → next step suggestion | LLM interprets ambiguous workplace language | Speech-to-text → LLM breaks instruction → per-student rewrite → pictograms |
| **Buildable in 5 days?** | Moderate (needs DB, user history, AI logic) | Moderate (4 features, employer context) | **Yes — Naman scoped it day by day** |
| **Live demo quality** | A UI with logged milestones — not visually immediate | Type a message, get interpretation — good but text-heavy | Speak aloud → cards appear in seconds — **immediately striking** |
| **Evidence base** | Self-determination theory, Barkley, Singapore LLM study | NCAEP scoping review, covert audio coaching, Georgia Tech NSF | **NCAEP 2020 (4 of 28 verified EBPs)** — verified, named, citable |
| **"Not a generic focus app" test** | Passes (AI progression logic) | Passes (situation-specific LLM) | **Strongly passes** (live instructions + fading — no competitor does this) |

---

## Honest Verdict: Step Cards Wins as the Submission

Not because the original ideas were wrong — the research behind them is excellent and it feeds directly into Step Cards. Step Cards wins because:

**1. It covers both partners.** The rubric rewards partner research. Idea A and B only serve First Place. Step Cards serves AZACS as the primary demo and First Place as the adult stage. One submission, two partners, one engine.

**2. The demo is immediately legible.** A judge who doesn't know the space watches someone speak a sentence and sees picture cards appear for three different students in seconds. They understand the product before anyone explains it. Idea A's demo (a logged milestone list) requires explanation. Step Cards explains itself.

**3. It's the most buildable.** Naman scoped it day-by-day. The core is a web app + Web Speech API + one LLM call + ARASAAC pictogram API. That's 2 days of core work. The remaining 3 days polish, add the adult mode, and produce the deliverables. Ideas A and B need a database, user profile system, history tracking, and multiple LLM features — more scope for 5 days.

**4. The original research is not wasted — it becomes the adult stage and the roadmap.** Everything in files 23–28 (post-hire gap, 10 mechanisms, accommodation navigator, situation decoder) lives in the Step Cards adult mode and in the "What's Next" slide. Jordan at AMC is slide 5.

---

## How the Ideas Map Together as One Product

```
STEP CARDS SCHOOL (AZACS)          STEP CARDS ADULT (First Place + Work)
─────────────────────────          ──────────────────────────────────────
Teacher speaks instruction    →    Manager gives verbal instruction
AI breaks into step cards     →    AI breaks into clear action steps
Per-student reading level     →    Plain language, no jargon
"Help me" button (private)    →    "I don't understand" → clarifying Q suggested
Fades as student masters it   →    Fades as worker gains confidence
Cards go home via journal     →    Post-shift log captures what happened
                                   Accommodation navigator (ADA rights)
                                   Review prep coach (90-day cliff)
```

Same engine. School → home → First Place → first job. One continuous human story from Leo (age 12 at AZACS) to Jordan (age 22 at AMC).

---

## What Each Partner Needs and How Step Cards Serves It

### AZACS
| Need | How Step Cards Addresses It |
|---|---|
| Multi-step instruction support | Core feature — this is what it was designed for |
| Live, unplanned instructions | Only product in the market that handles this |
| Per-student differentiation (1:3 ratio) | AI generates 3 versions from 1 instruction |
| Parent journal continuity | Cards export to the journal — feed it, don't replace it |
| Hands-on doing (cooking, robotics, drone) | Cards are for doing, not reading |
| Non-speaking students | Pictogram-first cards (ARASAAC) |
| Shame-free help-seeking | "Help me" is private, never public |

### First Place AZ
| Need | How Step Cards (Adult Mode) Addresses It |
|---|---|
| Josh's direct ask: skill tracker | Adult mode adds a milestone layer — "you've completed this routine 5 times without help" IS a milestone |
| Post-hire instruction decoding | Jordan scenario = same engine, manager's verbal instruction → clear steps + clarifying question |
| Accommodation navigation | Adult mode feature: "I struggle with verbal instructions" → ADA right + draft request |
| Review prep | Adult mode feature: 90-day review → what to expect + preparation steps |
| Post-shift processing | Adult mode feature: post-shift log → what was hard → what to do |
| AuDHD design (Josh confirmed) | All 10 mechanisms (files 27–28) inform both school and adult stage design |

---

## 6-Day Build Reality Check (Nov 1–5, submit by 11:59 PM MT)

| Day | What must exist by end of day | Who |
|---|---|---|
| **Sat Nov 1** | Repo set up. Speech → AI steps working end to end (raw JSON output). | Naman |
| **Sun Nov 2** | Student card view + teacher approval view + pictograms rendering. | Manan + Naman |
| **Mon Nov 3** | Per-student versions + fading rule + adult/work mode working. | Naman + Dipesh |
| **Tue Nov 4** | Polish + accessibility pass + pre-recorded backup demo + slides draft + BMC draft. | All |
| **Wed Nov 5 (SUBMISSION DAY)** | Written responses (exec summary, partner insights, roadmap) + prompt PDF + README + final slides + submit before 11:59 PM MT. | Dipesh + Anand |

**The critical path is the AI pipeline (Naman) and the demo recording (Manan).** If those two are solid by end of Nov 3, everything else is assembling deliverables.

---

## Dipesh's 6-Day Ownership

Per Naman's role split: research write-up, adult/work stage, executive summary, roadmap.

| Day | Dipesh's specific task | Output |
|---|---|---|
| **Nov 1** | Finalize adult mode feature spec (what exactly happens when Jordan pastes his manager's message) — 1 page, clear enough for Naman to build | File 35 or direct doc |
| **Nov 2** | Write the partner research insights section (written response deliverable) — both AZACS and First Place | Draft text for submission form |
| **Nov 3** | Write the executive summary (written response deliverable) + review adult mode as Naman builds it | Draft text for submission form |
| **Nov 4** | Write the future roadmap (written response deliverable) + do a full fact-check pass on all claims in slides and responses | Clean, sourced text |
| **Nov 5** | Final assembly: written responses → submission form. README in repo. Check every URL opens without login. Submit. | Submitted |

Everything in files 23–28 feeds these deliverables. The post-hire gap research (file 25), solution research (file 26), mechanisms map (file 27), and deep mechanisms research (file 28) are the source material for the partner insights section and the roadmap.

---

## Fact-Check — Claims to Fix Before Any Deliverable Uses Them

Flagged by Naman in file 33. Do not use these until resolved:

| Claim | Problem | Fix |
|---|---|---|
| "50% of residents lose their jobs" | Josh said "about half are **employed**" — not the same | Use: "About half of Be Open Be Ready graduates are employed" |
| "SAP has 92% retention" | No primary source found | Drop entirely from all materials |
| "Job coaches leave at day 90" | Arizona DES moves to extended services — not a hard exit | Use: "Government job coaching typically ends after the probationary period" — or verify AZ DES specifics |
| Georgia Tech NSF grant, PMC9838300, Zhou/Kim 2025, Bennett 2010, Cureus 2025 | Not independently verified | Dipesh to verify each before they appear in written responses |

---

## About Managing Daily Progress Reports for the Team

**Short answer: manage the logistics, not the content.**

The competition expects real task completions per person per day. This means:
- Judges and organizers want to see that each person contributed distinct, real work
- During the Nov 7–9 code review, Manan and Naman will need to explain the code they wrote — if Dipesh wrote their reports, that creates a disconnect

**What Dipesh CAN do:**
- Create a shared doc or Discord thread where each person drops 3 sentences each evening (what I built/wrote, what I tested, what's next for me)
- Compile those 3 sentences into the Airtable form with consistent formatting
- Write the team-level summary section
- Track that everyone submitted — nudge anyone who hasn't

**What each person must own:**
- Naman: what prompt was written, what the AI returned, what changed in the pipeline
- Manan: what screen was built, what interaction was implemented, what was tested
- Anand: what slide section was drafted, what BMC cell was filled, what pitch script line was written
- Dipesh: what was researched/written, what adult mode feature was specified, what deliverable text was drafted

**Daily format (5 minutes per person):**

> **[Name] — [Date]**
> **Done today:** [1–2 sentences of real, specific work]
> **Tested/verified:** [what you confirmed works or is correct]
> **Tomorrow:** [1 sentence on next task]

If everyone drops this in a shared place by 9 PM each evening, Dipesh can compile and submit in 10 minutes. That's manageable.
