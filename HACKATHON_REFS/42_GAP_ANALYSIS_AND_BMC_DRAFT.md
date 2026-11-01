# Gap Analysis, Code Review Readiness + BMC Draft
**Author: Dipesh | Date: Oct 31, 2026**
**Read this on Nov 1 morning as a team. It is an honest status report, not a celebration.**

---

## STATUS: WHERE WE ACTUALLY STAND

### What is genuinely complete
- All three written submission responses (files 37, 38, 39) — paste-ready
- Adult mode feature spec (file 36) — Naman can build from it Nov 1
- Complete technical build documentation (files 40, 41) — stack, prompts, schemas, patterns
- Visual design and accessibility spec (file 35) — Manan can build from it Nov 1
- CLAUDE.md — git rules, team emails, build rules, commit patterns
- Research and evidence base (files 22–35) — strongest part of the entire submission
- HACKATHON_REFS documentation — 40+ files, evidence-backed, sourced

### What does not exist yet (as of Oct 31)
| Item | Owner | Must exist by |
|---|---|---|
| **The actual app** (any code at all) | Naman + Maman | Nov 3 end of day |
| **Slides** (5-slide required template) | Anand | Nov 3 end of day — LOCK after |
| **Business Model Canvas** | Anand | Nov 3 (upload before Launchpad) |
| **Pre-recorded demo video** | Maman | Nov 3 end of day |
| **Prompt PDF** | Naman | Nov 4 |
| **README in repo** | Dipesh | Nov 3 |
| **`.gitignore` with .env** | Naman (Nov 1) | Before first commit with keys |

---

## TECHNICAL CODE REVIEW — HONEST CHECKLIST

The review happens Nov 7–9. These are the 10 items reviewers check. Status as of Oct 31:

### Section 1 — Repository: Authentic, collaborative, iterative

**Item 1.1: Commits reflect meaningful iteration rather than unexplained bulk additions**
- **Current status: RISK.**
- The repo has 37 commits — all research documentation, all from Dipesh.
- When Naman and Maman build Nov 1–3, they must commit incrementally (small, named commits, multiple per day), not push everything in one bulk commit on Nov 3 night.
- **Action (Naman + Maman):** Commit after every working feature, not after the whole feature set. Commit after every prompt version that changes behavior. Commit after every screen. Reviewers look at commit history to confirm work happened over days, not hours.

**Item 1.2: Repository shows evidence of team collaboration**
- **Current status: FAILING.**
- Every commit in the repo is authored by Dipesh Gupta.
- Code review will ask: where are Naman's commits? Where are Maman's commits?
- **Action (Nov 1, immediate):** When Naman pushes his first pipeline code, he must commit using his own identity (`git config user.name "Naman Dewan"` and `git config user.email "ndewan1@asu.edu"` on his machine). Maman does the same. Dipesh uses `--author=` when committing on their behalf only.
- **Action (Anand):** Even slides-as-file won't be in the repo, but Anand can commit the BMC summary as a `.md` file with his own author identity.

**Item 1.3: Repository history aligns with the final project**
- **Current status: WILL PASS** — if the code that gets built matches what's in files 36, 40, 41.
- Risk: scope creep or late pivots that aren't reflected in documentation. Don't build features not in the spec without updating the docs.

---

### Section 2 — Code: Purposeful, original, understood by team

**Item 2.1: Code logically structured, relevant, minimal unused/placeholder code**
- **Current status: N/A (no code yet).**
- When writing: follow the directory structure in file 40, section 1. No `test.js` files left in, no `TODO` comments in production code, no commented-out dead code blocks.

**Item 2.2: Technical decisions demonstrate intentional development**
- **Current status: READY to demonstrate** — file 41 Part 2 has a validated decision table with literature citations for every major choice.
- When code reviewers ask "why did you use localStorage instead of a backend?" → the answer is in file 41, and the README will point to it.

**Item 2.3: Team members can explain key sections of their code**
- **Current status: RISK — biggest risk in the entire review.**
- If Naman or Maman use Cursor/Copilot/Claude to generate large code blocks and don't understand them, this fails hard. The review will ask each person to explain their code live.
- **Rule:** Every AI-generated function gets the comment `// AI-generated — reviewed and tested by [name]`. This is in CLAUDE.md. Follow it.
- **Naman must own and understand:** the LLM API calls, the prompt structure, the JSON parsing, the ARASAAC pipeline, the fading algorithm.
- **Maman must own and understand:** the component structure, the tap interaction state, the teacher/student view rendering, the localStorage hooks.

**Item 2.4: No substantial unexplained reuse from prior projects or public repositories**
- **Current status: WILL PASS** — this is new work. Any open-source libraries (Radix UI, Tailwind) are standard dependencies, not copied code. Standard imports are fine. Copied functions from Stack Overflow must have a comment with the source URL.

---

### Section 3 — Documentation: Clear, transparent, AI-attributed

**Item 3.1: Documentation clearly explains the project, its functionality, and how to use it**
- **Current status: MISSING — the README hasn't been written yet.**
- Dipesh writes this Nov 3. Contents specified in file 40, section 13.
- Must include: what it is, how to run locally, what's in .env, tech stack, AI use, attribution, browser requirements.

**Item 3.2: Setup, dependencies, and technical requirements documented**
- **Current status: MISSING — only exists in HACKATHON_REFS/40, not in a user-facing README.**
- Will be covered when Dipesh writes the README Nov 3.

**Item 3.3: Language is clear, concise, and specific to the project**
- **Current status: WILL PASS** — once README is written. All existing docs are clear.

**Item 3.4: External/AI assistance appropriately disclosed**
- **Current status: PARTIALLY READY.**
- CLAUDE.md has the rule (`// AI-generated — reviewed and tested by [name]`).
- The prompt PDF (Naman, Nov 4) must document that LLM prompts were designed with AI assistance and verified by the team.
- README must note: "AI tools (Claude Code) were used for research documentation and prompt design. All code was written by team members and reviewed before committing."

---

### Section 4 — Codebase alignment with demo + security

**Item 4.1: Submitted code aligns with functionality shown in demo**
- **Current status: WILL PASS** — if demo path matches file 36 (adult mode) and file 40 (school mode). Don't demo features that aren't in the code.

**Item 4.2: Design and UX reflect consideration of the intended user**
- **Current status: WILL PASS** — file 35 and 41 document the autism/ADHD UX decisions. Reviewers will see these in the code as CSS tokens and component choices.

**Item 4.3: No exposed API keys, secrets, or private data committed**
- **Current status: NOT YET TESTED — .gitignore doesn't exist yet because there's no code.**
- **Action (Naman, Nov 1 first thing):** Create `.gitignore` before creating `.env`. Never add .env before it's ignored.
- Run `git log --all -p | grep -i "sk-"` before submission to confirm no key was ever committed.

---

## RUBRIC GAP ANALYSIS — 10 CRITERIA

| Criterion | Our strength | Current gap | Risk level |
|---|---|---|---|
| **MVP Development** | Strong spec, clear scope | **NO CODE EXISTS** | 🔴 Critical |
| **User-Centered Problem** | Two partner visits, named personas, working memory research | Nothing missing | 🟢 Strong |
| **Impact & Inclusivity** | NCAEP 4 EBPs, WCAG, shame-free design, COPPA | Needs to show in app UX, not just docs | 🟡 Medium |
| **Functionality** | Full demo path documented | **DEPENDS ON BUILD** | 🔴 Critical |
| **Collaboration** | Clear role split | **Only Dipesh has committed anything** | 🔴 Critical |
| **Principled Innovation** | File 32 covers all 6 responsible AI questions | Needs teacher approval working in demo | 🟡 Medium |
| **Creativity & Vision** | Live instruction handling + fading = no competitor | Needs demo to land | 🟡 Medium |
| **Tools & Techniques** | Stack justified in file 41, literature-validated | Code review Nov 7–9 is the gate | 🟡 Medium |
| **Pitch Storytelling** | Story arc documented (Leo → Jordan) | **SLIDES NOT STARTED** | 🔴 Critical |
| **Growth & Scalability** | File 39 roadmap complete | Nothing missing (roadmap is written) | 🟢 Strong |

**Three criteria are at critical risk and all three have the same root cause: the build hasn't started.**
Fix the build → fixes MVP Development, Functionality, and (partially) Collaboration in one move.

---

## WHAT NEEDS TO HAPPEN NOV 1 MORNING, IN ORDER

1. **Naman:** `git clone`, create `.gitignore` (include `.env`, `node_modules/`), run `npm create vite@latest`, commit "Scaffold React app" — **before writing a single line of feature code.** First commit proves the repo had a real setup process.

2. **Naman:** Set git identity: `git config user.name "Naman Dewan"` and `git config user.email "ndewan1@asu.edu"`. Confirm with `git config --list`.

3. **Maman:** Same identity setup on his machine before his first commit.

4. **Anand:** Download `REQUIRED - NA AI Challenge 5 Slide Template (Final).pptx` from the presenter packet. Open it today. Put the team names and title on slide 1 before doing anything else. This is the template you cannot modify — lock in the structure first.

5. **Anand:** Open the BMC fillable PDF or the docx example. Fill in what you know today (Value Proposition, Customer Segments, Key Partnerships) — leave Revenue Streams for when you've seen the app.

---

## BUSINESS MODEL CANVAS — DRAFT (Anand fills this in)

This is the content. Anand puts it in the Strategyzer template from the presenter packet.

### Value Propositions
Turn any spoken classroom instruction into personalized picture step cards for each autistic student — in seconds, live, without setup. Support fades as the student masters the routine. Same engine extends to a worker's first job.

### Customer Segments
**Primary (school stage):** Special education teachers at autism schools (AZACS and similar). They have 3 students with different reading levels, 45-minute classes, and zero time to build visual supports on the fly.

**Secondary (adult stage):** Neurodivergent adults transitioning to first employment (First Place AZ residents and similar). They lose track of multi-step verbal instructions from managers.

**Influencers:** Parents (see the daily parent journal integration), school administrators, employment program coordinators (Josh Munoz equivalent).

### Key Partners
- **AZACS** — pilot site, real classroom validation
- **First Place AZ** — adult stage validation, employment context
- **ARASAAC** — 35,000+ free AAC pictograms (CC BY-NC-SA)
- **Google** — Web Speech API (free, browser built-in)
- **OpenAI / Anthropic** — LLM API for instruction breaking and rewriting

### Key Activities
- LLM-powered instruction breakdown (3 API calls per interaction)
- Per-student reading level adaptation
- ARASAAC pictogram matching
- Teacher approval workflow
- Fading algorithm (reduces support as mastery develops)
- "Cards go home" export to parent journal

### Key Resources
- AI API access and prompting expertise
- AZACS partnership for pilot access
- ARASAAC free pictogram library
- Open-source stack (React, Radix UI, Tailwind, Web Speech API)
- Evidence base: NCAEP 2020 (4 verified EBPs)

### Channels
- **Phase 1:** Direct pilot at AZACS (teacher → principal → district)
- **Phase 2:** Arizona Department of Education Special Ed division
- **Phase 3:** First Place AZ employment curriculum integration
- **Phase 4:** National special education teacher networks (CEC, ASHA)

### Customer Relationships
- **Pilot relationship:** Embed in one AZACS class for 6–8 weeks, measure, publish outcome
- **School adoption:** Teacher-facing setup guide + principal briefing
- **Adult/employer:** First Place AZ Transition Academy integration

### Revenue Streams
*(For demo stage — we are pre-revenue. This section projects post-pilot.)*
- **School district SaaS licensing:** Per-teacher or per-school annual license (~$200–500/year per teacher, after free pilot)
- **Grant funding:** IDEA (Individuals with Disabilities Education Act), NSF, autism foundation grants — non-commercial prototype can qualify
- **Employer accessibility programs:** Phase 4, employer-side tools for manager communication training

### Cost Structure
- LLM API costs: ~$0.001–0.003 per instruction breakdown (gpt-4o-mini pricing). At 50 uses/day = ~$0.15/day.
- ARASAAC: Free
- Hosting: Free (Vercel free tier for static React app)
- Development: Team time only during hackathon phase

---

## SLIDES — CONTENT BRIEF FOR ANAND

Use the required 5-slide template. Do not change fonts, colors, or layout.

**Slide 1 — Title**
- Name: **Step Cards**
- Team: Anand Kumar, Dipesh Gupta, Manan Batra, Naman Dewan (alphabetical)
- Launchpad: Scottsdale Launchpad at SkySong Innovations
- University: ASU logo (use the placeholder provided)
- Date: November 6, 2026

**Slide 2 — Target User**
Two personas, two settings:
- **Leo, 12** — AZACS student, ADHD + autism, reads at 2nd-grade level. Cooking class: follows step 1, freezes by step 3. Staff redirect him, which frustrates him. He's not distracted — he's lost.
- **Jordan, 22** — First Place AZ resident, starting at AMC. Manager gives multi-step closing instructions in a loud lobby. Jordan can't ask for a repeat without looking incompetent. He needs a private tool.
- One sentence connecting them: "Same neurological challenge — working memory failure under multi-step verbal demand — at 12 and at 22."

**Slide 3 — Problem**
The executive function problem: working memory.
- When working memory is overloaded, students and workers lose track of multi-step instructions — not because they weren't listening, but because holding 4 sequential steps while beginning a physical task exceeds reliable neurological capacity.
- Current tools fail: visual schedule apps require an adult to build every routine ahead of time. No app handles a live spoken instruction.
- One stat (verified): 1 in 36 children is now diagnosed with autism (CDC 2023). 803,000 students receive special ed services under IDEA.

**Slide 4 — Solution + Demo**
Step 1: Teacher speaks. Step 2: Three student versions appear. Step 3: Teacher approves. Step 4: Leo taps through his cards. Step 5: "Help me" → private signal to teacher. Step 6: All done → quiet completion. Step 7: Switch to Jordan → paste instruction → steps + ambiguous terms + clarifying question.

Close: "Same engine. Classroom to first job."

**Slide 5 — What's Next**
- Pilot: 6–8 weeks in one AZACS class. Measure steps completed independently, before vs. after.
- Metric: % steps completed without staff prompting
- Phase 2: Cards go home via parent journal integration
- Phase 3: First Place AZ Transition Academy adult mode integration
- Scale: Same engine works for any ELL student, any student who benefits from broken-down visual steps. Every classroom has instructions.

---

## SUBMISSION FORM LINKS (from the presenter packet doc)

- **Daily Progress Report:** https://airtable.com/appTfuhA8WpKrD1wx/pagQohin8pl37QuiG/form
- **Final Submission Form:** https://airtable.com/appTfuhA8WpKrD1wx/pagTpVvYmB7dZkGfz/form
- **Team Form (already done):** https://airtable.com/appTfuhA8WpKrD1wx/pag7Jvgggday92fHD/form

If daily progress reports haven't been filed every day since Oct 24, file them retroactively with accurate dates. The form exists for the organizers to track participation — gap days look bad.

---

## WHAT PASSES CLEAN TODAY vs. WHAT NEEDS WORK

### Passes clean (evidence exists, documented, sourced)
- User-Centered Problem: two visits, named personas, EF research
- Impact & Inclusivity: 4 NCAEP EBPs, shame-free design, accessibility spec
- Principled Innovation: file 32 covers all 6 responsible AI questions
- Growth & Scalability: file 39 roadmap with phases, metrics, scaling path
- Written responses: all three complete

### Needs work before Nov 5
| Gap | Owner | Deadline |
|---|---|---|
| App exists and works end to end | Naman + Maman | Nov 3 |
| Collaboration visible in git history | Naman + Maman (own commits) | Nov 1 first commit |
| Slides in required template | Anand | Nov 3 |
| BMC filled in Strategyzer template | Anand | Nov 3 |
| Pre-recorded demo video | Maman | Nov 3 |
| Prompt PDF (proper PDF, organized) | Naman | Nov 4 |
| README in repo | Dipesh | Nov 3 |
| .gitignore before .env | Naman | Nov 1, FIRST THING |
| AI attribution comments in code | Everyone who writes code | Throughout |
| Incremental commits (not bulk) | Naman + Maman | Throughout build |
| Daily progress reports filed | Dipesh compiles, all contribute | Every day |
