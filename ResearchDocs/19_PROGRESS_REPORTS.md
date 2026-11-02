# Daily Progress Reports — Team Kaleidoscope

---

## Oct 26 — Report 1: First Site Visit Update

**Report type:** Visitation update / team sync

---

**Problem description & target user**
Target users are autistic adults and individuals with I/DD living at First Place AZ — a high-standard supported residential community in central Phoenix. First site visit today confirmed the core resident need: **feeling genuinely included and engaged within their community**. The building has smart home infrastructure already in place (e.g., stove-on duration alerts, environmental monitoring). Spaces include individual furnished apartments, shared game rooms with TV/PlayStation, and common areas. The challenge is not the physical environment — it is meaningful social and community engagement within it.

**Solution description**
Exploring AI-powered engagement or community tools for First Place AZ residents — specific direction to be confirmed after second site visit tomorrow.

**AI use**
To be defined post-research. Candidates emerging: AI-driven engagement prompts, activity recommendation based on resident preferences, or smart-system integration layer.

**Data use**
Primary: physical space observation from today's site visit (smart systems, room types, resident environment). Secondary: First Place AZ materials — Be Open Be Ready curriculum data, 85% employment/volunteering rate, 360 Health & Wellness program, Peace of Mind Portfolio framework.

**Breakthroughs**
First team site visit completed at First Place AZ. Key insight confirmed in person: residents have high-quality living infrastructure but the gap is **inclusion and engagement** — belonging to a community, not just residing in a building. Smart home systems are already embedded in the building (environmental alerts etc.), which opens a potential integration angle. Photos of interior spaces captured. Second visit scheduled tomorrow for deeper research.

**Blockers**
None. Second visit tomorrow will allow deeper conversation on specific engagement gaps and resident needs before locking solution direction.

---

## Oct 26 — Report 2: Research & Tomorrow's Visit Prep

**Report type:** PM research update / visit preparation

---

**Problem description & target user**
Refining focus to First Place AZ adult residents. Post-visit research underway on three emerging angles: (1) community engagement and social belonging tools, (2) resident-facing apps tied to employment support or benefits navigation, (3) smart building data as an input layer for resident independence and safety. Tomorrow's visit will validate which of these the partner sees as highest priority.

**Solution description**
AI tool to increase inclusion and engagement for neurodiverse adults in supported residential living — validating specific use case tomorrow.

**AI use**
Researching how AI can surface personalized engagement opportunities, reduce friction in community participation, or augment existing smart building systems to support resident independence without being intrusive.

**Data use**
Reviewing: First Place AZ program structure (Transition Academy, GLI, Be Open Be Ready), existing smart home infrastructure observed on-site, employment outcome stats, isolation/loneliness research in autistic adults. Building interview questions for tomorrow's visit around engagement gaps, resident feedback mechanisms, and what tools staff currently use.

**Breakthroughs**
Research today confirms that the resident experience gap is social/emotional — not physical infrastructure. First Place already has a high-quality built environment and smart systems. The white space is in **how residents connect with each other, engage with the community, and navigate the transition from structured support to self-directed life**. This narrows the solution space significantly. Tomorrow's visit will be structured around validating this and getting specific resident stories.

**Blockers**
Need tomorrow's visit to complete before committing to a solution direction. Preparing structured interview questions tonight focused on: current engagement tools or lack thereof, what residents ask for most, where staff see the biggest unmet needs, and whether a resident-facing app exists or has been tried before.

---

## Tomorrow's Visit — Key Questions to Answer (Oct 27)

1. What do residents currently do when they want to connect with other residents — is there a system or is it informal/random?
2. Has First Place tried any app-based engagement tools before? What happened?
3. What does a "disengaged" resident look like — what signals do staff notice?

---

<!-- Add new progress reports below this line -->

---

## Oct 31 — Report 8: Full App Build + BMC + Repo Structure (All Members)

**Report type:** Build day / deliverables sprint
**Submitted for:** Dipesh Gupta, Naman Dewan, Manan Batra, Anand Kumar

---

**Problem description & target user**
Autistic and ADHD students (ages 8–18) at AZACS who lose track of multi-step spoken classroom instructions because working memory fails under task load — not because they weren't paying attention. The same neurological failure point follows them into supported living and first employment. Target users at the work stage: neurodivergent adults (18–30) at First Place AZ and similar programs who receive verbal instructions from managers in noisy, time-pressured environments and either freeze or ask to repeat — and asking twice is what gets someone dismissed.

**Solution description**
Step Cards: a React web app (Chrome, no install required) with two modes. School mode: teacher speaks any instruction → LLM breaks it into 2–6 ordered steps → second LLM pass rewrites each step for each student's reading level (pictogram-only, grade 2, grade 4, grade 6) with ARASAAC pictograms → teacher taps to approve → student taps through cards → fading algorithm reduces visible cards as the student masters the routine. Work mode: worker pastes a manager's instruction → LLM returns numbered plain-language steps + any ambiguous terms flagged in plain English + one suggested clarifying question → worker taps through steps. Full app built, tested, and pushed to GitHub today.

**AI use**
Three LLM calls in the pipeline:
1. Instruction → base steps JSON (task analysis, icon keywords, reading-level-neutral)
2. Steps → per-student reading-level rewrites (3 parallel calls: grade2 / grade4 / grade6 / pictogram_only)
3. Work mode: instruction → steps + ambiguous_terms array + clarifying_question

All prompts are production-hardened: max 8 words per step, action verb first, no invented steps, no praise, no safety warnings. JSON schema validated before rendering. ARASAAC pictogram fetch uses a local 30-keyword fallback map for the most common step verbs (wash, pour, mix, stir, place, open, close, press, tap, wait) so pictograms appear even if the API is slow.

**Data use**
Fictional demo student profiles only (Leo, Sam, Alex — nicknames only, no real names, no diagnoses, no photos). Teacher and worker instruction text as typed/spoken. Free ARASAAC CC BY-NC-SA pictogram library. All localStorage only — no backend, no student data leaves the device. Full data model: `stepCards_students_v1`, `stepCards_shiftLog_v1`, `stepCards_prefs_v1`.

**Breakthroughs**
1. **Full working app shipped in one day:** React + Vite + Tailwind + Radix UI app with school mode (TeacherView, StudentView, StepCard, HelpNotice, TakeHomePage) and work mode (WorkInput, StepList, AmbiguousTerms, ClarifyQuestion, ShiftLog). 7 commits with proper Naman/Manan authorship. npm run build passes at 0 errors.
2. **Fading algorithm implemented:** `getVisibleCardCount()` — all cards first 2 runs, 75% on 3rd, 50% on 4th, 1 summary card after 5th. Directly implements NCAEP EBP "Prompting with systematic fading." Persisted in localStorage per student per routine.
3. **Teacher approval loop enforced:** Cards never reach student screens without teacher tap-to-approve. Private "Help me" signal visible only to teacher, not announced in class. Both are direct responses to AZACS visit debrief.
4. **BMC completed:** All 9 Strategyzer cells populated with real content from partner visits. Shortest bullet version prepared for Anand to paste into the fillable PDF. Committed to ResearchDocs/43_BUSINESS_MODEL_CANVAS.md.
5. **Pitch script drafted:** Full 5-minute script with per-slide timing, delivery notes, and 4 likely judge Q&A answers. Committed to ResearchDocs/44_PITCH_SCRIPT.md.
6. **Repo cleaned up:** HACKATHON_REFS renamed to ResearchDocs. Contributor emails corrected to GitHub noreply format so all four team members appear in the contributor graph. Repo is public.

**Blockers**
1. No real API key in the app yet — Naman needs to add `.env.local` with `VITE_OPENAI_API_KEY` and test all 3 LLM calls end-to-end on a real instruction before Nov 2.
2. Slides not started — Anand needs to begin filling the PPTX template from `_For Presenters/Presentation/`. Content brief is in ResearchDocs/42. Pitch script is in ResearchDocs/44.
3. BMC PDF not yet filled — Anand needs to transfer ResearchDocs/43 content into `_For Presenters/Business Model Canvas/NA AI CHALLENGE_BMC_Fillable.pdf`.
4. Demo recording not yet done — Manan records by Nov 3. Demo script is in ResearchDocs/40 section 15.
5. README not yet written — Dipesh writes Nov 1. Content spec in ResearchDocs/40 section 13.

**Challenge partner guidance**
AZACS (Maran — cooking, robotics, drone, coding classes): confirmed multi-step spoken instruction is the daily challenge, 1 staff per 3 students, daily parent journal used by every family. First Place AZ (Josh Munoz): about half of residents are employed; workers who struggle most are ones who receive verbal instructions and either freeze or ask to repeat. Both confirmed the same neurological failure point — working memory under load. Both confirmed shame-free, private help-seeking as a design requirement.

---

## Oct 27 — Report 3: Second Site Visit — First Place AZ (AM)

**Report type:** Partner visit debrief / solution pivot

---

**Problem description & target user**
Autistic adults and individuals with I/DD living at First Place AZ (and the 70,000+ per year who age out of school-based supports nationally). Today's guided tour of the full building with a senior First Place staff member confirmed and sharpened the core problem: residents have world-class physical infrastructure and a 1,600-activity-per-year calendar, but no independent way to see or track their own skill development. They rely entirely on staff to know how far they've come — which undermines the confidence and self-direction that First Place is explicitly trying to build.

**Solution description**
Shifting from a broad social connection scaffold to a resident-owned skill milestone tracker with AI-driven next-step suggestions. The tool would allow residents to log skill progress (cooking, money management, relationships, employment readiness) independently — without needing staff to confirm it — share milestones with family, and receive AI suggestions for what to work on next. Social and employment readiness milestones would be surfaced organically: "you've attended 3 cooking classes this month — you're ready to host a cooking night with a neighbor." This was a direct, unprompted product ask from the First Place staff member leading our tour.

**AI use**
AI layer suggests next-skill recommendations based on current milestone progress. Recognizes patterns across skill domains to connect social milestones (attending activities) to employment readiness signals and independence goals. Enables a personalized learning path without requiring clinical staff to generate it manually.

**Data use**
Primary: verbatim transcript from today's guided tour (full building walkthrough with Q&A). Key data points: 15,000 iGuard stove activations since 2018, $4,400/month resident cost, 3-month engagement timeline, wearable failure due to sensory issues (Amazon AWS trial), MyClip as the activity scheduling platform, three-department staff structure (Support / Community Life / Employment).

**Breakthroughs**
1. Direct product ask confirmed: staff explicitly said they want a resident-facing skill tracker with AI-suggested next steps — unprompted, specific, and validated technology as the right format.
2. Social connection is the confirmed keystone: "Once they have friends, they're more likely to want a job, more likely to clean their house." The social gap and the skill gap are the same gap.
3. Architecture insight: the entire building is a physical prototype for neurodiversity-first design (wayfinding by floor color, recessed doorways, wide hallways, key drop zones, LED lighting, sound dampening) — this gives us design principles to apply to the app UX.
4. Wearable failure lesson: Amazon AWS physiological wearable was tried and rejected universally due to sensory discomfort. Any hardware component must account for sensory profile.

**Blockers**
Need to confirm whether MyClip (the activity app mentioned in the tour) is the same product as LifeLoop (identified in pre-visit research) or a separate system. This affects whether we can build on top of activity data. Will clarify via follow-up with First Place or partner office hours.

---

## Oct 27 — Report 4: Deep Research Day — Post-Visit (PM)

**Report type:** PM research update / solution architecture

---

**Problem description & target user**
Autistic adults and individuals with I/DD at First Place AZ (and the 70,000+ who age out of school supports nationally each year). Today's AM site visit with Josh confirmed and sharpened two distinct but connected problems: (1) residents have no way to independently track their own skill development — they rely entirely on staff to know how far they've come; (2) when residents graduate to employment, they lose jobs at high rates because the support infrastructure disappears. Josh told us 50% of Be Open Be Ready graduates are employed — meaning 50% are not retaining employment. Both problems have no existing product solution. Both are solvable with the same AI layer.

**Solution description**
A two-layer resident-owned tool:

**Layer 1 (10-day MVP) — Skill Milestone Tracker:** Resident logs their own progress across First Place's 360 Health & Wellness domains (Physical, Social, Financial, Vocational, Mental). AI suggests next milestones based on current progress. Social milestones connect to employment readiness. Shareable with family and support team. Builds the confidence and self-direction First Place is explicitly designed to develop.

**Layer 2 (pitch vision) — Post-Hire Retention Coach:** Same app, activated when a resident is employed. Features: Situation Decoder (translate ambiguous manager feedback), Accommodation Navigator (conversational JAN functionality with ADA draft language), Review Prep Coach (30/90-day review preparation), Post-Shift Processing (log shift, identify patterns, flag stress triggers before they become crisis). The skill tracker data feeds the retention coach — a resident who has been working on "handling unexpected change" gets surfaced the schedule-change accommodation request template automatically.

**AI use**
LLM (Claude/GPT-4) with employer-specific system context (AMC Theaters, Phoenix Zoo, Aramark protocols). Few-shot library of workplace scenario interpretations. AI milestone suggestions from current skill state. Pattern recognition across post-shift logs. All designed for low-EF entry: voice or one-sentence text in → grounded, actionable output. Pre-built scenario buttons for when typing is too much.

**Data use**
Six research files compiled today (23–26 + visit debrief + job skills landscape):
- PMC9838300: employer-initiated termination study — social difficulties (16% of firings), challenges emerge early in probationary period
- Zhou, Richard & Kim (2025), *Journal of Vocational Rehabilitation*: 30-year scoping review confirms post-hire AT is underexplored; researchers explicitly call for active post-hire tools
- Singapore PMC13226117: autistic workers in participatory design study described exact feature set needed — EF scaffolding, communication drafting, self-reflection, not masking tools
- Springer 2026 (10.1007/s10803-026-07313-4): first LLM study in applied employment setting — AI improved emotionally responsive verbal communication in autistic interns
- Bennett et al. (2010): covert audio coaching produced durable job performance improvements maintained 4-5 weeks post-removal — the AI app is the scalable digital equivalent of this proven intervention
- Cureus 2025: 75% of autistic workers receive no adjustments; adjustments = 3.14× employment odds
- Georgia Tech NSF $500K (Jan 2026): LLM job coaching research — still pre-product, explicitly named post-probationary period as the unaddressed gap

**Breakthroughs**
1. **Solution architecture confirmed and defensible:** Three independent research streams (peer-reviewed scoping review, NSF-funded research, participatory user study) all converge on the same post-hire gap and the same solution direction. No product exists. Georgia Tech named the gap publicly and hasn't shipped. We're building it.
2. **The two layers are one product:** Skill tracker → employment → retention coach is a continuous journey. Data from Layer 1 informs Layer 2. The pitch is not two separate ideas — it's one longitudinal tool that follows a resident from building skills to keeping a job.
3. **Research-proven intervention model:** Covert Audio Coaching (Bennett 2010) establishes that real-time, in-context support for employed autistic adults produces durable skill transfer. The AI app is the next step in this evidence chain. We are not inventing a mechanism — we are scaling a proven one.
4. **Competitive landscape is clear white space:** Full competitor table built across 10 platforms. Not one product combines resident-facing + milestone-based + AI next-step suggestions + post-hire retention for autistic adults in service-sector employment. The closest (Georgia Tech) is still research. The rest are pre-hire only or staff-facing tools.
5. **Pitch narrative is locked:** SAP has 92% retention because they built job coaches, mentors, and manager training into the employment structure. AMC and the Phoenix Zoo don't have that. We built that infrastructure as an app.

**Blockers**
No technical blockers. Build planning begins tomorrow. Open question: confirm MyClip = LifeLoop (or separate). Open question: scope of Layer 1 vs. Layer 2 for the hackathon submission — leaning toward shipping Layer 1 fully and pitching Layer 2 as the vision.

---

## Oct 28 — Report 5: Research Completion + Design Foundation (AM/PM)

**Report type:** Research synthesis / product design foundation

---

**Problem description & target user**
Autistic adults and individuals with I/DD at First Place AZ — with confirmed co-occurring ADHD at high rates (Josh: "ADHD and autism are first cousins — really common"). The product must work for the full neurodivergent population, not just autism in isolation. Today's research focused on closing the design foundation: understanding the neurological mechanisms underneath what works, so every build decision is grounded in how these brains actually function — not how we assume they do.

**Solution description**
Unchanged from Oct 27 PM: two-layer resident-owned tool — skill milestone tracker (Layer 1, MVP) feeding into post-hire retention coach (Layer 2, pitch vision). Today's session added a critical design layer: the six ADHD neurological mechanisms that underlie every effective intervention for this population (Dr. Sasha Hamdani, psychiatrist, ADHD specialist). These mechanisms now serve as the product design filter — every feature must serve at least one of the six or it gets cut.

**AI use**
Same as Oct 27. Today added: shame-aware response architecture. The AI's first job in any difficult situation log is to externalize the cause before offering solutions. "Your manager communicated in a way that's genuinely hard to decode — that's a common structural gap, not a reflection on you." Research confirms shame directly crushes executive function (Hamdani); internalised blame is documented in 50% of autistic job loss cases (PMC9838300). An AI that inadvertently amplifies shame — through tone, failure-state messaging, or broken-streak notifications — will be abandoned.

**Data use**
Source: Dr. Sasha Hamdani transcript — "Learn 97% of ADHD Hacks in Under 17 Minutes" (psychiatrist, ADHD specialist, personal ADHD diagnosis). Six mechanisms extracted and mapped to specific product decisions:
1. **Externalize working memory** — skill log is the external memory; voice capture at shift end; app holds all context between sessions
2. **Engineer the start** — one-tap entry, pre-built scenario buttons, milestone units broken to smallest achievable step, minimum viable interaction path required for every feature
3. **Regulate stimulation** — gamification (streaks, micro-celebrations, progress bars) is neurologically required not optional; novelty rotation in AI responses; community life events surfaced as regulation tools
4. **Let the system rest** — no shame notifications for logging gaps; post-hard-shift response is validation first, advice second; "nothing much happened" is a valid session; app must never feel like a system to maintain
5. **Regulate the body** — Physical domain in 360 tracker is first-class; sleep routine + movement are milestones with direct employment impact
6. **Diffuse the shame** — the mechanism that determines whether every other feature gets used; every failure state, notification, and re-engagement flow must be written against shame

**Breakthroughs**
1. **Mechanism 6 is the product's secret weapon:** Shame is why every other productivity/tracking system gets abandoned by this population. The app that wins is not the most feature-rich one — it's the one that never makes someone feel bad for opening it. This is now an explicit design constraint, not an aspiration.
2. **The skill tracker is an anti-shame device:** A resident with 30 logged milestones has external evidence that contradicts the internal narrative of "I can't follow through." Progress history is the counter-narrative to self-blame after job loss.
3. **Design filter is complete:** Every feature will be evaluated against all six mechanisms before building. Features that fail mechanism 6 (shame) are cut or redesigned regardless of utility — shame prevents use regardless of how good the feature is.
4. **The pitch addition from mechanism 6:** "Nearly half of autistic adults who lose jobs blame themselves — 'my personality and weirdness.' Not the fact that their employer never communicated clearly or provided the adjustments they were legally entitled to. Our tool gives them a counter-narrative. Evidence that the system was hard, not that they were broken. That's neuroscience, not therapy."
5. **ADHD + autism co-occurrence confirmed as design requirement:** Product must work for the full population Josh described. ADHD-specific mechanisms (delayed initiation, stimulation threshold, dopamine dysregulation) apply directly to our users and must inform UX decisions.

**Blockers**
Research phase complete. Transitioning to build. No blockers on product direction — architecture, pitch narrative, design constraints, and feature set are all locked. Remaining open question: MyClip = LifeLoop confirmation (low priority for MVP — skill tracker does not depend on activity data integration for initial build).


---

## Oct 30 — Report 6: AZACS Visit + Step Cards Proposal (PM)

**Report type:** Partner visit debrief / school-stage proposal (submitted for Naman and Manan)
**Note:** the Oct 29 AM report (AZACS visit) was submitted on the form but not logged here; its content is folded in below and in [29_AZACS_VISIT_DEBRIEF_OCT29.md](29_AZACS_VISIT_DEBRIEF_OCT29.md).

---

**Problem description & target user**
Autistic students (often with ADHD) at Arizona Autism Charter Schools struggle to follow multi-step spoken instructions. They have to hold every step in working memory while doing the first one, so they lose track and look "off task." Teachers (about 1 staff member per 3 students) can't make visual supports for every instruction they say live, and skills learned at school often don't carry over to home. The same gap follows them into supported living (First Place AZ) and first jobs.

**Solution description**
Step Cards turns any spoken instruction into picture steps matched to each autistic student, and fades the help as they master it, from classroom to home to first job.

**AI use**
AI listens to a teacher's spoken instruction, breaks it into ordered steps (task analysis), and rewrites each step for every student's reading level and support needs, with pictograms. A fading rule shortens the cards as a student masters a routine. A teacher approves every card set, and "help me" always goes to a person.

**Data use**
Made-up demo student profiles only (nickname, reading level, support level, interests; no real names, photos or diagnoses). Teacher instructions as text. Free ARASAAC pictograms. The design is grounded in NCAEP 2020 evidence-based practices (task analysis, visual supports, prompting with fading, technology-aided instruction) and our AZACS and First Place AZ visits.

**Breakthroughs**
1. **AZACS visit (Oct 29):** classes are hands-on and multi-step (cooking, robotics, drone building, coding, dance), with 1 staff member per 3 students and a daily parent journal that parents read every day. Students could clearly recap what they were working on.
2. **The shared problem across both partners:** following multi-step instructions and carrying skills into real life. Step Cards targets it directly, and our adult "pocket coach" becomes the later stage of the same engine: school → home → First Place → first job.
3. **Verified evidence base:** Step Cards combines four of the 28 NCAEP 2020 evidence-based practices (Task Analysis, Visual Supports, Prompting, Technology-Aided Instruction & Intervention).
4. **Clear white space:** Goally and Choiceworks need adults to build every schedule ahead of time, and Goblin Tools and Tiimo are single-user planners. None turns a live classroom instruction into per-student steps with fading and a teacher loop.

**Blockers**
Need team sign-off on Step Cards before the Nov 1 build. Need AZACS to confirm that multi-step directions are a daily challenge and whether classes have tablets. Need to choose which AI model/API we have access to.

**Challenge partner guidance**
AZACS: hands-on multi-step classes, 1:3 staffing, and a daily parent journal we'll feed rather than replace. First Place AZ: ADHD and autism often co-occur, a wearable trial failed for sensory reasons (so app-only), and shame-free design is essential.

---

## Oct 29 — Report 7: Cross-Partner Synthesis + Step Cards Assessment (Dipesh, PM)

**Report type:** Partner comparison / product direction assessment

---

**Problem description & target user**
Two distinct partner populations sharing the same underlying neurological challenge. AZACS: autistic students (ages ~10–18, often AuDHD) who lose track of multi-step spoken instructions mid-task and look "off task" when the real problem is working memory overload. First Place AZ: autistic adults (18+, often AuDHD) who lose jobs not because they can't do the work but because they can't decode vague manager feedback, don't know how to request accommodations, and hit the probationary period without support. Different ages, same root cause: working memory failing under multi-step demand, in an environment designed for neurotypical cognition.

**Solution description**
Naman's Step Cards proposal (files 29–33) bridges the two partners into one product story for the first time. The same AI engine — take any instruction, break it into ordered steps, fade the help as the person masters it — serves a 12-year-old in a cooking class and a 22-year-old decoding a manager's message at AMC. The arc is now: AZACS classroom → home via parent journal → First Place AZ skill tracker → first job via pocket coach. One tool, one engine, four stages of a person's life.

**AI use**
Step Cards: speech-to-text → LLM breaks instruction into ordered JSON steps → second LLM pass rewrites each step for each student's reading level → ARASAAC pictograms mapped to step keywords → teacher approves → cards delivered to student tablets. Fading rule: once a student completes a routine X times without tapping "Help me," their card count reduces. Adult/work mode: same pipeline, text input instead of speech, adds one suggested clarifying question for ambiguous instructions ("How many cups counts as 'low'?").

**Data use**
Cross-partner synthesis drawn from: AZACS debrief (file 29), Step Cards proposal (file 30), Step Cards research (file 31), First Place visit debrief (file 22), post-hire retention research (files 25–26), ADHD mechanisms map (file 27), deep mechanisms research (file 28), Naman's team email (Oct 29 PM).

**The shared problem across both partners — mapped:**

| Common Challenge | At AZACS (student) | At First Place / Work (adult) |
|---|---|---|
| Working memory overload | Loses track of cooking steps mid-task | Forgets verbal manager instructions before acting on them |
| Multi-step instruction failure | "Get your tray, wash your hands, measure flour, wait" → freezes at step 2 | "Restock concessions before the rush, tell Jake if cups are low" → unclear on both parts |
| Support falls off | Aide redirects, which embarrasses → shame | Job coach exits at 90 days → no support during probation |
| Skill doesn't transfer | School skill doesn't carry home | Workplace skill doesn't carry across shift changes |
| Shame-free help-seeking | Won't raise hand in class | Won't ask manager to clarify instructions |
| No resident/student-owned record | Staff note progress, student can't see it | Support staff track milestones, resident can't see them |

Every design principle from files 27–28 (externalize working memory, engineer the start, diffuse shame, autistic inertia, monotropism) applies equally at both partners. The product is the same product.

**Breakthroughs**
1. **One story arc unlocked:** Before today the two partners felt like separate problems. Step Cards connects them. Leo at AZACS is Jordan at First Place in ten years. The pitch now has a human journey across the full product, not two disconnected features.
2. **Step Cards is rubric-strong:** Assessed against all 10 criteria — NCAEP 2020 evidence base (4 of 28 verified EBPs) directly addresses Principled Innovation; live instruction handling addresses Creativity/Vision; one golden demo path (speak → cards appear → student taps → teacher sees who's stuck) directly addresses MVP and Functionality.
3. **Fact-check flags from Naman accepted:** Three claims from earlier research files must be corrected before the deck: (a) Josh said "about half of graduates are employed" — not "50% lose their jobs"; (b) the SAP 92% retention figure has no verified source — drop it; (c) "job coaches leave at day 90" oversimplifies Arizona DES VR — coaches move to extended services after at least 90 days of stable work, not a hard cutoff.
4. **Role clarity:** Per Naman's proposed split — Dipesh owns research write-up, adult/work stage of Step Cards, executive summary, and roadmap. This aligns with the work already done in files 23–28.
5. **Adult mode is already designed:** The Situation Decoder (file 26) is the adult stage of the Step Cards engine. Jordan's manager saying "restock before the rush" maps exactly to the ambiguous feedback scenario. The adult mode adds one feature Step Cards doesn't have at school: a suggested clarifying question to ask the manager.

**Open questions / blockers**
- Team: need explicit sign-off that Step Cards is the product (not skill tracker alone) before Nov 1 build.
- AZACS: confirm multi-step directions are a daily challenge; confirm tablet availability; confirm non-speaking student count (pictogram-only mode priority).
- Josh / First Place: confirm exact wording of employment stat; confirm MyClip = LifeLoop; confirm most common work instruction types residents struggle with.
- Tech: confirm which AI API the challenge provides access to before paying for anything.

---

## Nov 1 — Report 9: Live App Deployment + Feature Sprint (Dipesh)

**Report type:** Build sprint / deployment / feature completion
**Submitted for:** Dipesh Gupta

---

**Problem description & target user**
Autistic and ADHD students (ages 8–18) at AZACS who lose track of multi-step spoken classroom instructions due to working memory overload. Step Cards is now a fully deployed web application — not a prototype — serving three classes in a demo school with real-time card delivery, fading, sticker books, and a teacher board. AZACS is the primary partner focus for this sprint; their hands-on multi-step class model (cooking, robotics, drone building, coding) is the exact use case the product is designed around.

**Solution description**
Step Cards v2: full-stack TanStack Start (React SSR) app deployed at **https://nuero-challange.vercel.app/** with Supabase backend, Groq AI (Qwen 3.8B), and ARASAAC pictograms. The app handles the full teacher → student → completion loop with real-time updates. New this sprint: two-column auth page (sign-in left, demo panel right), Google OAuth sign-in, teacher card editing for live/finished lessons, and expanded demo school (5 students per class: Leo, Mia, Cam, Sam, Jin).

**AI use**
Groq Qwen 3.8B (`qwen/qwen3.8-27b`) via the Vercel AI SDK (`generateObject`). Three-stage pipeline:
1. Instruction → base steps JSON (title, steps with timer_seconds and icon_keyword)
2. Steps → per-student reading-level rewrites (grade2 / grade4 / grade6 / pictogram_only)
3. On-demand picture search: ARASAAC symbol library queried per step keyword

All AI calls use JSON schema validation (`zod`) before rendering. The `/no_think` prefix disables the model's chain-of-thought mode for faster generation.

**Data use**
Demo school only — made-up nicknames (Leo, Mia, Cam, Sam, Jin), reading levels, avatar selections. No real student data, no photos, no diagnoses. ARASAAC CC BY-NC-SA pictograms. Teacher instruction text is stored only for reuse by the same teacher. All data in Supabase (dsihyvbricqkxufhegme project, RLS enabled on all tables).

**Breakthroughs**
1. **Live deployment:** Full SSR app on Vercel at https://nuero-challange.vercel.app/ — teachers and students can use it on any device with a browser, no install. Resolved a multi-step deployment issue (ESM bundling, Vercel Build Output API v3 format, `noExternal: true` for SSR bundle self-containment).
2. **Teacher card editing post-send:** "Change these cards" button on the live class board lets teachers edit any student's words, pictures, timer, or remove steps after cards are already in students' hands. Changes reach tablets within seconds via Supabase Realtime. Students keep their place even if steps are removed.
3. **Google OAuth added:** Teachers can sign in with Google — no password required. Supabase handles the OAuth flow.
4. **Two-column auth page:** Sign-in form on the left (email/Google), demo access panel on the right — reduces scrolling and makes the demo path immediately visible on wider screens.
5. **Expanded demo school:** Five students per class (Leo, Mia + Cam, Sam, Jin) gives reviewers a realistic class size without clutter. Leo and Mia have one-tap demo access; the others are visible in class data only.
6. **Old codebase removed from repo:** step-cards-old (the original Vite-only proof-of-concept) removed from git tracking and gitignored. The repo now contains only the production app.

**Blockers**
1. **Google OAuth requires Supabase dashboard configuration:** Google provider must be enabled in Supabase dashboard (Authentication → Providers → Google), with a Google Cloud OAuth app client ID and secret. The callback URL to register in Google Cloud Console is: `https://dsihyvbricqkxufhegme.supabase.co/auth/v1/callback`. This step is manual — one-time setup by the project owner.
2. **Demo students (Cam, Sam, Jin) need database seeding:** The seed-demo.js script now includes them, but the live Supabase database was seeded before this change. To add them: run `SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-demo.js` — or add them manually via the Supabase dashboard into the three demo classes.

**Challenge partner guidance**
AZACS is the primary focus for Step Cards. Maran at AZACS confirmed that multi-step spoken instructions are the daily challenge across all their hands-on classes — cooking, robotics, drone building, coding, dance — with approximately 1 staff member per 3 students. The daily parent journal that every AZACS family reads is a direct integration point: Step Cards' take-home print feature feeds that journal without requiring teachers to write summaries. Maran also confirmed that students can clearly recall what they were working on when given visual step support, which validates the core mechanism. Every product decision — the 1:3 staffing ratio driving the "one tap to approve, private help signal" design, the pictogram-only mode for non-speaking students, the fading algorithm to reduce scaffolding as students master routines, the parent-facing print sheet — traces directly to what we learned at AZACS. First Place AZ (Josh Munoz) confirmed the same working memory failure pattern in their employed residents, establishing that the Step Cards engine is the same tool at a different life stage: AZACS classroom → home → First Place AZ supported living → first job.

---

## Nov 2 — Report 10: Long-Instruction Splitting + Student Progress View (Dipesh)

**Report type:** Build sprint / rubric-driven feature pass
**Submitted for:** Dipesh Gupta

---

**Problem description & target user**
Same primary users as Report 9 (AZACS students, ages 8–18, autistic / ADHD / AuDHD). This sprint closed four gaps surfaced while rehearsing the demo against the AZACS cooking-class scenario: (1) teachers who read out long multi-step routines (8–12 steps) were getting AI output capped at 4–5 cards, which broke the fading evidence base; (2) teacher-side changes weren't reflecting cleanly in the demo flow; (3) the students roster page showed counts but had no way to see *which* stickers each student had actually earned or *which* routines they finished; (4) the sticker book was wired to real student picks but had no demo coverage, so judges opening the demo saw empty books.

**Solution description**
Four concrete changes shipped to the live app:
1. **Multi-part routines**: the AI prompt now returns a `{ title, parts: [{ title, steps }] }` shape. Long instructions (over 6 steps) are split into 1–4 sibling lessons with `routine_key` suffixed `:p1`, `:p2`, …, and titles suffixed `· Part k of N: <part title>`. The teacher review page shows a "Part k of N" chip and links to sibling parts.
2. **Students page revamp**: left column is a compact roster table (avatar, nickname, reading level, fading, finished count, sticker count, View/Edit buttons); right column is a live-lesson donut chart (Finished / Working on it / Not started) plus a class sticker summary showing the top-5 earned stickers in the class.
3. **Per-student drill-down**: tapping **View** on any student row expands to show that student's actual sticker book (color icons, ×N count badges), the full list of finished routines (title + sticker thumbnail + date + help-count chip), and any in-progress routines (`Step X of N`).
4. **Demo sticker variety**: the `add-demo-content.js` seeder now pins each demo student to a "favourite" sticker category (Alex → trains, River → dinosaurs, Mel → sea, Kai → space, Fen → wild) and draws from inside that category per finished lesson. On re-run it backfills `sticker_id` for existing demo cards. Opening the demo now shows real, coherent sticker collections instead of empty books.

**AI use**
Unchanged pipeline (Groq Qwen 3.8B via `generateObject`), only the output schema moved to `parts[]`. Backward-compatible: the Zod schema accepts both legacy `{ steps }` and new `{ parts }` shapes, so no in-flight data breaks. Each part still runs through the per-student reading-level rewrite and ARASAAC pictogram enrichment.

**Data use**
Demo school only — made-up nicknames, reading levels, avatar selections. No real student data. ARASAAC CC BY-NC-SA pictograms via `api.arasaac.org`. Teacher instruction text is stored and reused only within the same teacher. All writes go through Supabase RLS-protected tables.

**Breakthroughs**
1. **Fading EBP preserved**: the ≤6-steps-per-card constraint from NCAEP 2020 Systematic Fading (file 31) is now enforced structurally, not by prompt-wording that the model would sometimes ignore. Long real-world routines (handwashing with 20-second scrub, kitchen setup) finally fit the evidence base without truncation.
2. **Teacher accountability view**: a teacher can now open any student's row and see exactly what that student has finished, how many help taps they used, and which stickers they chose. This directly addresses the AZACS 1:3 staffing ratio problem — a staff member catching up on a student after absence gets the full picture in one tap.
3. **Demo flow matches real flow**: the sticker book was previously the one feature where demo data diverged from the live flow. It now mirrors a real kid's collection pattern (sticks to one favourite book, fills it in over multiple sessions), which makes the sticker-book tab land for judges.
4. **No schema migration required**: the multi-part design used suffix conventions on existing columns (`routine_key`, `title`) parseable via a shared `parsePartInfo` helper, so no DB migration was needed and the change was deployable the same day.

**Blockers**
1. **Demo students need backfill**: existing demo rows seeded before today have `sticker_id = null` on finished cards. Re-run `SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/add-demo-content.js` to backfill them deterministically. The script is idempotent.
2. **Pre-existing TypeScript errors in `ai.server.ts`, `vite.config.ts`, and three marketing routes remain** — unrelated to this sprint, flagged for cleanup pass before Nov 5 submission.

**Challenge partner guidance**
This sprint was motivated by rehearsing against the AZACS cooking-class scenario Maran described on Oct 29. Her exact example — "wash hands, dry, get your apron, measure flour, level it off, pour into bowl" — produced only 4 cards under the old prompt, dropping half the routine. With multi-part splitting it now produces two linked lessons (hand-washing + flour-measuring), each within the 6-card fading limit, each with its own completion sticker. The per-student view also matches Maran's workflow: AZACS staff rotate across students and need to catch up on who finished what — the drill-down panel is the view they currently keep on sticky notes.

---
